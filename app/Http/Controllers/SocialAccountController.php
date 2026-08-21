<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SocialAccount;

class SocialAccountController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $accounts = $user->socialAccounts()->withCount(['comments', 'comments as toxic_comments_count' => function($query) {
            $query->where('is_hidden', true)->orWhere('toxicity_score', '>=', 0.5);
        }])->get();

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
}
