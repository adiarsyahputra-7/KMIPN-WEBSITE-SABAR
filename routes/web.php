<?php

use App\Http\Controllers\InstagramAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — SABAR System
|--------------------------------------------------------------------------
|
| Route web.php khusus untuk:
| 1. Alur OAuth Instagram (redirect & callback) — harus di web.php karena
|    perlu session Laravel untuk menyimpan state CSRF OAuth.
| 2. Catch-all untuk React SPA — menangani semua route lain dan menyerahkan
|    rendering ke React Router.
|
*/

// ─── INSTAGRAM OAUTH ROUTES ─────────────────────────────────────────────────
// Dua route ini HARUS didefinisikan SEBELUM catch-all agar tidak tertimpa.

// Step 1: Redirect ke Facebook OAuth Dialog
Route::get('/auth/instagram', [InstagramAuthController::class, 'redirect'])
    ->name('instagram.auth.redirect');

// Step 2: Callback dari Meta setelah pengguna mengizinkan/menolak akses
Route::get('/auth/instagram/callback', [InstagramAuthController::class, 'callback'])
    ->name('instagram.auth.callback');

// ─── REACT SPA CATCH-ALL ────────────────────────────────────────────────────
// Tangkap semua route yang tidak dikenali dan kembalikan ke React untuk
// diproses oleh React Router di sisi klien.
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
