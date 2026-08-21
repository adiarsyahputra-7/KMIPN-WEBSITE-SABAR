<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SocialAccount;

class SocialAccountController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return response()->json($user->socialAccounts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|in:instagram,tiktok,youtube',
            'handle' => 'required|string|max:255',
            'followers_count' => 'nullable|integer',
        ]);

        $socialAccount = auth()->user()->socialAccounts()->create([
            'platform' => strtolower($validated['platform']),
            'handle' => $validated['handle'],
            'followers_count' => $validated['followers_count'] ?? 0,
        ]);

        return response()->json([
            'message' => 'Akun sosial berhasil ditambahkan',
            'account' => $socialAccount,
        ], 201);
    }
}
