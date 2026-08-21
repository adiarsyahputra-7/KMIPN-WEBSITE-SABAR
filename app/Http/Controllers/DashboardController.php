<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class DashboardController extends Controller
{
    public function stats()
    {
        $user = auth()->user();
        $comments = $user->comments;

        $totalComments = $comments->count();
        $positiveComments = $comments->where('sentiment', 'POSITIF')->count();
        $negativeComments = $comments->where('sentiment', 'NEGATIF')->count();
        $toxicComments = $comments->filter(fn($c) => $c->is_hidden || $c->toxicity_score >= 0.5);
        $toxicCount = $toxicComments->count();

        $avgSeverity = $toxicCount > 0 ? $toxicComments->avg('severity') : 1;

        // Formula SABAR: ((toxicCount * avgSeverity) / total) * 10
        $rawStress = $totalComments > 0 ? (($toxicCount * $avgSeverity) / $totalComments) * 10 : 0;
        $stressLevel = min(100, max(0, round($rawStress * 1.5)));

        return response()->json([
            'total_comments' => $totalComments,
            'positive_comments' => $positiveComments,
            'negative_comments' => $negativeComments,
            'stress_level' => $stressLevel,
            'recent_comments' => $comments->take(5)
        ]);
    }
}
