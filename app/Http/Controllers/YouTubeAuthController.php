<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Services\YouTubeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class YouTubeAuthController extends Controller
{
    protected YouTubeService $youtubeService;

    public function __construct(YouTubeService $youtubeService)
    {
        $this->youtubeService = $youtubeService;
    }

    /**
     * ─── STEP 1: Redirect Browser ke Halaman Login Google ────────────────────
     *
     * Endpoint: GET /auth/youtube
     *
     * Membuat state CSRF acak, menyimpannya di session, lalu mengarahkan
     * pengguna ke halaman persetujuan Google OAuth.
     * State juga menyimpan user_id agar bisa diidentifikasi saat callback.
     */
    public function redirect(Request $request)
    {
        $state  = Str::random(40);
        $userId = $request->user()?->id ?? $request->query('user_id');

        Session::put('youtube_oauth_state', $state);
        Session::put('youtube_oauth_user_id', $userId);

        $authUrl = $this->youtubeService->getAuthorizationUrl($state);

        Log::info('YouTube OAuth redirect initiated', [
            'user_id' => $userId,
            'state'   => $state,
        ]);

        return redirect()->away($authUrl);
    }

    /**
     * ─── STEP 2: Terima Callback dari Google & Simpan Token ──────────────────
     *
     * Endpoint: GET /auth/youtube/callback
     *
     * Google akan mengarahkan kembali ke URL ini setelah pengguna
     * mengizinkan/menolak akses. Kita validasi state CSRF, tukar code
     * menjadi token, ambil detail channel, lalu simpan ke database.
     */
    public function callback(Request $request)
    {
        // ── Cek jika pengguna MENOLAK (Cancel) di dialog Google ───────────────
        if ($request->has('error')) {
            Log::warning('YouTube OAuth denied by user', [
                'error' => $request->query('error'),
            ]);
            return $this->redirectToFrontendWithResult(
                success: false,
                message: 'Koneksi YouTube dibatalkan oleh pengguna.'
            );
        }

        // ── Validasi State CSRF ───────────────────────────────────────────────
        $state     = $request->query('state');
        $savedState = Session::pull('youtube_oauth_state');
        $userId    = Session::pull('youtube_oauth_user_id');

        if (!$state || $state !== $savedState) {
            Log::error('YouTube OAuth state mismatch', [
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
                message: 'Kode otorisasi dari Google tidak ditemukan.'
            );
        }

        try {
            // ── Tukar Authorization Code → Access Token & Refresh Token ───────
            $tokenData    = $this->youtubeService->getAccessTokenFromCode($code);
            $accessToken  = $tokenData['access_token'];
            $refreshToken = $tokenData['refresh_token'] ?? null;
            $expiresIn    = $tokenData['expires_in'] ?? 3600;
            $tokenExpiresAt = Carbon::now()->addSeconds($expiresIn);

            // ── Ambil detail channel YouTube ──────────────────────────────────
            $channelData = $this->youtubeService->getChannelDetails($accessToken);

            // ── Simpan/perbarui akun YouTube di database ──────────────────────
            $updateData = [
                'platform'           => 'youtube',
                'handle'             => '@' . $this->slugifyChannelName($channelData['title']),
                'youtube_channel_id' => $channelData['channel_id'],
                'access_token'       => $accessToken,
                'token_expires_at'   => $tokenExpiresAt,
                'followers_count'    => $channelData['subscriber_count'],
                'avatar_url'         => $channelData['thumbnail_url'],
            ];

            // Refresh token hanya ada saat pertama kali — jangan timpa dengan null
            if ($refreshToken) {
                $updateData['youtube_refresh_token'] = $refreshToken;
            }

            $socialAccount = SocialAccount::updateOrCreate(
                [
                    'user_id'            => $userId,
                    'youtube_channel_id' => $channelData['channel_id'],
                ],
                $updateData
            );

            Log::info('YouTube channel connected successfully', [
                'user_id'    => $userId,
                'channel_id' => $channelData['channel_id'],
                'handle'     => $socialAccount->handle,
                'expires_at' => $tokenExpiresAt->toDateTimeString(),
            ]);

            return $this->redirectToFrontendWithResult(
                success: true,
                message: "Berhasil menghubungkan channel YouTube: {$channelData['title']}"
            );
        } catch (Exception $e) {
            Log::error('YouTube OAuth callback error: ' . $e->getMessage());
            return $this->redirectToFrontendWithResult(
                success: false,
                message: 'Terjadi kesalahan saat menghubungkan YouTube: ' . $e->getMessage()
            );
        }
    }

    /**
     * ─── HELPER: Redirect ke Frontend dengan Pesan Status ───────────────────
     */
    private function redirectToFrontendWithResult(bool $success, string $message): \Illuminate\Http\RedirectResponse
    {
        $params = http_build_query([
            'youtube_connected' => $success ? '1' : '0',
            'message'           => $message,
        ]);

        return redirect("/?{$params}");
    }

    /**
     * ─── HELPER: Ubah nama channel menjadi format handle-friendly ───────────
     * Contoh: "Adiar Syah Putra" → "adiar_syah_putra"
     */
    private function slugifyChannelName(string $name): string
    {
        return strtolower(preg_replace('/[^a-zA-Z0-9]+/', '_', trim($name)));
    }
}
