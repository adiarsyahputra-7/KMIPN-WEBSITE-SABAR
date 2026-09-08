<?php

namespace App\Services;

use App\Models\User;
use App\Models\PushSubscription;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Illuminate\Support\Facades\Log;
use Exception;

class WebPushService
{
    protected ?WebPush $webPush = null;

    public function __construct()
    {
        $publicKey  = config('services.webpush.public_key');
        $privateKey = config('services.webpush.private_key');
        $subject    = config('services.webpush.subject', 'mailto:admin@sabar.id');

        if ($publicKey && $privateKey) {
            $auth = [
                'VAPID' => [
                    'subject'    => $subject,
                    'publicKey'  => $publicKey,
                    'privateKey' => $privateKey,
                ],
            ];

            $this->webPush = new WebPush($auth);
            $this->webPush->setReuseVAPIDHeaders(true);
        }
    }

    /**
     * Kirim notifikasi umum ke semua perangkat pengguna yang terdaftar.
     */
    public function sendNotification(User $user, array $payload): array
    {
        if (!$this->webPush) {
            Log::warning('WebPushService: VAPID keys belum terkonfigurasi dengan benar.');
            return ['success' => false, 'message' => 'VAPID keys not configured'];
        }

        $subscriptions = $user->pushSubscriptions()->get();
        if ($subscriptions->isEmpty()) {
            return ['success' => false, 'message' => 'No push subscriptions found for this user'];
        }

        $jsonPayload = json_encode($payload);
        $results = [];

        foreach ($subscriptions as $sub) {
            try {
                $webPushSubscription = Subscription::create([
                    'endpoint'        => $sub->endpoint,
                    'publicKey'       => $sub->p256dh_key,
                    'authToken'       => $sub->auth_key,
                    'contentEncoding' => 'aes128gcm',
                ]);

                $this->webPush->queueNotification($webPushSubscription, $jsonPayload);
            } catch (Exception $e) {
                Log::error('WebPushService: Failed queuing notification', [
                    'sub_id' => $sub->id,
                    'error'  => $e->getMessage(),
                ]);
            }
        }

        // Kirim semua notifikasi yang ada di antrean
        $sentCount = 0;
        $failedCount = 0;

        foreach ($this->webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();
            if ($report->isSuccess()) {
                $sentCount++;
            } else {
                $failedCount++;
                Log::warning('WebPushService: Push send failed', [
                    'endpoint' => $endpoint,
                    'reason'   => $report->getReason(),
                ]);

                // Jika subscription sudah kedaluwarsa / 410 Gone / 404 Not Found, hapus dari database
                if ($report->isSubscriptionExpired()) {
                    PushSubscription::where('endpoint', $endpoint)->delete();
                }
            }
        }

        return [
            'success' => $sentCount > 0,
            'sent'    => $sentCount,
            'failed'  => $failedCount,
        ];
    }

    /**
     * Kirim notifikasi uji coba instan (1-Click Test).
     */
    public function sendTestNotification(User $user): array
    {
        $payload = [
            'title' => '🔔 SABAR · Notifikasi Real-time Aktif',
            'body'  => "Halo {$user->name}, perangkat Anda berhasil terhubung! Anda akan menerima peringatan otomatis saat terdeteksi komentar toksik.",
            'icon'  => '/sabar-logo-cropped.png',
            'badge' => '/sabar-logo-cropped.png',
            'url'   => '/',
        ];

        return $this->sendNotification($user, $payload);
    }

    /**
     * Kirim peringatan otomatis saat ada komentar toksik terdeteksi.
     */
    public function sendToxicAlert(User $user, $comment): array
    {
        $author     = $comment->author ?? 'Pengguna Anonim';
        $text       = $comment->text ?? '';
        $shortText  = mb_strlen($text) > 60 ? mb_substr($text, 0, 57) . '...' : $text;
        $severity   = $comment->severity ?? 8;
        $toxicityPct = round(($comment->toxicity_score ?? 0.8) * 100);

        $payload = [
            'title' => '⚠️ SABAR · Peringatan Komentar Toksik',
            'body'  => "@{$author} (Toksisitas: {$toxicityPct}%): \"{$shortText}\". Komentar telah otomatis disembunyikan.",
            'icon'  => '/sabar-logo-cropped.png',
            'badge' => '/sabar-logo-cropped.png',
            'url'   => '/',
        ];

        return $this->sendNotification($user, $payload);
    }
}
