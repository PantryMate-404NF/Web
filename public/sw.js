self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// The MVP intentionally does not cache API or navigation responses.

importScripts(
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js',
);
importScripts('/firebase-config.js');

const firebaseConfig = self.firebaseConfig;

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();
const fallbackNotificationLink = '/pantry';

function normalizeNotificationLink(link) {
  if (typeof link !== 'string' || !link.startsWith('/')) {
    return fallbackNotificationLink;
  }

  try {
    const url = new URL(link, self.location.origin);

    if (url.origin !== self.location.origin) return fallbackNotificationLink;

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallbackNotificationLink;
  }
}

messaging.onBackgroundMessage((payload) => {
  const data = payload.data;

  if (!data || data.type !== 'PANTRY_REMINDER') return;

  return self.registration.showNotification(data.title || '팬트리 알림', {
    body: data.body || '',
    data: { link: normalizeNotificationLink(data.link) },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const link = normalizeNotificationLink(event.notification.data?.link);
  const targetUrl = new URL(link, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const sameOriginClient = windowClients.find((client) => {
        try {
          return new URL(client.url).origin === self.location.origin;
        } catch {
          return false;
        }
      });

      if (!sameOriginClient) return self.clients.openWindow(targetUrl);

      const navigation = sameOriginClient.navigate
        ? sameOriginClient.navigate(targetUrl)
        : Promise.resolve(sameOriginClient);

      return Promise.resolve(navigation).then(() => sameOriginClient.focus());
    }),
  );
});
