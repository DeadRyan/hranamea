/**
 * verify-email-fix.js
 * 
 * This script fixes the issue with the verification page not being properly routed.
 * It adds a route handler for the verification endpoint.
 * 
 * Run this script in your terminal to fix the issue:
 * cd /home/hranamea/public_html/nodeapp
 * node verify-email-fix.js
 */

// Import required modules
const fs = require('fs');
const path = require('path');

// Path to server.js file
const serverJsPath = path.join(__dirname, 'server.js');

// Read the current server.js file
let serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Check if the verify-email route handling is already present
if (serverJsContent.includes('app.get(\'/verify-email\'')) {
    console.log('The verify-email route is already present in server.js');
    process.exit(0);
}

// Find the position to insert our new route handler
// We'll add it after the static files middleware
const staticMiddlewarePos = serverJsContent.indexOf('app.use(express.static(');
const nextSection = serverJsContent.indexOf('// Body parser middleware');
const insertPosition = nextSection;

// Create our new route handler
const newRouteHandler = `
// Handle verification page route
app.get('/verify-email', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify-email.html'));
});

`;

// Insert the new route handler
const updatedContent = serverJsContent.slice(0, insertPosition) + newRouteHandler + serverJsContent.slice(insertPosition);

// Backup the original server.js file
fs.writeFileSync(serverJsPath + '.bak', serverJsContent, 'utf8');
console.log('Created backup of server.js at ' + serverJsPath + '.bak');

// Write the updated server.js file
fs.writeFileSync(serverJsPath, updatedContent, 'utf8');
console.log('Successfully updated server.js with verify-email route handler');

console.log('\nTo apply the changes, restart your Node.js server with:');
console.log('  pm2 restart server.js');
console.log('or using the cPanel Node.js application restart functionality.');