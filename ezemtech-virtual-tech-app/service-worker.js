const CACHE_NAME = "ezemtech-virtual-tech-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./config.js?v=20260525-4",
  "./styles.css?v=20260525-4",
  "./app.js?v=20260525-4",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./assets/ezemtech-ezt-logo.png",
  "./assets/ezemtech-wide-logo.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
