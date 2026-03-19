/**
 * PWA Middleware for Hrana Mea App
 * 
 * This middleware injects PWA-related scripts into HTML responses
 * without requiring modification to the original HTML files
 */

const fs = require('fs');
const path = require('path');

module.exports = function pwaMiddleware(req, res, next) {
  // Skip favicon and other static resources
  if (req.url.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/i)) {
    return next();
  }
  
  console.log('PWA Middleware processing request for:', req.url);
  
  // Store original send method
  const originalSend = res.send;

  // Override send method
  res.send = function(body) {
    // Only process HTML responses
    if (
      typeof body === 'string' &&
      body.includes('<!DOCTYPE html>') &&
      res.getHeader('Content-Type')?.includes('text/html')
    ) {
      console.log('PWA Middleware: Processing HTML response for', req.url);
      
      // Check if PWA setup script is already included
      if (!body.includes('pwa-setup.js')) {
        console.log('PWA Middleware: Injecting PWA setup script');
        
        // Directly inject before closing body tag for better compatibility
        if (body.includes('</body>')) {
          body = body.replace(
            '</body>',
            '<script src="/pwa-setup.js"></script></body>'
          );
          console.log('PWA Middleware: Script injected before </body>');
        } else if (body.includes('</head>')) {
          // Fallback to head if body closing tag not found
          body = body.replace(
            '</head>',
            '<script src="/pwa-setup.js"></script></head>'
          );
          console.log('PWA Middleware: Script injected before </head>');
        } else {
          console.log('PWA Middleware: Could not find insertion point for script');
        }
      } else {
        console.log('PWA Middleware: PWA setup script already included');
      }
    }
    
    // Call original send with modified or original body
    return originalSend.call(this, body);
  };
  
  next();
};