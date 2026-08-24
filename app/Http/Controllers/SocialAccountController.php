<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\SocialAccount;
use App\Services\InstagramService;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class SocialAccountController extends Controller
{
    protected InstagramService $instagramService;
    protected GeminiService $geminiService;

    public function __construct(InstagramService $instagramService, GeminiService $geminiService)
    {
        $this->instagramService = $instagramService;
        $this->geminiService = $geminiService;
    }

    public function index()
    {
        $user = auth()->user();
        $accounts = $user->socialAccounts()->withCount([
            'comments',
            'comments as toxic_comments_count' => function ($query) {
                $query->where('is_hidden', true)->orWhere('toxicity_score', '>=', 0.5);
            }
        ])->get();

        return response()->json($accounts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|in:instagram,tiktok,youtube',
            'handle' => 'required|string|max:255',
            'followers_count' => 'nullable|integer',
        ]);

        $handle = $validated['handle'];
        if (!str_starts_with($handle, '@')) {
            $handle = '@' . $handle;
        }

        $socialAccount = auth()->user()->socialAccounts()->create([
            'platform' => strtolower($validated['platform']),
            'handle' => $handle,
            'followers_count' => $validated['followers_count'] ?? rand(5000, 50000),
        ]);

        return response()->json([
            'message' => 'Akun sosial media berhasil dihubungkan',
            'account' => $socialAccount,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $socialAccount = SocialAccount::findOrFail($id);

        if ($socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $socialAccount->delete();

        return response()->json(['message' => 'Akun sosial media berhasil dihapus']);
    }

    /**
     * ─── SYNC: Tarik Komentar Terbaru dari Instagram Graph API ───────────────
     *
     * Endpoint: POST /api/social-accounts/{id}/sync
     *
     * Menghubungi Instagram Graph API untuk mengambil postingan terbaru dan
     * komentar-komentarnya, lalu memproses setiap komentar melalui pipeline
     * analisis moderasi. Jika terdeteksi toksik, secara otomatis memanggil API
     * untuk menyembunyikan komentar tersebut langsung di Instagram.
     */
    public function sync(Request $request, $id)
    {
        $socialAccount = SocialAccount::findOrFail($id);

        if ($socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $accessToken = $socialAccount->getEffectiveAccessToken();

        // ── JIKA MEMILIKI ACCESS TOKEN DARI META OAUTH ───────────────────────
        if ($accessToken && $socialAccount->instagram_id) {
            try {
                // 1. Perbarui detail profil (followers, avatar)
                try {
                    $details = $this->instagramService->getAccountDetails($socialAccount->instagram_id, $accessToken);
                    $socialAccount->update([
                        'followers_count' => $details['followers_count'] ?? $socialAccount->followers_count,
                        'avatar_url' => $details['profile_picture_url'] ?? $socialAccount->avatar_url,
                    ]);
                } catch (Exception $e) {
                    Log::warning('Sync profile details failed: ' . $e->getMessage());
                }

                // 2. Ambil postingan terbaru (5 postingan)
                $mediaList = $this->instagramService->getUserMedia($socialAccount->instagram_id, $accessToken, 5);

                $newCommentsCount = 0;
                $hiddenCommentsCount = 0;

                // 3. Loop setiap postingan dan ambil komentarnya
                foreach ($mediaList as $media) {
                    $mediaId = $media['id'];
                    $postCaption = $media['caption'] ?? ('Postingan Instagram #' . substr($mediaId, -6));

                    $commentsData = $this->instagramService->getMediaComments($mediaId, $accessToken, 25);

                    foreach ($commentsData as $c) {
                        $platformCommentId = $c['id'];
                        $text = $c['text'] ?? '';
                        $username = $c['username'] ?? 'instagram_user';
                        $timestamp = isset($c['timestamp']) ? Carbon::parse($c['timestamp']) : now();

                        // Cek apakah sudah pernah disimpan
                        $existing = Comment::where('platform_comment_id', $platformCommentId)->first();
                        if ($existing) {
                            continue;
                        }

                        // Analisis sentimen via Google Gemini AI (Fase 3)
                        $analysis = $this->geminiService->analyzeComment($text);

                        // Simpan ke database
                        $newComment = Comment::create([
                            'social_account_id'   => $socialAccount->id,
                            'platform_comment_id' => $platformCommentId,
                            'author'              => '@' . ltrim($username, '@'),
                            'avatar'              => null,
                            'post_title'          => $postCaption,
                            'text'                => $text,
                            'sentiment'           => $analysis['sentiment'],
                            'toxicity_score'      => $analysis['toxicity_score'],
                            'severity'            => $analysis['severity'],
                            'is_sarcasm'          => $analysis['is_sarcasm'],
                            'action'              => $analysis['action'],
                            'reason'              => $analysis['reason'] ?? null,
                            'is_hidden'           => $analysis['action'] === 'HIDE',
                            'timestamp'           => $timestamp,
                        ]);

                        $newCommentsCount++;

                        // Jika toksik, sembunyikan secara otonom di Instagram
                        if ($newComment->is_hidden) {
                            try {
                                $this->instagramService->hideComment($platformCommentId, $accessToken, true);
                                $hiddenCommentsCount++;
                            } catch (Exception $e) {
                                Log::error("Failed to auto-hide comment {$platformCommentId}: " . $e->getMessage());
                            }
                        }
                    }
                }

                return response()->json([
                    'message' => "Sinkronisasi selesai. {$newCommentsCount} komentar baru ditarik, {$hiddenCommentsCount} komentar toksik otomatis disembunyikan di Instagram.",
                    'new_comments_count' => $newCommentsCount,
                    'hidden_comments_count' => $hiddenCommentsCount,
                    'account' => $socialAccount->fresh(),
                ]);
            } catch (Exception $e) {
                Log::error('Instagram Sync Error: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Gagal menarik data dari Instagram API: ' . $e->getMessage(),
                ], 500);
            }
        }

        // ── JIKA AKUN DEMO / SIMULASI (TANPA OAUTH TOKEN) ────────────────────
        $simulatedComments = [
            [
                'author' => '@andi_pratama99',
                'text' => 'Keren banget kontennya! Selalu suka sama edukasi yang disampaikan, semangat terus kak!',
                'post_title' => 'Simulasi Live Feed',
            ],
            [
                'author' => '@haters_hunter_x',
                'text' => 'Caper banget lu ya, konten gak mutu kayak gini mending hapus aja deh bikin jijik.',
                'post_title' => 'Simulasi Live Feed',
            ],
            [
                'author' => '@siti_khadijah',
                'text' => 'Wah keren banget ya, hebat banget sampai karyanya kayak dibuat anak TK.',
                'post_title' => 'Simulasi Live Feed',
            ],
            [
                'author' => '@budi_creative',
                'text' => 'Sangat menginspirasi! Terus berkarya dan jangan dengarkan komentar negatif ya.',
                'post_title' => 'Simulasi Live Feed',
            ],
        ];

        $addedCount = 0;
        foreach ($simulatedComments as $sim) {
            $analysis = $this->geminiService->analyzeComment($sim['text']);
            Comment::create([
                'social_account_id'   => $socialAccount->id,
                'platform_comment_id' => 'sim_' . time() . '_' . rand(100, 999),
                'author'              => $sim['author'],
                'avatar'              => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                'post_title'          => $sim['post_title'],
                'text'                => $sim['text'],
                'sentiment'           => $analysis['sentiment'],
                'toxicity_score'      => $analysis['toxicity_score'],
                'severity'            => $analysis['severity'],
                'is_sarcasm'          => $analysis['is_sarcasm'],
                'action'              => $analysis['action'],
                'reason'              => $analysis['reason'] ?? null,
                'is_hidden'           => $analysis['action'] === 'HIDE',
                'timestamp'           => now(),
            ]);
            $addedCount++;
        }

        return response()->json([
            'message' => "Sinkronisasi simulasi selesai. {$addedCount} komentar baru berhasil diproses.",
            'new_comments_count' => $addedCount,
            'hidden_comments_count' => 2,
            'account' => $socialAccount,
        ]);
    }

    /**
     * Helper Analisis Sentimen & Toksisitas (Rule-based)
     */
    protected function analyzeText(string $text): array
    {
        $lower = mb_strtolower($text);

        $sarcasmPatterns = [
            'keren tapi', 'bagus banget sampai', 'kayak siput', 'hebat banget ya',
            'mantap banget ya', 'bagus sih tapi', 'luar biasa padahal', 'kayak dibuat anak',
        ];
        $isSarcasm = collect($sarcasmPatterns)->some(fn($p) => str_contains($lower, $p));

        $toxicPatterns = [
            'sampah', 'bego', 'jijik', 'caper', 'mati', 'mundur aja', 'gak guna',
            'gak pantes', 'anjing', 'bangsat', 'tolol', 'idiot', 'bodoh', 'goblok',
            'dungu', 'najis', 'kampungan', 'norak', 'gak mutu',
        ];
        $hasToxic = collect($toxicPatterns)->some(fn($p) => str_contains($lower, $p));

        $positivePatterns = [
            'bagus', 'terima kasih', 'suka banget', 'menginspirasi', 'keren parah',
            'sukses terus', 'mantap', 'luar biasa', 'semangat', 'keren', 'hebat',
            'top', 'the best', 'terbaik', 'selalu suka',
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
}
