/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

clientsClaim();
cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ url }) => url.pathname.startsWith('/words'),
  new StaleWhileRevalidate({ cacheName: 'api-words' })
);

registerRoute(
  ({ url }) => url.origin.startsWith('https://fonts.gstatic.com'),
  new StaleWhileRevalidate({ cacheName: 'google-fonts' })
);

registerRoute(
  ({ url }) => url.origin.startsWith('https://fonts.googleapis.com'),
  new StaleWhileRevalidate({ cacheName: 'google-fonts-styles' })
);


self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
