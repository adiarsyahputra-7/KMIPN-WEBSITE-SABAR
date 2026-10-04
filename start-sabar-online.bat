@echo off
title SABAR.LIFE - Cloudflare Tunnel Runner
echo ==============================================
echo    MENJALANKAN WEBSITE SABAR KE SABAR.LIFE
echo ==============================================
echo.
echo Pastikan Laragon / php artisan serve aktif di port 8000!
echo.
echo Website kamu live di: https://sabar.life
echo Tekan Ctrl+C untuk berhenti.
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel run sabar-tunnel
