<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class InstagramService
{
    protected string $appId;
    protected string $appSecret;
    protected string $redirectUri;
    protected string $graphUrl;
    protected string $graphVersion;

    public function __construct()
    {
        $this->appId = (string) config('services.instagram.app_id');
        $this->appSecret = (string) config('services.instagram.app_secret');
        $this->redirectUri = (string) config('services.instagram.redirect_uri');
        $this->graphVersion = (string) (config('services.instagram.graph_version') ?? 'v19.0');
        $this->graphUrl = (string) (config('services.instagram.graph_url') ?? "https://graph.facebook.com/{$this->graphVersion}");
    }

    /**
     * Menghasilkan URL Dialog Login/Otorisasi Facebook untuk akses Instagram Graph API.
     *
     * @param array $scopes
     * @param string|null $state
     * @return string
     */
    public function getAuthorizationUrl(array $scopes = [], ?string $state = null): string
    {
        if (empty($scopes)) {
            $scopes = [
                'public_profile',
                'pages_show_list',
                'pages_read_engagement',
                'instagram_basic',
                'instagram_manage_comments',
                'instagram_manage_insights',
            ];
        }

        $params = [
            'client_id' => $this->appId,
            'redirect_uri' => $this->redirectUri,
            'scope' => implode(',', $scopes),
            'response_type' => 'code',
        ];

        if ($state) {
            $params['state'] = $state;
        }

        return "https://www.facebook.com/{$this->graphVersion}/dialog/oauth?" . http_build_query($params);
    }

    /**
     * Menukar Authorization Code dari callback menjadi Short-Lived Access Token.
     *
     * @param string $code
     * @return array
     * @throws Exception
     */
    public function getAccessTokenFromCode(string $code): array
    {
        try {
            $response = Http::asForm()->post("{$this->graphUrl}/oauth/access_token", [
                'client_id' => $this->appId,
                'client_secret' => $this->appSecret,
                'redirect_uri' => $this->redirectUri,
                'code' => $code,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal menukar code dengan access token Meta.';
                Log::error('Instagram OAuth Error (getAccessTokenFromCode)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (getAccessTokenFromCode): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Menukar Short-Lived User Access Token menjadi Long-Lived User Access Token (berlaku ~60 hari).
     *
     * @param string $shortLivedToken
     * @return array
     * @throws Exception
     */
    public function getLongLivedAccessToken(string $shortLivedToken): array
    {
        try {
            $response = Http::get("{$this->graphUrl}/oauth/access_token", [
                'grant_type' => 'fb_exchange_token',
                'client_id' => $this->appId,
                'client_secret' => $this->appSecret,
                'fb_exchange_token' => $shortLivedToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal memperpanjang masa berlaku token Meta.';
                Log::error('Instagram OAuth Error (getLongLivedAccessToken)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (getLongLivedAccessToken): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mengambil daftar Facebook Pages milik pengguna dan mengekstrak akun Instagram Bisnis/Kreator yang terhubung.
     *
     * @param string $userAccessToken
     * @return array
     * @throws Exception
     */
    public function getConnectedInstagramAccounts(string $userAccessToken): array
    {
        try {
            $response = Http::get("{$this->graphUrl}/me/accounts", [
                'fields' => 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}',
                'access_token' => $userAccessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil akun Instagram yang terhubung.';
                Log::error('Instagram API Error (getConnectedInstagramAccounts)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            $pages = $response->json('data') ?? [];
            $connectedAccounts = [];

            foreach ($pages as $page) {
                if (!empty($page['instagram_business_account'])) {
                    $ig = $page['instagram_business_account'];
                    $connectedAccounts[] = [
                        'page_id' => $page['id'],
                        'page_name' => $page['name'],
                        'page_access_token' => $page['access_token'] ?? $userAccessToken,
                        'instagram_id' => $ig['id'],
                        'username' => $ig['username'] ?? '',
                        'name' => $ig['name'] ?? '',
                        'profile_picture_url' => $ig['profile_picture_url'] ?? null,
                        'followers_count' => $ig['followers_count'] ?? 0,
                        'media_count' => $ig['media_count'] ?? 0,
                    ];
                }
            }

            return $connectedAccounts;
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (getConnectedInstagramAccounts): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mengambil detail lengkap akun Instagram Bisnis/Kreator berdasarkan ID Instagram.
     *
     * @param string $igUserId
     * @param string $accessToken
     * @return array
     * @throws Exception
     */
    public function getAccountDetails(string $igUserId, string $accessToken): array
    {
        try {
            $response = Http::get("{$this->graphUrl}/{$igUserId}", [
                'fields' => 'id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count',
                'access_token' => $accessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil detail akun Instagram.';
                Log::error('Instagram API Error (getAccountDetails)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (getAccountDetails): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mengambil daftar postingan (media) terbaru dari akun Instagram.
     *
     * @param string $igUserId
     * @param string $accessToken
     * @param int $limit
     * @return array
     * @throws Exception
     */
    public function getUserMedia(string $igUserId, string $accessToken, int $limit = 10): array
    {
        try {
            $response = Http::get("{$this->graphUrl}/{$igUserId}/media", [
                'fields' => 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,comments_count,like_count',
                'limit' => $limit,
                'access_token' => $accessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil daftar postingan Instagram.';
                Log::error('Instagram API Error (getUserMedia)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json('data') ?? [];
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (getUserMedia): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mengambil komentar-komentar dari suatu postingan Instagram.
     *
     * @param string $mediaId
     * @param string $accessToken
     * @param int $limit
     * @return array
     * @throws Exception
     */
    public function getMediaComments(string $mediaId, string $accessToken, int $limit = 50): array
    {
        try {
            $response = Http::get("{$this->graphUrl}/{$mediaId}/comments", [
                'fields' => 'id,text,timestamp,username,like_count,hidden,replies{id,text,username,timestamp}',
                'limit' => $limit,
                'access_token' => $accessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil komentar postingan Instagram.';
                Log::error('Instagram API Error (getMediaComments)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json('data') ?? [];
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (getMediaComments): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Moderasi: Menyembunyikan atau menampilkan kembali komentar di Instagram.
     *
     * @param string $commentId
     * @param string $accessToken
     * @param bool $hide
     * @return bool
     * @throws Exception
     */
    public function hideComment(string $commentId, string $accessToken, bool $hide = true): bool
    {
        try {
            $response = Http::asForm()->post("{$this->graphUrl}/{$commentId}", [
                'hide' => $hide ? 'true' : 'false',
                'access_token' => $accessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal memperbarui status sembunyikan komentar Instagram.';
                Log::error('Instagram API Error (hideComment)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json('success') ?? true;
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (hideComment): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Moderasi: Menghapus komentar dari Instagram secara permanen.
     *
     * @param string $commentId
     * @param string $accessToken
     * @return bool
     * @throws Exception
     */
    public function deleteComment(string $commentId, string $accessToken): bool
    {
        try {
            $response = Http::delete("{$this->graphUrl}/{$commentId}", [
                'access_token' => $accessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal menghapus komentar Instagram.';
                Log::error('Instagram API Error (deleteComment)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json('success') ?? true;
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (deleteComment): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Membalas komentar netizen di Instagram.
     *
     * @param string $commentId
     * @param string $message
     * @param string $accessToken
     * @return array
     * @throws Exception
     */
    public function replyToComment(string $commentId, string $message, string $accessToken): array
    {
        try {
            $response = Http::asForm()->post("{$this->graphUrl}/{$commentId}/replies", [
                'message' => $message,
                'access_token' => $accessToken,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal membalas komentar Instagram.';
                Log::error('Instagram API Error (replyToComment)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Instagram Service Exception (replyToComment): ' . $e->getMessage());
            throw $e;
        }
    }
}
