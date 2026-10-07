// Bump the version whenever canonical shared assets change — activate() will
// purge old named caches.
var CACHE_NAME = "usyd-mastery-v7";
var PRECACHE_URLS = [
  "",
  "index.html",
  "manifest.webmanifest",
  "brand/usyd-mastery-mark-on-dark.svg",
  "shared/root-portal.css",
  "shared/root-portal.js",
  "shared/home.css",
  "shared/study-base.css",
  "shared/interactive.css",
  "shared/interactive.js",
  "shared/mission-control.js",
  "shared/chat-panel.js",
  "shared/chat-markdown.js",
  "shared/chat-panel.css",
  "shared/mindmap.js",
  "shared/mindmap.css",
  "shared/flashcard-srs.js",
  "shared/lang-toggle.js",
  "shared/progress-tracker.js",
  "shared/katex-loader.js",
  "shared/chapter-common.js",
  "shared/scroll-anim.js",
  "shared/storage.js",
  "shared/site-reset.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event) {
  // Drop every cache, not just the ones with an older name. A version bump
  // usually means the markup or data changed shape, and a half-stale cache is
  // worse than an empty one: precache will refill this cache immediately, and
  // the runtime handlers refill the rest on demand.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return caches.open(CACHE_NAME);
    }).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  var url = new URL(event.request.url);
  
  // Skip non-GET requests and external API calls (LM Studio etc)
  if (event.request.method !== "GET") return;
  if (url.hostname === "localhost" && url.port === "1234") return;
  
  // For Google Fonts and CDN resources: cache-first
  if (url.hostname === "fonts.googleapis.com" || 
      url.hostname === "fonts.gstatic.com" ||
      url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response.ok) {
            var responseClone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(function() {
          return new Response("", { status: 503 });
        });
      })
    );
    return;
  }
  
  // For local static files: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        var fetchPromise = fetch(event.request).then(function(response) {
          if (response.ok) {
            var responseClone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(function() {
          return cached || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        });
        return cached || fetchPromise;
      })
    );
    return;
  }
});
