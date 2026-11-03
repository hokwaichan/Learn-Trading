// Service worker: makes TradeSchool installable and lets it work offline.
//
// This is a template. `npm run build` fills in __VERSION__ and __FILES__ (every
// built file, lesson picture and bundled price file) and writes it to dist/sw.js;
// see the offline plugin in vite.config.ts. A new build means a new version, so
// installed copies update themselves.
//
// - Install: download every file into a cache named after this version.
// - Pages: try the network first so a new deploy shows up at once; offline,
//   serve the cached app shell, which then routes to the right screen.
// - Everything else from this site: the cached copy, or the network if missing.
// - Other sites (live crypto prices) are never cached: they must be live.
const VERSION = '__VERSION__';
const FILES = __FILES__;
const CACHE = `tradeschool-${VERSION}`;
// The app shell. Named directly rather than './', which needs the host to map folders to index.html.
const SHELL = new URL('index.html', self.location).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([SHELL, ...FILES.map((f) => new URL(f, self.location).href)]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('tradeschool-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // GitHub Pages answers deep links with 404.html, which is the app itself.
          if (response.ok || response.status === 404) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(SHELL, copy));
          }
          return response;
        })
        .catch(() => caches.match(SHELL)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
