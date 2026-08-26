<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Services\InstagramService;
use App\Services\YouTubeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class CommentController extends Controller
{
    protected InstagramService $instagramService;
    protected YouTubeService $youtubeService;

    public function __construct(InstagramService $instagramService, YouTubeService $youtubeService)
    {
        $this->instagramService = $instagramService;
        $this->youtubeService   = $youtubeService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        $query = $user->comments()->with('socialAccount');

        // Filter by sentiment
        if ($request->filled('sentiment')) {
            $query->where('sentiment', strtoupper($request->sentiment));
        }

        // Filter by platform (instagram / youtube)
        if ($request->filled('platform') && in_array($request->platform, ['instagram', 'youtube'])) {
            $query->where('platform', $request->platform);
        }

        // Filter by hidden status
        if ($request->has('is_hidden')) {
            $query->where('is_hidden', filter_var($request->is_hidden, FILTER_VALIDATE_BOOLEAN));
        }

        // Search text or author
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('text', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        $comments = $query->latest('timestamp')->get();
        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'social_account_id' => 'nullable|exists:social_accounts,id',
            'author' => 'required|string',
            'avatar' => 'nullable|string',
            'post_title' => 'nullable|string',
            'text' => 'required|string',
            'sentiment' => 'nullable|string',
            'toxicity_score' => 'nullable|numeric',
            'severity' => 'nullable|integer',
            'is_sarcasm' => 'nullable|boolean',
            'action' => 'nullable|string',
            'reason' => 'nullable|string',
            'is_hidden' => 'nullable|boolean',
        ]);

        $user = auth()->user();

        // Use first social account if not specified
        $socialAccountId = $validated['social_account_id']
            ?? $user->socialAccounts()->first()?->id;

        if (!$socialAccountId) {
            // Create a default social account if none exists
            $defaultAccount = $user->socialAccounts()->create([
                'platform' => 'instagram',
                'handle' => '@' . strtolower(str_replace(' ', '_', $user->name)),
                'followers_count' => 1000,
            ]);
            $socialAccountId = $defaultAccount->id;
        }

        $toxicity = $validated['toxicity_score'] ?? 0.1;
        $isHidden = $validated['is_hidden'] ?? ($toxicity >= 0.5);

        $comment = Comment::create([
            'social_account_id' => $socialAccountId,
            'platform_comment_id' => 'custom_' . time() . '_' . rand(100, 999),
            'author' => $validated['author'],
            'avatar' => $validated['avatar'] ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            'post_title' => $validated['post_title'] ?? "Live Feed Post",
            'text' => $validated['text'],
            'sentiment' => $validated['sentiment'] ?? ($toxicity >= 0.5 ? 'NEGATIF' : 'POSITIF'),
            'toxicity_score' => $toxicity,
            'severity' => $validated['severity'] ?? ($toxicity >= 0.5 ? min(10, round($toxicity * 10)) : 1),
            'is_sarcasm' => $validated['is_sarcasm'] ?? false,
            'action' => $validated['action'] ?? ($isHidden ? 'HIDE' : 'ALLOW'),
            'reason' => $validated['reason'] ?? null,
            'is_hidden' => $isHidden,
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Komentar berhasil disimpan',
            'comment' => $comment->load('socialAccount'),
        ], 201);
    }

    /**
     * Uji Coba Langsung: Menganalisis teks menggunakan Google Gemini AI secara real-time.
     */
    public function analyze(Request $request, \App\Services\GeminiService $geminiService)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $result = $geminiService->analyzeComment($validated['text']);

        return response()->json($result);
    }

    /**
     * Moderasi: Toggle sembunyikan/tampilkan komentar dan sinkronkan langsung ke Instagram jika ada token.
     */
    public function toggleHide(Request $request, $id)
    {
        $comment = Comment::with('socialAccount')->findOrFail($id);

        // Ensure user owns this comment
        if ($comment->socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->is_hidden = !$comment->is_hidden;
        $comment->action = $comment->is_hidden ? 'HIDE' : 'ALLOW';
        $comment->save();

        // ── Sinkronkan ke platform asal secara real-time ─────────────────────
        $socialAccount = $comment->socialAccount;
        $accessToken   = $socialAccount->getEffectiveAccessToken();
        $isRealComment = $comment->platform_comment_id
                      && !str_starts_with($comment->platform_comment_id, 'sim_')
                      && !str_starts_with($comment->platform_comment_id, 'custom_');

        if ($accessToken && $isRealComment) {
            try {
                if ($comment->platform === 'youtube') {
                    // YouTube hanya bisa hide, tidak bisa un-hide via API
                    if ($comment->is_hidden) {
                        $this->youtubeService->hideComment($comment->platform_comment_id, $accessToken);
                    }
                    Log::info('Comment toggleHide synced to YouTube', [
                        'comment_id' => $comment->platform_comment_id,
                        'hidden'     => $comment->is_hidden,
                    ]);
                } else {
                    // Instagram bisa hide dan un-hide
                    $this->instagramService->hideComment($comment->platform_comment_id, $accessToken, $comment->is_hidden);
                    Log::info('Comment toggleHide synced to Instagram', [
                        'comment_id' => $comment->platform_comment_id,
                        'hidden'     => $comment->is_hidden,
                    ]);
                }
            } catch (Exception $e) {
                Log::warning('Failed to sync hide status to platform: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Status moderasi berhasil diperbarui',
            'comment' => $comment,
        ]);
    }

    /**
     * Hapus komentar dari database lokal SABAR saja.
     *
     * Jika komentar tersebut sebelumnya di-HIDE oleh SABAR di Instagram,
     * sistem akan UN-HIDE terlebih dahulu agar komentar kembali terlihat
     * dan bisa ditarik ulang melalui "Tarik Komentar Terbaru".
     *
     * Komentar di Instagram TIDAK PERNAH dihapus permanen oleh tombol ini.
     */
    public function destroy(Request $request, $id)
    {
        $comment = Comment::with('socialAccount')->findOrFail($id);

        if ($comment->socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $socialAccount = $comment->socialAccount;
        $accessToken   = $socialAccount->getEffectiveAccessToken();
        $platformId    = $comment->platform_comment_id;
        $isRealComment = $platformId && !str_starts_with($platformId, 'sim_') && !str_starts_with($platformId, 'custom_');

        // Jika komentar ini sebelumnya di-HIDE oleh SABAR di Instagram,
        // un-hide agar komentar kembali tampil dan bisa di-pull ulang.
        if ($accessToken && $isRealComment && $comment->is_hidden) {
            try {
                $this->instagramService->hideComment($platformId, $accessToken, false);
                Log::info('Comment un-hidden on Instagram before SABAR delete', [
                    'platform_comment_id' => $platformId,
                    'author'              => $comment->author,
                ]);
            } catch (Exception $e) {
                // Lanjutkan penghapusan lokal walau un-hide gagal
                Log::warning('Failed to un-hide comment on Instagram: ' . $e->getMessage());
            }
        }

        // Hapus dari database SABAR lokal — komentar di Instagram tetap ada.
        $comment->delete();

        Log::info('Comment removed from SABAR local DB (Instagram comment preserved)', [
            'sabar_id'           => $id,
            'platform_comment_id'=> $platformId,
            'author'             => $comment->author,
        ]);

        return response()->json(['message' => 'Komentar berhasil dihapus dari sistem SABAR']);
    }
}
