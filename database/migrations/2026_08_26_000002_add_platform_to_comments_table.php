<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom `platform` langsung di tabel comments.
     *
     * Tujuan: menghindari JOIN ke tabel social_accounts setiap kali ingin filter
     * komentar berdasarkan platform. Dengan kolom ini, filter cukup dilakukan di
     * satu tabel dengan query sederhana:
     *
     *   Comment::where('platform', 'youtube')->get();
     *   Comment::where('platform', 'instagram')->get();
     *
     * Nilai default 'instagram' karena semua data yang sudah ada sebelumnya
     * adalah data dari Instagram.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->string('platform')->default('instagram')->after('social_account_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn('platform');
        });
    }
};
