<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ─── YouTubeService ───────────────────────────────────────────────────────────
 *
 * Layanan ini adalah jembatan antara sistem SABAR dan Google OAuth 2.0
 * serta YouTube Data API v3. Bertanggung jawab untuk:
 *
 * 1. Membuat URL otorisasi OAuth untuk redirect pengguna ke Google Login.
 * 2. Menukar authorization code menjadi Access Token & Refresh Token.
 * 3. Memperbarui Access Token yang kedaluwarsa menggunakan Refresh Token.
 * 4. Mengambil detail channel YouTube milik pengguna.
 * 5. Mengambil video-video terbaru dari channel.
 * 6. Mengambil komentar dari setiap video.
 * 7. Melakukan moderasi komentar (sembunyikan/hapus) via YouTube API.
 *
 * Perbedaan penting dengan InstagramService:
 * - Token YouTube (Access Token) hanya berlaku 3600 detik (~1 jam).
 *   Oleh karena itu kita menyimpan Refresh Token yang tidak habis masa berlakunya.
 * - Refresh Token digunakan untuk mendapatkan Access Token baru secara otomatis.
 */
class YouTubeService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;
    protected string $apiUrl;
    protected string $oauthUrl;
    protected array $scopes;

    public function __construct()
    {
        $this->clientId     = (string) config('services.youtube.client_id');
        $this->clientSecret = (string) config('services.youtube.client_secret');
        $this->redirectUri  = (string) config('services.youtube.redirect_uri');
        $this->apiUrl       = (string) config('services.youtube.api_url', 'https://www.googleapis.com/youtube/v3');
        $this->oauthUrl     = (string) config('services.youtube.oauth_url', 'https://oauth2.googleapis.com');
        $this->scopes       = (array)  config('services.youtube.scope', [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl',
        ]);
    }

    /**
     * ─── STEP 1: Buat URL Otorisasi Google OAuth 2.0 ─────────────────────────
     *
     * Menghasilkan URL yang akan mengarahkan pengguna ke halaman persetujuan Google.
     * Parameter `access_type=offline` wajib agar kita mendapatkan Refresh Token.
     * Parameter `prompt=consent` memaksa Google menampilkan layar persetujuan ulang
     * agar Refresh Token selalu dikirimkan (tidak hanya saat pertama kali).
     *
     * @param string|null $state Token CSRF untuk keamanan
     * @return string URL dialog otorisasi Google
     */
    public function getAuthorizationUrl(?string $state = null): string
    {
        $params = [
            'client_id'     => $this->clientId,
            'redirect_uri'  => $this->redirectUri,
            'response_type' => 'code',
            'scope'         => implode(' ', $this->scopes),
            'access_type'   => 'offline',   // Diperlukan untuk mendapatkan Refresh Token
            'prompt'        => 'consent',   // Paksa tampilkan consent screen agar refresh_token selalu dikirim
        ];

        if ($state) {
            $params['state'] = $state;
        }

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }

    /**
     * ─── STEP 2: Tukar Authorization Code → Access Token + Refresh Token ─────
     *
     * Setelah pengguna menyetujui di Google, kita menerima 'code' di callback.
     * Code ini ditukar ke token yang bisa dipakai untuk request ke YouTube API.
     *
     * Response berisi:
     * - access_token  : Token untuk request API (berlaku ~3600 detik / 1 jam)
     * - refresh_token : Token untuk memperbarui access_token (tidak kedaluwarsa)
     * - expires_in    : Durasi berlaku access_token dalam detik
     * - token_type    : 'Bearer'
     *
     * @param string $code Authorization code dari Google
     * @return array Array berisi access_token, refresh_token, expires_in, dll
     * @throws Exception Jika request ke Google gagal
     */
    public function getAccessTokenFromCode(string $code): array
    {
        try {
            $response = Http::asForm()->post("{$this->oauthUrl}/token", [
                'code'          => $code,
                'client_id'     => $this->clientId,
                'client_secret' => $this->clientSecret,
                'redirect_uri'  => $this->redirectUri,
                'grant_type'    => 'authorization_code',
            ]);

            if ($response->failed()) {
                $error = $response->json('error_description') ?? $response->json('error') ?? 'Gagal menukar code dengan token Google.';
                Log::error('YouTube OAuth Error (getAccessTokenFromCode)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            $data = $response->json();

            // Validasi: refresh_token harus ada di respons pertama
            if (empty($data['refresh_token'])) {
                Log::warning('YouTube OAuth: Refresh token tidak ada di respons. Pastikan `prompt=consent` dan `access_type=offline` diset.', [
                    'response_keys' => array_keys($data),
                ]);
            }

            return $data;
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (getAccessTokenFromCode): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ─── STEP 3: Perbarui Access Token menggunakan Refresh Token ─────────────
     *
     * Dipanggil otomatis saat sync komentar jika access_token sudah kedaluwarsa.
     * Refresh Token tersimpan permanen di database dan tidak perlu login ulang.
     *
     * @param string $refreshToken Refresh token yang tersimpan di database
     * @return array Array berisi access_token baru dan expires_in
     * @throws Exception Jika request ke Google gagal
     */
    public function refreshAccessToken(string $refreshToken): array
    {
        try {
            $response = Http::asForm()->post("{$this->oauthUrl}/token", [
                'client_id'     => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $refreshToken,
                'grant_type'    => 'refresh_token',
            ]);

            if ($response->failed()) {
                $error = $response->json('error_description') ?? $response->json('error') ?? 'Gagal memperbarui access token Google.';
                Log::error('YouTube OAuth Error (refreshAccessToken)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (refreshAccessToken): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ─── Ambil Detail Channel YouTube Milik Pengguna ─────────────────────────
     *
     * Menggunakan `part=snippet,statistics` untuk mendapatkan:
     * - id               : ID Channel (UCxxxxxxxxxx)
     * - snippet.title    : Nama Channel
     * - snippet.thumbnails: Foto profil channel
     * - statistics.subscriberCount: Jumlah subscriber
     *
     * @param string $accessToken Token akses yang valid
     * @return array Data channel YouTube
     * @throws Exception Jika request ke API gagal atau channel tidak ditemukan
     */
    public function getChannelDetails(string $accessToken): array
    {
        try {
            $response = Http::withToken($accessToken)->get("{$this->apiUrl}/channels", [
                'part' => 'snippet,statistics',
                'mine' => 'true',
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil detail channel YouTube.';
                Log::error('YouTube API Error (getChannelDetails)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            $items = $response->json('items') ?? [];

            if (empty($items)) {
                throw new Exception('Tidak ditemukan channel YouTube yang terhubung dengan akun Google ini.');
            }

            $channel = $items[0];

            return [
                'channel_id'       => $channel['id'],
                'title'            => $channel['snippet']['title'] ?? 'Channel Tanpa Nama',
                'description'      => $channel['snippet']['description'] ?? '',
                'thumbnail_url'    => $channel['snippet']['thumbnails']['high']['url']
                                   ?? $channel['snippet']['thumbnails']['default']['url']
                                   ?? null,
                'subscriber_count' => (int) ($channel['statistics']['subscriberCount'] ?? 0),
                'video_count'      => (int) ($channel['statistics']['videoCount'] ?? 0),
            ];
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (getChannelDetails): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ─── Ambil Video Terbaru dari Channel ────────────────────────────────────
     *
     * Menggunakan YouTube Search API untuk mendapatkan video terbaru.
     * Hasil diurutkan berdasarkan `date` (terbaru dulu).
     *
     * @param string $channelId ID Channel YouTube
     * @param string $accessToken Token akses yang valid
     * @param int $limit Jumlah video yang diambil (default: 10)
     * @return array Daftar video dengan id dan snippet-nya
     * @throws Exception Jika request ke API gagal
     */
    public function getLatestVideos(string $channelId, string $accessToken, int $limit = 10): array
    {
        try {
            $response = Http::withToken($accessToken)->get("{$this->apiUrl}/search", [
                'part'       => 'snippet',
                'channelId'  => $channelId,
                'maxResults' => $limit,
                'order'      => 'date',
                'type'       => 'video',
            ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil daftar video YouTube.';
                Log::error('YouTube API Error (getLatestVideos)', ['response' => $response->json()]);
                throw new Exception($error);
            }

            $items = $response->json('items') ?? [];

            return array_map(function ($item) {
                return [
                    'video_id'    => $item['id']['videoId'] ?? null,
                    'title'       => $item['snippet']['title'] ?? 'Video Tanpa Judul',
                    'description' => $item['snippet']['description'] ?? '',
                    'thumbnail'   => $item['snippet']['thumbnails']['medium']['url'] ?? null,
                    'published_at'=> $item['snippet']['publishedAt'] ?? null,
                ];
            }, $items);
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (getLatestVideos): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ─── Ambil Komentar dari Sebuah Video ────────────────────────────────────
     *
     * Menggunakan endpoint `commentThreads` untuk mengambil top-level comment
     * beserta replies-nya. Diurutkan berdasarkan `time` (terbaru dulu).
     *
     * @param string $videoId ID Video YouTube (format: xxxxxxxxxxx)
     * @param string $accessToken Token akses yang valid
     * @param int $limit Jumlah komentar per video (default: 50)
     * @return array Daftar komentar dengan id, text, author, dan timestamp
     * @throws Exception Jika request ke API gagal
     */
    public function getVideoComments(string $videoId, string $accessToken, int $limit = 50): array
    {
        try {
            $response = Http::withToken($accessToken)->get("{$this->apiUrl}/commentThreads", [
                'part'       => 'snippet,replies',
                'videoId'    => $videoId,
                'maxResults' => $limit,
                'order'      => 'time',
                'textFormat' => 'plainText',
            ]);

            // Komentar mungkin dinonaktifkan oleh pemilik video — ini bukan error
            if ($response->status() === 403) {
                $reason = $response->json('error.errors.0.reason') ?? 'unknown';
                if ($reason === 'commentsDisabled') {
                    Log::info("YouTube: Komentar dinonaktifkan untuk video {$videoId}");
                    return [];
                }
                throw new Exception($response->json('error.message') ?? 'Akses komentar YouTube ditolak.');
            }

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal mengambil komentar video YouTube.';
                Log::error('YouTube API Error (getVideoComments)', [
                    'video_id' => $videoId,
                    'response' => $response->json(),
                ]);
                throw new Exception($error);
            }

            $threads = $response->json('items') ?? [];
            $comments = [];

            foreach ($threads as $thread) {
                // Ambil top-level comment
                $topComment = $thread['snippet']['topLevelComment'] ?? null;
                if ($topComment) {
                    $snippet = $topComment['snippet'];
                    $comments[] = [
                        'comment_id'   => $topComment['id'],
                        'text'         => $snippet['textDisplay'] ?? '',
                        'author'       => $snippet['authorDisplayName'] ?? 'youtube_user',
                        'author_photo' => $snippet['authorProfileImageUrl'] ?? null,
                        'like_count'   => (int) ($snippet['likeCount'] ?? 0),
                        'published_at' => $snippet['publishedAt'] ?? null,
                        'is_reply'     => false,
                    ];
                }

                // Ambil replies jika ada
                $replyCount = $thread['snippet']['totalReplyCount'] ?? 0;
                if ($replyCount > 0 && !empty($thread['replies']['comments'])) {
                    foreach ($thread['replies']['comments'] as $reply) {
                        $rSnippet = $reply['snippet'];
                        $comments[] = [
                            'comment_id'   => $reply['id'],
                            'text'         => $rSnippet['textDisplay'] ?? '',
                            'author'       => $rSnippet['authorDisplayName'] ?? 'youtube_user',
                            'author_photo' => $rSnippet['authorProfileImageUrl'] ?? null,
                            'like_count'   => (int) ($rSnippet['likeCount'] ?? 0),
                            'published_at' => $rSnippet['publishedAt'] ?? null,
                            'is_reply'     => true,
                        ];
                    }
                }
            }

            return $comments;
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (getVideoComments): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ─── Moderasi: Sembunyikan Komentar di YouTube ───────────────────────────
     *
     * Menandai komentar sebagai `heldForReview` (ditahan untuk ditinjau).
     * Komentar tidak terlihat publik, namun masih bisa dikembalikan oleh kreator.
     * Menggunakan endpoint `comments.setModerationStatus` dari YouTube Data API v3.
     *
     * @param string $commentId ID komentar YouTube
     * @param string $accessToken Token akses yang valid
     * @return bool True jika berhasil
     * @throws Exception Jika request ke API gagal
     */
    public function hideComment(string $commentId, string $accessToken): bool
    {
        try {
            $response = Http::withToken($accessToken)
                ->post("{$this->apiUrl}/comments/setModerationStatus", [
                    'id'               => $commentId,
                    'moderationStatus' => 'heldForReview',
                ]);

            if ($response->failed()) {
                $error = $response->json('error.message') ?? 'Gagal menyembunyikan komentar YouTube.';
                Log::error('YouTube API Error (hideComment)', [
                    'comment_id' => $commentId,
                    'response'   => $response->json(),
                ]);
                throw new Exception($error);
            }

            return true;
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (hideComment): ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ─── Moderasi: Hapus Komentar YouTube Secara Permanen ────────────────────
     *
     * @param string $commentId ID komentar YouTube
     * @param string $accessToken Token akses yang valid
     * @return bool True jika berhasil
     * @throws Exception Jika request ke API gagal
     */
    public function deleteComment(string $commentId, string $accessToken): bool
    {
        try {
            $response = Http::withToken($accessToken)
                ->delete("{$this->apiUrl}/comments", [
                    'id' => $commentId,
                ]);

            if ($response->failed() && $response->status() !== 204) {
                $error = $response->json('error.message') ?? 'Gagal menghapus komentar YouTube.';
                Log::error('YouTube API Error (deleteComment)', [
                    'comment_id' => $commentId,
                    'response'   => $response->json(),
                ]);
                throw new Exception($error);
            }

            return true;
        } catch (Exception $e) {
            Log::error('YouTube Service Exception (deleteComment): ' . $e->getMessage());
            throw $e;
        }
    }
}
