const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('==== EMAIL SENDING TEST ====');
console.log('Node.js version:', process.version);
console.log('Nodemailer version:', require('nodemailer/package.json').version);

// Get test recipient from command line or use default
const testRecipient = process.argv[2] || 'test@example.com';
console.log(`Will send test email to: ${testRecipient}`);

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
    logger: true
});

// Create email options
const mailOptions = {
    from: `"Test Email" <${process.env.EMAIL_USER}>`,
    to: testRecipient,
    subject: 'Test Email from Hrana Mea Application',
    text: 'This is a test email to verify that the email sending functionality works correctly.',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #db23e8;">Test Email from Hrana Mea</h2>
            <p>This is a test email sent at ${new Date().toLocaleString()}.</p>
            <p>If you received this email, it means the email sending functionality is working properly.</p>
            <hr>
            <p>This is an automated message, please do not reply.</p>
        </div>
    `
};

console.log('Attempting to send email...');
transporter.sendMail(mailOptions)
    .then(info => {
        console.log('✓ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        console.log('Response:', info.response);
        
        console.log('\nIMPORTANT: Check the "sent" folder in your email account to see if this test email appears there.');
    })
    .catch(error => {
        console.error('✗ Error sending email:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.response) {
            console.error('Server response:', error.response);
        }
    });
