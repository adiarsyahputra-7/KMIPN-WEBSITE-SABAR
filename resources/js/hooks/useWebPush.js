import { useState, useEffect, useCallback } from 'react';
import api from '../api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function useWebPush() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Cek apakah browser mendukung Web Push & Service Worker
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);

      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  // Aktifkan Langganan Push Notification
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setFeedback({
        type: 'error',
        message: 'Browser Anda tidak mendukung Web Push Notification.',
      });
      return false;
    }

    setLoading(true);
    setFeedback(null);

    try {
      // 1. Minta izin browser
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        setFeedback({
          type: 'error',
          message: 'Izin notifikasi ditolak oleh browser. Silakan izinkan di pengaturan situs.',
        });
        setLoading(false);
        return false;
      }

      // 2. Ambil VAPID Public Key dari Backend
      const { data } = await api.get('/push/vapid-public-key');
      const publicKey = data.publicKey;

      if (!publicKey) {
        throw new Error('VAPID public key tidak ditemukan.');
      }

      // 3. Daftarkan Push Subscription ke browser
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // 4. Kirim Subscription ke Backend Laravel
      const subJson = subscription.toJSON();
      await api.post('/push/subscribe', {
        endpoint: subJson.endpoint,
        keys: {
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        },
      });

      setIsSubscribed(true);
      setFeedback({
        type: 'success',
        message: 'Peringatan notifikasi real-time berhasil diaktifkan!',
      });
      return true;
    } catch (err) {
      console.error('Web Push subscription error:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Gagal mengaktifkan notifikasi push.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  // Nonaktifkan Langganan Push
  const unsubscribe = useCallback(async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await api.post('/push/unsubscribe', { endpoint });
      }

      setIsSubscribed(false);
      setFeedback({
        type: 'success',
        message: 'Peringatan notifikasi berhasil dinonaktifkan.',
      });
    } catch (err) {
      console.error('Web Push unsubscribe error:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal menonaktifkan notifikasi.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Kirim Notifikasi Uji Coba (1-Click Test)
  const sendTest = useCallback(async () => {
    setTestLoading(true);
    setFeedback(null);

    try {
      const { data } = await api.post('/push/test');
      setFeedback({
        type: 'success',
        message: data.message || 'Notifikasi uji coba terkirim! Cek layar Anda.',
      });
      return true;
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Gagal mengirim notifikasi tes.',
      });
      return false;
    } finally {
      setTestLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    testLoading,
    feedback,
    clearFeedback: () => setFeedback(null),
    subscribe,
    unsubscribe,
    sendTest,
  };
}
