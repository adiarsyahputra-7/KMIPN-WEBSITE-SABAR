@echo off
title SABAR.LIFE - 1-Click Server & Tunnel Launcher
color 0A
echo =======================================================
echo          MENYALAKAN WEBSITE SABAR KE SABAR.LIFE
echo =======================================================
echo.

:: 1. Cek & Jalankan MySQL jika belum aktif
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [1/3] Menyalakan Database MySQL...
    start /b "" "D:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqld.exe" --defaults-file=D:\laragon\bin\mysql\mysql-8.0.30-winx64\my.ini
    timeout /t 2 >nul
) else (
    echo [1/3] Database MySQL sudah aktif.
)

:: 2. Cek & Jalankan php artisan serve jika belum aktif
netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 (
    echo [2/3] Menyalakan Laravel Server (port 8000)...
    start /b "" php artisan serve --port=8000
    timeout /t 2 >nul
) else (
    echo [2/3] Laravel Server sudah aktif di port 8000.
)

:: 3. Jalankan Cloudflare Tunnel
echo [3/3] Menghubungkan ke Domain https://sabar.life ...
echo.
echo =======================================================
echo   WEBSITE SUDAH ONLINE!
echo   Buka di browser: https://sabar.life
echo   (Biarkan jendela ini tetap terbuka saat website dipakai)
echo =======================================================
echo.

"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel run sabar-tunnel
