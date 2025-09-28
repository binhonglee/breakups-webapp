(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      registrations.forEach(function(registration) {
        registration.unregister().then(function(boolean) {
          if (boolean) {
            console.log('Service worker unregistered successfully');
          }
        }).catch(function(error) {
          console.log('Service worker unregistration failed:', error);
        });
      });
    }).catch(function(error) {
      console.log('Failed to get service worker registrations:', error);
    });

    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('All caches cleared');
      }).catch(function(error) {
        console.log('Failed to clear caches:', error);
      });
    }
  }
})();