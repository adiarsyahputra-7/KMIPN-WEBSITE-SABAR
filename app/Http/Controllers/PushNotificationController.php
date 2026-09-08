<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use App\Services\WebPushService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PushNotificationController extends Controller
{
    /**
     * Ambil VAPID Public Key untuk dikirim ke PushManager di browser.
     */
    public function vapidPublicKey()
    {
        $publicKey = config('services.webpush.public_key');
        return response()->json([
            'publicKey' => $publicKey,
        ]);
    }

    /**
     * Daftarkan push subscription dari browser.
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
            'keys.p256dh' => 'required|string',
            'keys.auth'   => 'required|string',
        ]);

        $user = auth()->user();
        $endpoint = $validated['endpoint'];
        $endpointHash = hash('sha256', $endpoint);

        $subscription = PushSubscription::updateOrCreate(
            ['endpoint_hash' => $endpointHash],
            [
                'user_id'    => $user->id,
                'endpoint'   => $endpoint,
                'p256dh_key' => $validated['keys']['p256dh'],
                'auth_key'   => $validated['keys']['auth'],
            ]
        );

        Log::info('Push subscription registered', [
            'user_id' => $user->id,
            'sub_id'  => $subscription->id,
        ]);

        return response()->json([
            'message'      => 'Langganan notifikasi push berhasil disimpan.',
            'subscription' => $subscription,
        ]);
    }

    /**
     * Batalkan langganan push subscription.
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
        ]);

        $endpointHash = hash('sha256', $validated['endpoint']);
        PushSubscription::where('endpoint_hash', $endpointHash)->delete();

        return response()->json([
            'message' => 'Langganan notifikasi push berhasil dibatalkan.',
        ]);
    }

    /**
     * Kirim notifikasi uji coba langsung ke browser pengguna saat ini.
     */
    public function testNotification(Request $request, WebPushService $webPushService)
    {
        $user = auth()->user();
        $result = $webPushService->sendTestNotification($user);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => 'Notifikasi uji coba berhasil dikirim ke perangkat Anda!',
                'sent'    => $result['sent'],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'] ?? 'Gagal mengirim notifikasi. Pastikan izin notifikasi browser telah aktif.',
            'failed'  => $result['failed'] ?? 0,
        ], 400);
    }
}
