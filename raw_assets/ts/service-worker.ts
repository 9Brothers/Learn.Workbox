importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

declare let workbox: any;

if(workbox) {
  console.log("deu certo saporra");

  workbox.routing.registerRoute(
    // Cache HTML files
    '/',
    workbox.strategies.networkFirst({
      cacheName: 'html-cache'
    })
  );

  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.networkFirst({
      // Use a custom cache name
      cacheName: 'css-cache',
    })
  );

  workbox.routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    
    workbox.strategies.networkFirst({

      // Use a custom cache name
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // Cache only 20 images
          maxEntries: 20,
          // Cache for a maximum of a week
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ],
    })
  );

  workbox.routing.registerRoute(
    // Cache JS files
    /.*\.js/,
    workbox.strategies.networkFirst({
      cacheName: 'js-cache'
    })
  );


  
} else {
  console.log("num foi :(");
}

let cacheVersion: number = 1;
let currentCache = {
  offline: 'offline-cache' + cacheVersion
};

const offlineUrl: string = 'offline-page.html';

self.addEventListener('install', event => {
  (<any>event).waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          // './img/offline.svg',
          // offlineUrl
          'offline-page.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match('offline-page.html');
          })
    );
  }
  else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});