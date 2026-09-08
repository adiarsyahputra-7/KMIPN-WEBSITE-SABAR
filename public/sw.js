// Service Worker Ringan SABAR — Khusus Web Push Notification
self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || '⚠️ SABAR: Komentar Toksik Terdeteksi!';
  const options = {
    body: data.body || 'Sistem mendeteksi komentar bermuatan negatif baru.',
    icon: data.icon || '/sabar-logo-cropped.png',
    badge: data.badge || '/sabar-logo-cropped.png',
    data: {
      url: data.url || '/',
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open_dashboard', title: '🔍 Buka Dashboard' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
