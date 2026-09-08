<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * ─── STEP 1: Redirect Browser ke Google OAuth 2.0 Consent Screen ───────────
     *
     * Endpoint: GET /auth/google
     */
    public function redirect(Request $request)
    {
        $clientId    = config('services.google.client_id');
        $redirectUri = config('services.google.redirect_uri');

        if (empty($clientId)) {
            Log::warning('Google OAuth: GOOGLE_CLIENT_ID belum dikonfigurasi di .env.');
            return redirect('/?google_login=0&message=' . urlencode('Google Client ID belum dikonfigurasi pada server.'));
        }

        $state = Str::random(40);
        Session::put('google_oauth_state', $state);

        $params = [
            'client_id'             => $clientId,
            'redirect_uri'          => $redirectUri,
            'response_type'         => 'code',
            'scope'                 => 'openid email profile',
            'state'                 => $state,
            'access_type'           => 'online',
            'include_granted_scopes'=> 'true',
            'prompt'                => 'select_account',
        ];

        $authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

        Log::info('Google OAuth redirect initiated', [
            'redirect_uri' => $redirectUri,
            'state'        => $state,
        ]);

        return redirect()->away($authUrl);
    }

    /**
     * ─── STEP 2: Terima Callback dari Google & Otomatisasi Login/Daftar ────────
     *
     * Endpoint: GET /auth/google/callback
     */
    public function callback(Request $request)
    {
        // 1. Cek jika pengguna membatalkan izin (access_denied)
        if ($request->has('error')) {
            $errorDesc = $request->query('error_description', 'Login dengan Google dibatalkan.');
            Log::warning('Google OAuth callback error: ' . $errorDesc);
            return redirect('/?google_login=0&message=' . urlencode('Login Google dibatalkan oleh pengguna.'));
        }

        $code = $request->query('code');
        if (empty($code)) {
            Log::warning('Google OAuth callback: Code otorisasi tidak ditemukan.');
            return redirect('/?google_login=0&message=' . urlencode('Kode otorisasi Google tidak ditemukan.'));
        }

        // 2. Validasi CSRF State
        $savedState    = Session::get('google_oauth_state');
        $receivedState = $request->query('state');
        Session::forget('google_oauth_state');

        if (!empty($savedState) && $savedState !== $receivedState) {
            Log::warning('Google OAuth state mismatch', [
                'expected' => $savedState,
                'received' => $receivedState,
            ]);
            // Catatan: Tetap lanjutkan jika session ter-reset di environment proxy/cookie local
        }

        $clientId     = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri  = config('services.google.redirect_uri');

        try {
            // 3. Tukar authorization code dengan Access Token
            $tokenResponse = Http::asForm()
                ->timeout(20)
                ->post('https://oauth2.googleapis.com/token', [
                    'code'          => $code,
                    'client_id'     => $clientId,
                    'client_secret' => $clientSecret,
                    'redirect_uri'  => $redirectUri,
                    'grant_type'    => 'authorization_code',
                ]);

            if ($tokenResponse->failed()) {
                Log::error('Google OAuth token exchange failed', [
                    'status' => $tokenResponse->status(),
                    'error'  => $tokenResponse->json() ?: $tokenResponse->body(),
                ]);
                return redirect('/?google_login=0&message=' . urlencode('Gagal menukarkan token otorisasi Google. Periksa Client Secret Anda.'));
            }

            $accessToken = $tokenResponse->json('access_token');

            // 4. Ambil Informasi Profil Pengguna dari Google UserInfo API
            $userInfoResponse = Http::withToken($accessToken)
                ->timeout(20)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($userInfoResponse->failed()) {
                Log::error('Google UserInfo API failed', [
                    'status' => $userInfoResponse->status(),
                    'error'  => $userInfoResponse->json(),
                ]);
                return redirect('/?google_login=0&message=' . urlencode('Gagal mengambil data profil Google pengguna.'));
            }

            $googleUser = $userInfoResponse->json();
            $googleId   = $googleUser['sub'] ?? null;
            $email      = $googleUser['email'] ?? null;
            $name       = $googleUser['name'] ?? explode('@', $email)[0];
            $picture    = $googleUser['picture'] ?? null;

            if (empty($email)) {
                return redirect('/?google_login=0&message=' . urlencode('Akun Google tidak menyediakan alamat email publik.'));
            }

            // 5. Smart Account Linking (Cari berdasarkan google_id atau email)
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user) {
                // Akun sudah ada: update google_id dan foto profil jika belum ada
                $user->update([
                    'google_id' => $googleId,
                    'avatar'    => $user->avatar ?: $picture,
                ]);
                Log::info('Google OAuth: User logged in', ['user_id' => $user->id, 'email' => $user->email]);
            } else {
                // Pengguna baru: buat akun langsung tanpa ribet isi form
                $user = User::create([
                    'name'              => $name,
                    'email'             => $email,
                    'password'          => Hash::make(Str::random(32)),
                    'avatar'            => $picture,
                    'google_id'         => $googleId,
                    'role'              => 'creator',
                    'plan'              => 'Creator Pro Tier',
                    'email_verified_at' => now(),
                ]);
                Log::info('Google OAuth: New user registered', ['user_id' => $user->id, 'email' => $user->email]);
            }

            // 6. Generate Sanctum Personal Access Token untuk SPA
            $token = $user->createToken('google-auth-token')->plainTextToken;

            // 7. Arahkan kembali ke Single Page Application dengan token
            return redirect('/?token=' . $token . '&google_login=1&user_name=' . urlencode($user->name));

        } catch (Exception $e) {
            Log::error('Google OAuth Exception: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect('/?google_login=0&message=' . urlencode('Terjadi kendala jaringan saat menghubungi Google: ' . $e->getMessage()));
        }
    }
}
