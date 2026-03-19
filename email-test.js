const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('==== EMAIL DIAGNOSTIC TOOL ====');
console.log('Node.js version:', process.version);
console.log('Nodemailer version:', require('nodemailer/package.json').version);
console.log('');

console.log('Environment settings:');
console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('- EMAIL_SECURE:', process.env.EMAIL_SECURE);
console.log('- EMAIL_USER:', process.env.EMAIL_USER);
console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '[PROTECTED]' : 'Not set');
console.log('');

// Create test transporter with debugging
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true,
    logger: true,
    // Try different authentication type
    authMethod: 'LOGIN'
});

console.log('Testing SMTP connection...');
transporter.verify()
    .then(success => {
        console.log('✓ SMTP connection successful!');
        console.log('Test complete.');
    })
    .catch(error => {
        console.error('✗ Error occurred:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('');
            console.log('AUTHENTICATION ERROR TROUBLESHOOTING:');
            console.log('1. Check if the email password contains special characters that need escaping');
            console.log('2. Try using a different authentication method (LOGIN vs PLAIN)');
            console.log('3. Check if your hosting provider blocks outgoing SMTP connections');
            console.log('4. Verify the email account exists and credentials are correct');
        }
    });
