<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class DashboardController extends Controller
{
    public function stats()
    {
        $user = auth()->user();

        $comments = Comment::whereHas('socialAccount', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        $totalComments = $comments->count();
        $positiveComments = $comments->where('sentiment', 'POSITIF')->count();
        $negativeComments = $comments->where('sentiment', 'NEGATIF')->count();
        
        // Simple mock stress calculation based on negative comments
        $stressLevel = $totalComments > 0 ? round(($negativeComments / $totalComments) * 100) : 0;

        return response()->json([
            'total_comments' => $totalComments,
            'positive_comments' => $positiveComments,
            'negative_comments' => $negativeComments,
            'stress_level' => $stressLevel,
            'recent_comments' => $comments->take(5)
        ]);
    }
}
