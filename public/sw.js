// public/sw.js

// 1. Force immediate activation on update
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 2. Handle System Notification Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetTab = event.notification.data?.targetTab || 'enquiries';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the PWA/Admin panel is already open in a tab, focus it & switch tabs
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({ type: 'NAVIGATE_TAB', tab: targetTab });
          return;
        }
      }

      // If the app is closed, open a new window
      if (clients.openWindow) {
        return clients.openWindow(`/admin?tab=${targetTab}`);
      }
    })
  );
});