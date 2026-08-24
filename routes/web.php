<?php

use App\Http\Controllers\InstagramAuthController;
use Illuminate\Support\Facades\Route;

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
