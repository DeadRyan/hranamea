const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper function for sending emails that handles errors gracefully
function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        // Același tip de configurare care funcționează în scriptul de test
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        transporter.sendMail(mailOptions)
            .then(info => {
                console.log('Email trimis cu succes:', info.messageId);
                resolve(info);
            })
            .catch(err => {
                console.error('Eroare la trimiterea emailului:', err);
                reject(err);
            });
    });
}

// User registration endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check for missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Toate câmpurile sunt obligatorii' 
            });
        }
        
        // IMPORTANT: Debug the SQL query to see what's being executed
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        const checkParams = [email];
        console.log("DEBUG: Executing query:", checkQuery, "with params:", checkParams);
        
        // Check if user already exists - use only email since username column doesn't exist
        db.query(checkQuery, checkParams, async (err, results) => {
            if (err) {
                console.error('Database error during registration check:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Eroare de server, încercați din nou' 
                });
            }
            
            if (results && results.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Utilizatorul sau email-ul există deja' 
                });
            }
            
            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Simplified registration with robust error handling
            console.log("DEBUG: Attempting to register user:", username, email);
            
            // Insert with username field included
            db.query(
                // Include username in the insert query
                'INSERT INTO users (username, email, password, verification_token, verification_expires) VALUES (?, ?, ?, ?, ?)',
                [username, email, hashedPassword, verificationToken, tokenExpiry],
                async (err, result) => {
                    if (err) {
                        console.error('Database error during user creation:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Eroare la crearea contului, încercați din nou'
                        });
                    }
                    
                    const userId = result.insertId;
                    
                    // Create user session immediately with username included
                    req.session.user = {
                        id: userId,
                        username,
                        email,
                        isLoggedIn: true,
                        hasFullAccess: true
                    };
                    
                    // Try to send verification email and wait for result
                    try {
                        const verificationUrl = `${process.env.APP_URL || 'https://hranamea.ro'}/verify-email?token=${verificationToken}`;
                        
                        const mailOptions = {
                            from: process.env.EMAIL_FROM || '"Hrana Mea" <inregistrare@hranamea.ro>',
                            to: email,
                            subject: 'Verificare email - Hrana Mea',
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h2 style="color: #db23e8;">Bine ai venit la Hrana Mea!</h2>
                                    <p>Salut,</p>
                                    <p>Mulțumim că te-ai înregistrat pe platforma noastră. Pentru a activa contul tău, te rugăm să confirmi adresa de email:</p>
                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${verificationUrl}" style="background-color: #db23e8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verifică adresa de email</a>
                                    </div>
                                    <p>Sau poți copia și lipi acest link în browser:</p>
                                    <p>${verificationUrl}</p>
                                    <p>Linkul este valabil 24 de ore.</p>
                                    <p>Cu stimă,<br>Echipa Hrana Mea</p>
                                </div>
                            `
                        };
                        
                        await sendEmail(mailOptions);  // Folosiți await pentru a aștepta trimiterea
                        
                        return res.status(201).json({ 
                            success: true, 
                            message: 'Cont creat cu succes! Verifică email-ul pentru a activa contul.',
                            requiresVerification: true
                        });
                    } catch (emailErr) {
                        console.error('Eroare la trimiterea emailului:', emailErr);
                        // Continuă chiar și dacă emailul eșuează
                        return res.status(201).json({ 
                            success: true, 
                            message: 'Cont creat cu succes, dar a apărut o eroare la trimiterea emailului de verificare.',
                            requiresVerification: true
                        });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Eroare de server, încercați din nou' 
        });
    }
});

// Email verification endpoint
router.get('/verify', (req, res) => {
    const { token } = req.query;
    
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token de verificare lipsă'
        });
    }
    
    // Find user with this verification token
    db.query(
        'SELECT * FROM users WHERE verification_token = ? AND verification_expires > NOW() AND is_verified = 0',
        [token],
        (err, results) => {
            if (err) {
                console.error('Database error during verification:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Eroare de server, încercați din nou'
                });
            }
            
            if (!results || results.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Token invalid sau expirat'
                });
            }
            
            const user = results[0];
            
            // Update user to verified
            db.query(
                'UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?',
                [user.id],
                (err) => {
                    if (err) {
                        console.error('Database error updating verification status:', err);
                        return res.status(500).json({
                            success: false,
                            message: 'Eroare la activarea contului, încercați din nou'
                        });
                    }
                    
                    // Create a subscription with 30 days access
                    const today = new Date();
                    const endDate = new Date();
                    endDate.setDate(today.getDate() + 30);
                    
                    db.query(
                        'INSERT INTO user_subscriptions (user_id, start_date, end_date, is_active) VALUES (?, ?, ?, TRUE)',
                        [user.id, today, endDate],
                        (err) => {
                            if (err) {
                                console.error('Database error during subscription creation:', err);
                                // Proceed even if there's an error with subscription
                            }
                            
                            // Log user in - with username field
                            req.session.user = {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                isLoggedIn: true,
                                hasFullAccess: true
                            };
                            
                            return res.json({
                                success: true,
                                message: 'Email verificat cu succes! Contul tău este acum activ.',
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    hasFullAccess: true
                                }
                            });
                        }
                    );
                }
            );
        }
    );
});

// User login endpoint
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check for missing fields
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Toate câmpurile sunt obligatorii' 
            });
        }
        
        // Check if user exists
        db.query(
            // Query by email only - no username column
            'SELECT * FROM users WHERE email = ?',
            [username], // Use the username field as email input
            async (err, results) => {
                if (err) {
                    console.error('Database error during login:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Eroare de server, încercați din nou' 
                    });
                }
                
                if (!results || results.length === 0) {
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Utilizator sau parolă incorecte' 
                    });
                }
                
                const user = results[0];
                
                // Check password
                const passwordMatch = await bcrypt.compare(password, user.password);
                
                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Utilizator sau parolă incorecte'
                    });
                }
                
                // Check if user is verified
                if (user.is_verified === 0) {
                    return res.status(403).json({
                        success: false,
                        message: 'Contul nu este verificat. Verifică email-ul pentru linkul de activare.',
                        requiresVerification: true
                    });
                }
                
                // Check subscription status
                db.query(
                    'SELECT * FROM user_subscriptions WHERE user_id = ? AND is_active = TRUE AND end_date > NOW() ORDER BY end_date DESC LIMIT 1',
                    [user.id],
                    (err, subscriptions) => {
                        if (err) {
                            console.error('Database error checking subscription:', err);
                        }
                        
                        const hasFullAccess = subscriptions && subscriptions.length > 0;
                        
                        // Update last login time - commented out as the column doesn't exist
                        // db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
                        console.log('User logged in:', user.email);
                        
                        // Create session with username included
                        req.session.user = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            isLoggedIn: true,
                            hasFullAccess
                        };
                        
                        return res.json({
                            success: true,
                            message: 'Autentificare reușită!',
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                hasFullAccess
                            }
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Eroare de server, încercați din nou' 
        });
    }
});

// Resend verification email endpoint
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Adresa de email este obligatorie'
            });
        }
        
        // Check if user exists and is not verified
        db.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) {
                    console.error('Database error during email check:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare de server, încercați din nou'
                    });
                }
                
                if (!results || results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Nu există un cont cu această adresă de email'
                    });
                }
                
                const user = results[0];
                
                // Generate new verification token
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const tokenExpiry = new Date();
                tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours
                
                // Update user with new verification token
                db.query(
                    'UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?',
                    [verificationToken, tokenExpiry, user.id],
                    async (err) => {
                        if (err) {
                            console.error('Database error updating verification token:', err);
                            return res.status(500).json({
                                success: false,
                                message: 'Eroare la generarea unui nou token de verificare'
                            });
                        }
                        
                        // Send verification email
                        try {
                            const verificationUrl = `${process.env.APP_URL || 'https://hranamea.ro'}/verify-email?token=${verificationToken}`;
                            
                            const mailOptions = {
                                from: process.env.EMAIL_FROM || '"Hrana Mea" <inregistrare@hranamea.ro>',
                                to: email,
                                subject: 'Verificare email - Hrana Mea',
                                html: `
                                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                        <h2 style="color: #db23e8;">Verificare email - Hrana Mea</h2>
                                        <p>Salut,</p>
                                        <p>Ai solicitat un nou link de verificare pentru contul tău. Pentru a activa contul, te rugăm să confirmi adresa de email:</p>
                                        <div style="text-align: center; margin: 30px 0;">
                                            <a href="${verificationUrl}" style="background-color: #db23e8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verifică adresa de email</a>
                                        </div>
                                        <p>Sau poți copia și lipi acest link în browser:</p>
                                        <p>${verificationUrl}</p>
                                        <p>Linkul este valabil 24 de ore.</p>
                                        <p>Cu stimă,<br>Echipa Hrana Mea</p>
                                    </div>
                                `
                            };
                            
                            await sendEmail(mailOptions);  // Folosiți await pentru a aștepta trimiterea
                            
                            return res.json({
                                success: true,
                                message: 'Un nou email de verificare a fost trimis. Verifică-ți căsuța de email.'
                            });
                        } catch (emailErr) {
                            console.error('Eroare la trimiterea emailului:', emailErr);
                            // Continuă chiar și dacă emailul eșuează
                            return res.json({
                                success: true,
                                message: 'Cont creat cu succes, dar a apărut o eroare la trimiterea emailului de verificare.'
                            });
                        }
                    }
                );
            }
        );
    } catch (error) {
        console.error('Server error during resend verification:', error);
        res.status(500).json({
            success: false,
            message: 'Eroare de server, încercați din nou'
        });
    }
});

// Logout endpoint
router.get('/logout', (req, res) => {
    // Store user info for logging
    const sessionId = req.session.id;
    const userEmail = req.session.user ? req.session.user.email : 'No user';
    
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({
                success: false,
                message: 'Eroare la deconectare'
            });
        }
        
        // Log successful logout
        console.log(`User logged out: ${userEmail}, session: ${sessionId}`);
        
        // Standard connect.sid cookie used by express-session
        res.clearCookie('connect.sid', {
            path: '/'
        });
        
        res.json({
            success: true,
            message: 'Deconectare reușită'
        });
    });
});

// Check auth status endpoint
router.get('/status', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({
            isLoggedIn: true,
            user: {
                id: req.session.user.id,
                username: req.session.user.username,
                email: req.session.user.email,
                hasFullAccess: req.session.user.hasFullAccess
            }
        });
    } else {
        return res.json({
            isLoggedIn: false
        });
    }
});

// Add a simple route to check if the user is authenticated
router.get('/check-session', (req, res) => {
    // Check if user session exists
    if (req.session && req.session.user) {
        return res.json({
            authenticated: true,
            user: {
                id: req.session.user.id,
                email: req.session.user.email
            }
        });
    } else {
        return res.status(401).json({
            authenticated: false,
            message: 'User not authenticated'
        });
    }
});

module.exports = router;