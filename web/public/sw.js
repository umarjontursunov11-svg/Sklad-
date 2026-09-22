// OmniStock PRO service worker.
// Purpose: make the site installable as a phone app and show a friendly page when offline.
// Security: API responses and authenticated pages are NEVER cached — only the app icons.
const CACHE = 'omnistock-static-v1';
const STATIC = ['/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const OFFLINE_HTML = `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Internet yo'q</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#090d16;color:#e2e8f0;font-family:system-ui,sans-serif;text-align:center;padding:24px">
<div><div style="font-size:48px">📡</div><h2 style="margin:12px 0 8px">Internet aloqasi yo'q</h2>
<p style="color:#94a3b8;font-size:14px">Ombor ma'lumotlari faqat onlayn rejimda ishlaydi.<br>Aloqa tiklangach, sahifani yangilang.</p>
<button onclick="location.reload()" style="margin-top:16px;padding:10px 18px;border:0;border-radius:10px;background:#4f46e5;color:#fff;font-weight:700">Qayta urinish</button></div>
</body></html>`;

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: always from the network; offline page only when there is no connection.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))
    );
    return;
  }

  // Icons: cache-first.
  if (STATIC.includes(url.pathname)) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
  // Everything else (API, JS, data): default network behaviour, nothing cached here.
});
