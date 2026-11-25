// Service worker: funciona offline e recebe as notificações push (Firebase Cloud Messaging).
const CACHE = 'dieta-v3';
const ASSETS = ['./', 'index.html', 'styles.css', 'app.js', 'config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/badge-96.png'];

importScripts('config.js');
const CFG = self.APP_CONFIG || {};
const hasFirebase = CFG.firebase && CFG.firebase.apiKey && !String(CFG.firebase.apiKey).startsWith('COLE');
if (hasFirebase) {
  try {
    importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
    firebase.initializeApp(CFG.firebase);
    // Mensagens com "notification" são exibidas pelo próprio SDK com o app fechado.
    firebase.messaging();
  } catch (e) { /* sem rede na instalação: tenta de novo na próxima ativação */ }
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Rede primeiro (para pegar atualizações); sem internet, usa o que está guardado.
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  const same = u.origin === self.location.origin;
  const cdn = /(^|\.)gstatic\.com$|fonts\.googleapis\.com$/.test(u.hostname);
  if (!same && !cdn) return; // Firestore, Auth etc. seguem direto
  e.respondWith(fetch(r).then(res => {
    if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});

// Toque na notificação: abre (ou traz para frente) o app.
self.addEventListener('notificationclick', e => {
  const d = e.notification.data || {};
  if (d.FCM_MSG) return; // o SDK do Firebase já trata
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if ('focus' in c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
