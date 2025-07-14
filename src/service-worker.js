/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,       
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST || []);

// 1. API: /words
registerRoute(
  ({ url }) => url.pathname.endsWith('/words'),
  new CacheFirst({
    cacheName: 'api-words',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  })
);

// 2. manifest.json
registerRoute(
  ({ url }) => url.pathname.endsWith('manifest.json'),
  new StaleWhileRevalidate({ cacheName: 'manifest' })
);

// 3. Google Fonts CSS
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts-styles' })
);

// 4. Google Fonts woff2
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 год
      }),
    ],
  })
);

// 5. SPA-фолбэк: все навигационные запросы → index.html
registerRoute(
  ({ request }) => request.mode === 'navigate',
  createHandlerBoundToURL('/build/index.html')
);

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
