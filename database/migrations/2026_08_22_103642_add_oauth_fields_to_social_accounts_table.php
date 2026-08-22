<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom OAuth ke tabel social_accounts.
     *
     * Kolom tambahan yang diperlukan untuk integrasi Meta Graph API:
     * - instagram_id      : ID unik akun Instagram Bisnis dari Meta (string, bukan integer)
     * - page_id           : ID Facebook Page yang terhubung dengan akun Instagram tersebut
     * - page_access_token : Page Access Token untuk mengakses endpoint Media, Comments, dll
     * - token_expires_at  : Tanggal kedaluwarsa Long-Lived Token (~60 hari)
     * - avatar_url        : URL foto profil Instagram
     */
    public function up(): void
    {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->string('instagram_id')->nullable()->after('platform');
            $table->string('page_id')->nullable()->after('instagram_id');
            $table->text('page_access_token')->nullable()->after('access_token');
            $table->timestamp('token_expires_at')->nullable()->after('page_access_token');
            $table->string('avatar_url')->nullable()->after('followers_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropColumn([
                'instagram_id',
                'page_id',
                'page_access_token',
                'token_expires_at',
                'avatar_url',
            ]);
        });
    }
};
