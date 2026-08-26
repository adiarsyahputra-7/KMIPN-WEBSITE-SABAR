<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom untuk integrasi YouTube Data API v3 ke tabel social_accounts.
     *
     * - youtube_channel_id   : ID unik channel YouTube (format: UCxxxxxxxxxx)
     * - youtube_refresh_token: Refresh Token Google OAuth2 — tidak kedaluwarsa selama dipakai,
     *                          digunakan untuk memperbarui access_token (yang hanya berlaku 3600 detik).
     */
    public function up(): void
    {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->string('youtube_channel_id')->nullable()->after('instagram_id');
            $table->text('youtube_refresh_token')->nullable()->after('page_access_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropColumn(['youtube_channel_id', 'youtube_refresh_token']);
        });
    }
};
