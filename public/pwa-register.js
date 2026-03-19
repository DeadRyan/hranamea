**
 * PWA Registration Script for Hrana Mea
 * This script handles service worker registration and ensures proper PWA setup
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check for and add manifest link if not present
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
    console.log('Manifest link dynamically added');
  }
  
  // Check for and add apple touch icons if not present
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/images/apple-touch-icon.png';
    document.head.appendChild(appleTouchIcon);
    console.log('Apple touch icon link dynamically added');
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Check for updates to the Service Worker
          registration.addEventListener('updatefound', function() {
            // A new service worker is being installed
            const newWorker = registration.installing;
            console.log('New service worker state:', newWorker.state);
            
            newWorker.addEventListener('statechange', function() {
              console.log('Service worker state changed to:', this.state);
              
              // When the new service worker is activated, refresh to update the app
              if (this.state === 'activated' && !navigator.serviceWorker.controller) {
                // First-time install
                console.log('Service Worker installed for the first time');
              } else if (this.state === 'activated') {
                // Updated service worker
                console.log('Service Worker updated');
                
                // Notify user about update if needed
                if (window.confirm('O nouă versiune a aplicației este disponibilă. Doriți să o încărcați acum?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch(function(error) {
          console.error('Service Worker registration failed:', error);
        });
        
      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        console.log('Service Worker controller changed');
      });
    });
  } else {
    console.log('Service Workers not supported in this browser');
  }
  
  // Handle standalone display mode detection
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Application is running in standalone mode');
    // Hide install prompts when already installed
    const installPrompts = document.querySelectorAll('.app-install-prompt');
    installPrompts.forEach(prompt => {
      prompt.style.display = 'none';
    });
  }
  
  // Listen for display mode changes
  window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    if (evt.matches) {
      console.log('Application changed to standalone mode');
      // Hide any visible install prompts
      const installPrompts = document.querySelectorAll('.app-install-prompt');
      installPrompts.forEach(prompt => {
        prompt.style.display = 'none';
      });
    }
  });
});