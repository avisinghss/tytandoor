// Add to public/sw.js
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetTab = event.notification.data?.targetTab || 'enquiries';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({ type: 'NAVIGATE_TAB', tab: targetTab });
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(`/admin?tab=${targetTab}`);
      }
    })
  );
});