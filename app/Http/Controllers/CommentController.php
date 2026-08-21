<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = $user->comments()->with('socialAccount');

        // Filter by sentiment
        if ($request->filled('sentiment')) {
            $query->where('sentiment', strtoupper($request->sentiment));
        }

        // Filter by hidden status
        if ($request->has('is_hidden')) {
            $query->where('is_hidden', filter_var($request->is_hidden, FILTER_VALIDATE_BOOLEAN));
        }

        // Search text or author
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
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
            'author' => $validated['author'],
            'avatar' => $validated['avatar'] ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            'post_title' => $validated['post_title'] ?? "Live Feed Post",
            'text' => $validated['text'],
            'sentiment' => $validated['sentiment'] ?? ($toxicity >= 0.5 ? 'NEGATIF' : 'POSITIF'),
            'toxicity_score' => $toxicity,
            'severity' => $validated['severity'] ?? ($toxicity >= 0.5 ? min(10, round($toxicity * 10)) : 1),
            'is_sarcasm' => $validated['is_sarcasm'] ?? false,
            'action' => $isHidden ? 'HIDE' : 'ALLOW',
            'is_hidden' => $isHidden,
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Komentar berhasil disimpan',
            'comment' => $comment->load('socialAccount'),
        ], 201);
    }

    public function toggleHide(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
        // Ensure user owns this comment
        if ($comment->socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->is_hidden = !$comment->is_hidden;
        $comment->action = $comment->is_hidden ? 'HIDE' : 'ALLOW';
        $comment->save();

        return response()->json(['message' => 'Status moderasi berhasil diperbarui', 'comment' => $comment]);
    }

    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
        if ($comment->socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'Komentar berhasil dihapus']);
    }
}
