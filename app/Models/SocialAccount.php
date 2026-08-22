<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'platform',
        'handle',
        'instagram_id',
        'page_id',
        'access_token',
        'page_access_token',
        'token_expires_at',
        'followers_count',
        'avatar_url',
    ];

    protected $casts = [
        'followers_count'  => 'integer',
        'token_expires_at' => 'datetime',
    ];

    /**
     * Memeriksa apakah Long-Lived Access Token sudah kedaluwarsa.
     */
    public function isTokenExpired(): bool
    {
        if (!$this->token_expires_at) {
            return true;
        }
        return $this->token_expires_at->isPast();
    }

    /**
     * Menentukan access token mana yang harus dipakai untuk request API:
     * Page Access Token lebih diutamakan karena lebih kuat hak aksesnya.
     */
    public function getEffectiveAccessToken(): ?string
    {
        return $this->page_access_token ?? $this->access_token;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
