<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'social_account_id',
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
        'is_hidden',
        'timestamp',
    ];

    public function socialAccount()
    {
        return $this->belongsTo(SocialAccount::class);
    }
}
