/* eslint-disable no-console */
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8
  /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])){3}$/.test(
    window.location.hostname
  )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    window.addEventListener('load', () => {
      if (isLocalhost) {
        // Локальная проверка существования SW
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.onstatechange = () => {
          if (installing.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              config?.onUpdate?.(registration);
            } else {
              console.log('Content is cached for offline use.');
              config?.onSuccess?.(registration);
            }
          }
        };
      };
    })
    .catch(err => console.error('SW registration error:', err));
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType && !contentType.includes('javascript'))
      ) {
        navigator.serviceWorker.ready.then(r => {
          r.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() =>
      console.log('No internet connection found. App is running offline.')
    );
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(r => r.unregister())
      .catch(err => console.error(err));
  }
}
