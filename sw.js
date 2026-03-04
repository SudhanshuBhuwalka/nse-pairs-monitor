const CACHE_NAME = ‘pairs-v2’;
const URLS_TO_CACHE = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Instrument+Serif&display=swap’,
‘https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js’,
‘https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.0.1/chartjs-plugin-annotation.min.js’
];

self.addEventListener(‘install’, e => {
e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)));
self.skipWaiting();
});

self.addEventListener(‘activate’, e => {
e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
self.clients.claim();
});

self.addEventListener(‘fetch’, e => {
e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener(‘push’, e => {
const data = e.data ? e.data.json() : {};
e.waitUntil(
self.registration.showNotification(data.title || ‘Pairs Alert’, {
body: data.body || ‘’,
icon: ‘./icon-192.png’,
badge: ‘./icon-192.png’,
vibrate: [100, 50, 100],
tag: data.tag || ‘pairs-alert’,
data: data
})
);
});

self.addEventListener(‘notificationclick’, e => {
e.notification.close();
e.waitUntil(clients.openWindow(’./index.html’));
});