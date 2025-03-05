// Register service worker only in production and if service workers are supported
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
} 