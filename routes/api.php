<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstagramAuthController;
use App\Http\Controllers\SocialAccountController;
use App\Http\Controllers\WebhookController;

// ─── Instagram Webhook Routes (PUBLIK — dipanggil oleh server Meta) ──────────
// Route ini TIDAK menggunakan middleware auth:sanctum karena request datang dari
// server Meta, bukan dari user yang sudah login. Keamanannya dijaga oleh
// verifikasi HMAC X-Hub-Signature-256 di dalam WebhookController.
Route::get('/webhook/instagram', [WebhookController::class, 'verify'])
    ->name('webhook.instagram.verify');
Route::post('/webhook/instagram', [WebhookController::class, 'handle'])
    ->name('webhook.instagram.handle');

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::patch('/comments/{id}/toggle-hide', [CommentController::class, 'toggleHide']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    Route::post('/nlp/analyze', [CommentController::class, 'analyze']); // ← FIX: Uji Coba Gemini AI Realtime

    Route::get('/social-accounts', [SocialAccountController::class, 'index']);
    Route::post('/social-accounts', [SocialAccountController::class, 'store']);
    Route::delete('/social-accounts/{id}', [SocialAccountController::class, 'destroy']);
    Route::post('/social-accounts/{id}/sync', [SocialAccountController::class, 'sync'])
        ->name('instagram.account.sync');

    // ─── Instagram Token Management ────────────────────────────────────────
    // Memperbarui Long-Lived Token yang hampir kedaluwarsa tanpa login ulang ke Meta.
    Route::post('/social-accounts/{id}/refresh-token', [InstagramAuthController::class, 'refreshToken'])
        ->name('instagram.token.refresh');
});
