<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = auth()->user();
        
        // Optionally filter stats by social_account_id if passed in request
        $query = $user->comments();
        if ($request->has('social_account_id')) {
            $query->where('social_account_id', $request->social_account_id);
        }
        
        $comments = $query->with('socialAccount')->get();

        $total = $comments->count();

        if ($total === 0) {
            return response()->json([
                'total' => 0,
                'positiveCount' => 0,
                'positivePercent' => 0,
                'negativeCount' => 0,
                'negativePercent' => 0,
                'toxicCount' => 0,
                'toxicPercent' => 0,
                'avgSeverity' => 0,
                'stressLevel' => 0,
                'platforms' => [
                    'instagram' => 0,
                    'tiktok' => 0,
                    'youtube' => 0,
                ],
                'recentComments' => []
            ]);
        }

        $positiveCount = $comments->where('sentiment', 'POSITIF')->count();
        $negativeCount = $comments->where('sentiment', 'NEGATIF')->count();
        $toxicComments = $comments->filter(fn($c) => $c->is_hidden || $c->toxicity_score >= 0.5);
        $toxicCount = $toxicComments->count();

        $totalSeverity = $toxicComments->sum('severity');
        $avgSeverity = $toxicCount > 0 ? round($totalSeverity / $toxicCount, 1) : 1.0;

        // SABAR Stress Load Index Formula:
        // rawStress = ((toxicCount * avgSeverity) / total) * 10
        // stressLevel = min(100, max(0, round(rawStress * 1.5)))
        $rawStress = (($toxicCount * $avgSeverity) / $total) * 10;
        $stressLevel = min(100, max(0, round($rawStress * 1.5)));

        // Platform breakdown
        $platforms = [
            'instagram' => $comments->filter(fn($c) => strtolower($c->socialAccount->platform ?? '') === 'instagram')->count(),
            'tiktok' => $comments->filter(fn($c) => strtolower($c->socialAccount->platform ?? '') === 'tiktok')->count(),
            'youtube' => $comments->filter(fn($c) => strtolower($c->socialAccount->platform ?? '') === 'youtube')->count(),
        ];

        return response()->json([
            'total' => $total,
            'positiveCount' => $positiveCount,
            'positivePercent' => round(($positiveCount / $total) * 100),
            'negativeCount' => $negativeCount,
            'negativePercent' => round(($negativeCount / $total) * 100),
            'toxicCount' => $toxicCount,
            'toxicPercent' => round(($toxicCount / $total) * 100),
            'avgSeverity' => $avgSeverity,
            'stressLevel' => $stressLevel,
            'platforms' => $platforms,
            'recentComments' => $comments->sortByDesc('timestamp')->take(5)->values()
        ]);
    }
}
