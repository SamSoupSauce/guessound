const CACHE_NAME = 'guessound-pwa-v1.2.5';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg',
  '/models/pool_flamingo.glb',
  '/models/flip_flops.glb',
  '/models/stubbed_toe.glb',
  '/models/squeaky_dog.glb',
  '/models/sizzling_bacon.glb',
  '/models/massage_gun.glb',
  '/models/bike_pump.glb',
  '/models/resistance_band.glb',
  '/models/mac_and_cheese.glb',
  '/models/dog_tippytaps.glb',
  '/models/laser_blaster.glb',
  '/models/chainsaw_engine.glb',
  '/models/soda_can.glb',
  '/models/cat_hiss.glb',
  '/models/kettlebell_thud.glb',
  '/models/woodpecker_tree.glb',
  '/models/water_slide.glb',
  '/models/warp_core.glb',
  '/models/spring_pad.glb',
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate / Cache-First strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip chrome-extension and non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting navigation, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
