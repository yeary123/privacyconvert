// Minimal service worker for PWA installability (Chrome "Install app" / Add to desktop)
const CACHE_NAME = "privacyconvert-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
