<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Services\InstagramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class InstagramAuthController extends Controller
{
    protected InstagramService $instagramService;

    public function __construct(InstagramService $instagramService)
    {
        $this->instagramService = $instagramService;
    }

    /**
     * ─── STEP 1: Redirect Browser ke Halaman Login Meta ─────────────────────
     *
     * Endpoint: GET /auth/instagram
     *
     * Menghasilkan state CSRF acak untuk mencegah serangan CSRF di alur OAuth,
     * menyimpannya di session, lalu me-redirect browser pengguna ke dialog
     * otorisasi resmi Facebook/Meta.
     */
    public function redirect(Request $request)
    {
        // Simpan user_id yang meminta koneksi (untuk digunakan di callback)
        // karena setelah redirect ke Meta, session Sanctum mungkin tidak tersedia
        $state = Str::random(40);
        Session::put('instagram_oauth_state', $state);
        Session::put('instagram_oauth_user_id', $request->user()?->id ?? $request->query('user_id'));

        $authUrl = $this->instagramService->getAuthorizationUrl(
            [
                'public_profile',
                'pages_show_list',
                'pages_read_engagement',
                'instagram_basic',
                'instagram_manage_comments',
                'instagram_manage_insights',
            ],
            $state
        );

        Log::info('Instagram OAuth redirect initiated', [
            'user_id' => Session::get('instagram_oauth_user_id'),
            'state' => $state,
        ]);

        return redirect()->away($authUrl);
    }

    /**
     * ─── STEP 2: Terima Callback dari Meta & Simpan Token ───────────────────
     *
     * Endpoint: GET /auth/instagram/callback
     *
     * Meta akan me-redirect ke URL ini setelah pengguna mengizinkan / menolak
     * akses. Kita validasi state CSRF, tukar code menjadi Long-Lived Token,
     * ambil akun Instagram yang terhubung, lalu simpan ke database.
     */
    public function callback(Request $request)
    {
        // ── Cek jika pengguna MENOLAK (Cancel) di dialog Meta ────────────────
        if ($request->has('error')) {
            Log::warning('Instagram OAuth denied by user', [
                'error' => $request->query('error'),
                'reason' => $request->query('error_reason'),
            ]);
            return $this->redirectToFrontendWithResult(
                success: false,
                message: 'Koneksi Instagram dibatalkan oleh pengguna.'
            );
        }

        // ── Validasi State CSRF ──────────────────────────────────────────────
        $state = $request->query('state');
        $savedState = Session::pull('instagram_oauth_state');
        $userId = Session::pull('instagram_oauth_user_id');

        if (!$state || $state !== $savedState) {
            Log::error('Instagram OAuth state mismatch', [
                'received' => $state,
                'expected' => $savedState,
            ]);
            return $this->redirectToFrontendWithResult(
                success: false,
                message: 'Verifikasi keamanan gagal. Silakan coba hubungkan kembali.'
            );
        }

        $code = $request->query('code');
        if (!$code) {
            return $this->redirectToFrontendWithResult(
                success: false,
                message: 'Kode otorisasi dari Meta tidak ditemukan.'
            );
        }

        try {
            // ── Tukar Authorization Code → Short-Lived Token ─────────────────
            $shortLivedData = $this->instagramService->getAccessTokenFromCode($code);
            $shortLivedToken = $shortLivedData['access_token'];

            // ── Perpanjang Short-Lived → Long-Lived Token (berlaku 60 hari) ──
            $longLivedData = $this->instagramService->getLongLivedAccessToken($shortLivedToken);
            $longLivedToken = $longLivedData['access_token'];
            $expiresIn = $longLivedData['expires_in'] ?? (60 * 24 * 60 * 60); // default 60 hari
            $tokenExpiresAt = Carbon::now()->addSeconds($expiresIn);

            // ── Ambil daftar akun Instagram Bisnis yang terhubung ─────────────
            $connectedAccounts = $this->instagramService->getConnectedInstagramAccounts($longLivedToken);

            if (empty($connectedAccounts)) {
                return $this->redirectToFrontendWithResult(
                    success: false,
                    message: 'Tidak ditemukan akun Instagram Bisnis/Kreator yang terhubung ke Halaman Facebook Anda. Pastikan akun Instagram Anda sudah diubah ke mode Profesional dan terhubung ke Facebook Page.'
                );
            }

            // ── Simpan setiap akun Instagram yang ditemukan ke database ───────
            $savedAccounts = [];

            foreach ($connectedAccounts as $igAccount) {
                $socialAccount = SocialAccount::updateOrCreate(
                    [
                        // Identifikasi unik: kombinasi user_id + instagram_id
                        'user_id' => $userId,
                        'instagram_id' => $igAccount['instagram_id'],
                    ],
                    [
                        'platform' => 'instagram',
                        'handle' => '@' . ltrim($igAccount['username'], '@'),
                        'page_id' => $igAccount['page_id'],
                        'access_token' => $longLivedToken,
                        'page_access_token' => $igAccount['page_access_token'],
                        'token_expires_at' => $tokenExpiresAt,
                        'followers_count' => $igAccount['followers_count'] ?? 0,
                        'avatar_url' => $igAccount['profile_picture_url'] ?? null,
                    ]
                );

                $savedAccounts[] = $socialAccount->handle;

                Log::info('Instagram account connected successfully', [
                    'user_id' => $userId,
                    'instagram_id' => $igAccount['instagram_id'],
                    'handle' => $socialAccount->handle,
                    'expires_at' => $tokenExpiresAt->toDateTimeString(),
                ]);
            }

            $accountNames = implode(', ', $savedAccounts);

            return $this->redirectToFrontendWithResult(
                success: true,
                message: "Berhasil menghubungkan akun Instagram: {$accountNames}"
            );
        } catch (Exception $e) {
            Log::error('Instagram OAuth callback error: ' . $e->getMessage());
            return $this->redirectToFrontendWithResult(
                success: false,
                message: 'Terjadi kesalahan saat menghubungkan akun Instagram. Silakan coba kembali.'
            );
        }
    }

    /**
     * ─── API: Perbarui Long-Lived Token yang Hampir Kedaluwarsa ─────────────
     *
     * Endpoint: POST /api/social-accounts/{id}/refresh-token
     *
     * Long-Lived Token Meta perlu diperbarui setidaknya sekali sebelum kedaluwarsa
     * 60 hari. Endpoint ini memungkinkan sistem SABAR memperbarui token secara
     * manual dari dashboard tanpa pengguna harus login ulang ke Meta.
     */
    public function refreshToken(Request $request, int $socialAccountId)
    {
        $socialAccount = SocialAccount::where('id', $socialAccountId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$socialAccount->access_token) {
            return response()->json(['message' => 'Tidak ada access token yang tersimpan untuk akun ini.'], 422);
        }

        try {
            $refreshedData = $this->instagramService->getLongLivedAccessToken(
                $socialAccount->access_token
            );

            $newToken = $refreshedData['access_token'];
            $expiresIn = $refreshedData['expires_in'] ?? (60 * 24 * 60 * 60);

            $socialAccount->update([
                'access_token' => $newToken,
                'token_expires_at' => Carbon::now()->addSeconds($expiresIn),
            ]);

            Log::info('Instagram token refreshed successfully', [
                'social_account_id' => $socialAccountId,
                'expires_at' => $socialAccount->fresh()->token_expires_at->toDateTimeString(),
            ]);

            return response()->json([
                'message' => 'Token berhasil diperbarui.',
                'expires_at' => $socialAccount->fresh()->token_expires_at,
            ]);
        } catch (Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memperbarui token. Silakan hubungkan ulang akun Instagram Anda.'], 500);
        }
    }

    /**
     * ─── HELPER: Redirect ke Frontend dengan Pesan Status ───────────────────
     *
     * Setelah proses callback selesai, redirect ke React SPA dengan membawa
     * parameter status yang akan ditampilkan sebagai notifikasi di UI.
     */
    private function redirectToFrontendWithResult(bool $success, string $message): \Illuminate\Http\RedirectResponse
    {
        $params = http_build_query([
            'instagram_connected' => $success ? '1' : '0',
            'message' => $message,
        ]);

        return redirect("/?{$params}");
    }
}
