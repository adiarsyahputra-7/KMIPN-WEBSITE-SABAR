<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\SocialAccount;
use App\Services\InstagramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected InstagramService $instagramService;

    public function __construct(InstagramService $instagramService)
    {
        $this->instagramService = $instagramService;
    }

    /**
     * ─── GET /webhook/instagram ──────────────────────────────────────────────
     *
     * Verifikasi Jabat Tangan (Handshake) Webhook dari Meta.
     *
     * Saat kita mendaftarkan URL webhook di Meta Developer Portal, Meta akan
     * mengirimkan request GET ke endpoint ini dengan tiga parameter:
     *
     *   - hub.mode        : harus bernilai "subscribe"
     *   - hub.verify_token: token yang kita set di Meta Dashboard (harus cocok dengan .env)
     *   - hub.challenge   : string acak dari Meta yang harus kita kembalikan
     *
     * Jika ketiga kondisi valid, kita kembalikan nilai `hub.challenge` dalam
     * bentuk plain text dengan status 200. Ini menandakan bahwa server kita
     * siap menerima notifikasi dari Meta.
     */
    public function verify(Request $request)
    {
        $mode = $request->query('hub_mode') ?? $request->query('hub.mode');
        $token = $request->query('hub_verify_token') ?? $request->query('hub.verify_token');
        $challenge = $request->query('hub_challenge') ?? $request->query('hub.challenge');

        $expectedToken = config('services.instagram.webhook_verify_token');

        Log::info('Instagram Webhook Verification Request', [
            'mode' => $mode,
            'token_matches' => ($token === $expectedToken),
            'challenge' => $challenge,
        ]);

        if ($mode === 'subscribe' && $token === $expectedToken) {
            Log::info('Instagram Webhook verification successful.');
            // Meta mengharuskan response berupa plain integer/string dari challenge
            return response($challenge, 200)->header('Content-Type', 'text/plain');
        }

        Log::warning('Instagram Webhook verification failed.', [
            'received_token' => $token,
            'expected_token' => $expectedToken,
        ]);

        return response()->json(['error' => 'Forbidden'], 403);
    }

    /**
     * ─── POST /webhook/instagram ─────────────────────────────────────────────
     *
     * Penerima Payload Notifikasi Real-time dari Meta.
     *
     * Meta mengirimkan request POST setiap kali ada komentar baru di postingan
     * Instagram yang dipantau. Payload yang dikirim berisi daftar perubahan
     * (changes) dalam format JSON dengan struktur:
     *
     * {
     *   "object": "instagram",
     *   "entry": [{
     *     "id": "instagram_business_account_id",
     *     "changes": [{
     *       "field": "comments",
     *       "value": {
     *         "id": "comment_id",
     *         "text": "teks komentar",
     *         "media": { "id": "post_id" },
     *         "from": { "id": "user_id", "username": "username" },
     *         "timestamp": 1234567890
     *       }
     *     }]
     *   }]
     * }
     *
     * Setelah validasi tanda tangan (signature) dari Meta, komentar diproses
     * dan disimpan ke database. Jika komentar terdeteksi toksik, sistem akan
     * secara otonom menyembunyikannya di Instagram.
     */
    public function handle(Request $request)
    {
        // ── Validasi Signature X-Hub-Signature-256 dari Meta ─────────────────
        // Meta menandatangani setiap payload dengan HMAC-SHA256 menggunakan App Secret.
        // Kita wajib memverifikasi ini untuk memastikan kiriman benar dari Meta,
        // bukan dari pihak ketiga yang tidak dikenal.
        if (!$this->verifySignature($request)) {
            Log::warning('Instagram Webhook: Invalid signature received.');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $payload = $request->json()->all();
        $object = $payload['object'] ?? null;

        Log::info('Instagram Webhook payload received', ['object' => $object]);

        // Pastikan ini notifikasi dari objek Instagram (bukan Messenger, dll)
        if ($object !== 'instagram') {
            return response()->json(['status' => 'ignored'], 200);
        }

        // ── Proses Setiap Entry ───────────────────────────────────────────────
        foreach ($payload['entry'] ?? [] as $entry) {
            $instagramBusinessAccountId = $entry['id'] ?? null;

            // Temukan akun sosial di database berdasarkan instagram_id
            $socialAccount = SocialAccount::where('instagram_id', $instagramBusinessAccountId)->first();

            if (!$socialAccount) {
                Log::warning('Webhook: SocialAccount not found for instagram_id: ' . $instagramBusinessAccountId);
                continue;
            }

            // ── Proses Setiap Perubahan (Change) ─────────────────────────────
            foreach ($entry['changes'] ?? [] as $change) {
                $field = $change['field'] ?? null;
                $value = $change['value'] ?? [];

                Log::info('Webhook change received', ['field' => $field, 'instagram_id' => $instagramBusinessAccountId]);

                // Hanya proses event komentar baru (bukan like, mention, dll)
                if ($field === 'comments') {
                    $this->processNewComment($socialAccount, $value);
                }
            }
        }

        // Meta mengharapkan respons 200 yang cepat. Jika tidak, ia akan
        // mengirim ulang notifikasi yang sama berkali-kali.
        return response()->json(['status' => 'ok'], 200);
    }

    /**
     * ─── PROSES KOMENTAR BARU ─────────────────────────────────────────────────
     *
     * Menganalisis komentar menggunakan rule-based classifier (Fase 2),
     * menyimpannya ke database, dan secara otonom menyembunyikan komentar
     * toksik langsung di Instagram via Graph API.
     */
    protected function processNewComment(SocialAccount $socialAccount, array $commentData): void
    {
        $commentId = $commentData['id'] ?? null;
        $text = $commentData['text'] ?? '';
        $username = $commentData['from']['username'] ?? 'unknown';
        $mediaId = $commentData['media']['id'] ?? null;
        $timestamp = isset($commentData['timestamp'])
            ? \Carbon\Carbon::createFromTimestamp($commentData['timestamp'])
            : now();

        if (!$commentId || !$text) {
            Log::warning('Webhook: Skipping comment with missing id or text', $commentData);
            return;
        }

        // Cegah duplikasi: lewati jika komentar sudah ada di database
        $exists = Comment::where('platform_comment_id', $commentId)->exists();
        if ($exists) {
            Log::info('Webhook: Duplicate comment skipped', ['comment_id' => $commentId]);
            return;
        }

        // ── Analisis Sentimen Rule-Based (akan digantikan Gemini di Fase 3) ──
        $analysis = $this->analyzeComment($text);

        // ── Simpan Komentar ke Database ───────────────────────────────────────
        $comment = Comment::create([
            'social_account_id'  => $socialAccount->id,
            'platform_comment_id'=> $commentId,
            'author'             => '@' . ltrim($username, '@'),
            'avatar'             => null, // Meta tidak menyertakan avatar di webhook payload
            'post_title'         => $mediaId ? "Post ID: {$mediaId}" : 'Postingan Instagram',
            'text'               => $text,
            'sentiment'          => $analysis['sentiment'],
            'toxicity_score'     => $analysis['toxicity_score'],
            'severity'           => $analysis['severity'],
            'is_sarcasm'         => $analysis['is_sarcasm'],
            'action'             => $analysis['action'],
            'is_hidden'          => $analysis['action'] === 'HIDE',
            'timestamp'          => $timestamp,
        ]);

        Log::info('Webhook: New comment saved', [
            'comment_id'    => $comment->id,
            'author'        => $comment->author,
            'action'        => $comment->action,
            'toxicity_score'=> $comment->toxicity_score,
        ]);

        // ── Moderasi Otonom: Sembunyikan Komentar Toksik di Instagram ─────────
        // Jika komentar terdeteksi negatif dan harus disembunyikan, kita langsung
        // memanggil Instagram Graph API untuk menyembunyikannya dari publik.
        if ($comment->is_hidden) {
            $this->autoHideComment($socialAccount, $commentId);
        }
    }

    /**
     * ─── RULE-BASED COMMENT ANALYZER ─────────────────────────────────────────
     *
     * Penganalisis sentimen berbasis aturan (rule-based) untuk Bahasa Indonesia.
     * Di Fase 3, fungsi ini akan digantikan sepenuhnya oleh Google Gemini AI.
     *
     * @return array{sentiment: string, toxicity_score: float, severity: int, is_sarcasm: bool, action: string}
     */
    protected function analyzeComment(string $text): array
    {
        $lower = mb_strtolower($text);

        // Pola sarkasme umum Bahasa Indonesia
        $sarcasmPatterns = [
            'keren tapi', 'bagus banget sampai', 'kayak siput', 'hebat banget ya',
            'mantap banget ya', 'bagus sih tapi', 'luar biasa padahal',
        ];
        $isSarcasm = collect($sarcasmPatterns)->some(fn($p) => str_contains($lower, $p));

        // Kata-kata toksik umum
        $toxicPatterns = [
            'sampah', 'bego', 'jijik', 'caper', 'mati', 'mundur aja', 'gak guna',
            'gak pantes', 'anjing', 'bangsat', 'tolol', 'idiot', 'bodoh', 'goblok',
            'dungu', 'najis', 'kampungan', 'norak',
        ];
        $hasToxic = collect($toxicPatterns)->some(fn($p) => str_contains($lower, $p));

        // Kata-kata positif umum
        $positivePatterns = [
            'bagus', 'terima kasih', 'suka banget', 'menginspirasi', 'keren parah',
            'sukses terus', 'mantap', 'luar biasa', 'semangat', 'keren', 'hebat',
            'top', 'the best', 'terbaik',
        ];
        $hasPositive = collect($positivePatterns)->some(fn($p) => str_contains($lower, $p));

        if ($hasToxic || $isSarcasm) {
            return [
                'sentiment'      => 'NEGATIF',
                'toxicity_score' => $isSarcasm ? 0.82 : 0.95,
                'severity'       => $isSarcasm ? 8 : 9,
                'is_sarcasm'     => $isSarcasm,
                'action'         => 'HIDE',
            ];
        }

        if ($hasPositive) {
            return [
                'sentiment'      => 'POSITIF',
                'toxicity_score' => 0.02,
                'severity'       => 1,
                'is_sarcasm'     => false,
                'action'         => 'ALLOW',
            ];
        }

        return [
            'sentiment'      => 'NETRAL',
            'toxicity_score' => 0.10,
            'severity'       => 2,
            'is_sarcasm'     => false,
            'action'         => 'ALLOW',
        ];
    }

    /**
     * ─── MODERASI OTONOM: SEMBUNYIKAN KOMENTAR DI INSTAGRAM ──────────────────
     *
     * Memanggil Instagram Graph API untuk menyembunyikan komentar toksik
     * dari publik secara langsung. Komentar tidak dihapus; hanya disembunyikan
     * sehingga hanya pemilik akun yang masih bisa melihatnya.
     */
    protected function autoHideComment(SocialAccount $socialAccount, string $commentId): void
    {
        $accessToken = $socialAccount->getEffectiveAccessToken();

        if (!$accessToken) {
            Log::warning('Webhook autoHide: No access token for social account', [
                'social_account_id' => $socialAccount->id,
            ]);
            return;
        }

        try {
            $this->instagramService->hideComment($commentId, $accessToken, true);

            Log::info('Webhook: Comment auto-hidden on Instagram', [
                'comment_id'       => $commentId,
                'social_account_id'=> $socialAccount->id,
            ]);
        } catch (\Exception $e) {
            // Kegagalan hide di Instagram tidak boleh menghentikan proses keseluruhan.
            // Komentar tetap tersimpan di DB dengan status is_hidden = true.
            Log::error('Webhook: Failed to auto-hide comment on Instagram', [
                'comment_id' => $commentId,
                'error'      => $e->getMessage(),
            ]);
        }
    }

    /**
     * ─── VERIFIKASI SIGNATURE X-Hub-Signature-256 ─────────────────────────────
     *
     * Meta menandatangani setiap POST payload dengan HMAC-SHA256 menggunakan
     * App Secret. Tanda tangan ini dikirim melalui header `X-Hub-Signature-256`.
     *
     * Format: sha256=<hex_string>
     *
     * Kita verifikasi ulang dengan menghitung HMAC menggunakan App Secret kita
     * dan membandingkannya secara time-safe (hash_equals) untuk mencegah
     * timing attack.
     */
    protected function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-Hub-Signature-256');

        // Jika tidak ada signature, tolak (kecuali di environment lokal untuk testing)
        if (!$signature) {
            // Di local development, izinkan tanpa signature untuk kemudahan testing
            if (app()->environment('local')) {
                Log::info('Webhook: Signature check skipped in local environment.');
                return true;
            }
            return false;
        }

        $appSecret = config('services.instagram.app_secret');
        $rawBody = $request->getContent();
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $rawBody, $appSecret);

        // Gunakan hash_equals untuk perbandingan aman dari timing attack
        return hash_equals($expectedSignature, $signature);
    }
}
