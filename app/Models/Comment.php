<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'social_account_id',
        'platform',
        'platform_comment_id',
        'author',
        'avatar',
        'post_title',
        'text',
        'sentiment',
        'toxicity_score',
        'severity',
        'is_sarcasm',
        'action',
        'reason',
        'is_hidden',
        'timestamp',
    ];

    protected $casts = [
        'toxicity_score' => 'float',
        'severity' => 'integer',
        'is_sarcasm' => 'boolean',
        'is_hidden' => 'boolean',
        'timestamp' => 'datetime',
    ];

    public function socialAccount()
    {
        return $this->belongsTo(SocialAccount::class);
    }

    // --- Query Scopes for Easy Filtering ---

    public function scopeHidden($query)
    {
        return $query->where('is_hidden', true);
    }

    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeToxic($query)
    {
        return $query->where('toxicity_score', '>=', 0.5);
    }

    public function scopePositif($query)
    {
        return $query->where('sentiment', 'POSITIF');
    }

    public function scopeNegatif($query)
    {
        return $query->where('sentiment', 'NEGATIF');
    }

    /**
     * Filter komentar berdasarkan platform asal.
     * Penggunaan: Comment::platform('youtube')->get()
     *             Comment::platform('instagram')->toxic()->get()
     */
    public function scopePlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }
}
