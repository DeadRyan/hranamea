/**
 * PWA Setup Script - Hrana Mea
 * This script automatically injects PWA functionality into any page
 * without requiring modification of the original HTML
 * 
 * Place this as the first script in your pages or add it via server-side
 * configuration to inject into all responses
 */

(function() {
  // Only run once
  if (window.pwaSetupInitialized) return;
  window.pwaSetupInitialized = true;
  
  // Function to dynamically load a script
  function loadScript(src, callback) {
    console.log('Loading script:', src);
    
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log('Script already loaded:', src);
      if (callback) callback();
      return null;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    // Add onload handler if callback provided
    if (callback) {
      script.onload = function() {
        console.log('Script loaded successfully:', src);
        callback();
      };
    }
    
    // Handle errors
    script.onerror = function() {
      console.error('Error loading script: ' + src);
    };
    
    // Add to document
    document.body.appendChild(script); // Changed from head to body for better compatibility
    return script;
  }
  
  // Function to add a link tag
  function addLink(rel, href, sizes, type) {
    // Check if link already exists
    const existingLink = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (existingLink) return;
    
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (sizes) link.sizes = sizes;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
  
  // Function to initialize after DOM loaded
  function initializePWA() {
    // Add manifest link if not present
    if (!document.querySelector('link[rel="manifest"]')) {
      addLink('manifest', '/manifest.json');
    }
    
    // Add Apple touch icons
    addLink('apple-touch-icon', '/images/apple-touch-icon.png');
    
    // Add favicon links if not present
    if (!document.querySelector('link[rel="icon"]')) {
      addLink('icon', '/images/favicon.ico', undefined, 'image/x-icon');
      addLink('icon', '/images/favicon-16x16.png', '16x16', 'image/png');
      addLink('icon', '/images/favicon-32x32.png', '32x32', 'image/png');
    }
    
    console.log('Initializing PWA...');
    
    // Load the PWA register script that handles service worker registration
    loadScript('/pwa-register.js', function() {
      // After PWA registration, load the floating install button
      loadScript('/floating-install-button.js', function() {
        // After floating button is loaded, add the install link to footer
        loadScript('/add-install-link.js', function() {
          console.log('All PWA scripts loaded');
        });
      });
    });
  }
  
  // If DOM already loaded, initialize immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializePWA();
  } else {
    // Otherwise wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initializePWA);
  }
  
  // Add meta tags for PWA if not present
  function addMetaTag(name, content) {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  }
  
  // Add important PWA meta tags
  addMetaTag('apple-mobile-web-app-capable', 'yes');
  addMetaTag('mobile-web-app-capable', 'yes');
  addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMetaTag('theme-color', '#1e1e1e');
  
  // Check if we're running in standalone mode (PWA)
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    // We're in PWA mode, add a class to the body for styling
    document.addEventListener('DOMContentLoaded', function() {
      document.body.classList.add('pwa-mode');
    });
  }
})();