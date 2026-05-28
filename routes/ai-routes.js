const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const session = require('express-session');
const cors = require('cors');
const https = require('https');

// Function to call DeepSeek API (OpenAI-compatible)
function callDeepSeek(endpoint, data) {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        
        if (!apiKey) {
            return reject(new Error('DeepSeek API key is not set in environment variables'));
        }
        
        const jsonData = JSON.stringify(data);
        
        const options = {
            hostname: 'api.deepseek.com',
            port: 443,
            path: `/v1/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(jsonData)
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsedData);
                    } else {
                        reject(new Error(parsedData.error?.message || `DeepSeek API error: ${res.statusCode}`));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse DeepSeek response: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(new Error(`DeepSeek API request failed: ${error.message}`));
        });
        
        req.write(jsonData);
        req.end();
    });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Setup session middleware for conversation persistence
router.use(session({
    secret: 'hranamea-openai-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Enable CORS for frontend requests
router.use(cors());

// Create a new conversation in the database
router.post('/conversation', (req, res) => {
    try {
        // Insert new conversation in the database
        db.query('INSERT INTO openai_conversations (created_at) VALUES (NOW())', (err, result) => {
            if (err) {
                console.error('Database error creating conversation:', err);
                return res.status(500).json({ error: 'Failed to create conversation', details: err.message });
            }
            
            const conversationId = result.insertId;
            
            // Return the new conversation ID
            res.json({
                conversationId: conversationId,
                messages: []
            });
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// Send a message to OpenAI and get a response
router.post('/message', (req, res) => {
    try {
        const { message, conversationId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }

        // Get conversation history from database
        db.query(
            'SELECT * FROM openai_messages WHERE conversation_id = ? ORDER BY created_at ASC',
            [conversationId],
            (err, messages) => {
                if (err) {
                    console.error('Database error fetching messages:', err);
                    return res.status(500).json({ error: 'Failed to fetch conversation history', details: err.message });
                }
                
                // Build conversation history for OpenAI
                const conversationHistory = messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));
                
                // Add current message to history
                conversationHistory.push({ role: 'user', content: message });
                
                // If no history exists, add a system message with instructions
                if (conversationHistory.length <= 1) {
                    conversationHistory.unshift({
                        role: 'system',
                        content: 'Ești un asistent nutrițional pentru aplicația "Hrana Mea". Oferă sfaturi despre nutriție, diete sănătoase și rețete culinare. Răspunde în limba română, folosind un ton prietenos și de ajutor.'
                    });
                }
                
                // Call DeepSeek API
                callDeepSeek('chat/completions', {
                    model: 'deepseek-chat',
                    messages: conversationHistory,
                    max_tokens: 500,
                    temperature: 0.7,
                })
                .then(response => {
                    let aiResponse = '';
                    if (response && response.choices && response.choices[0] && response.choices[0].message) {
                        aiResponse = response.choices[0].message.content || '';
                    } else {
                        console.error('Unexpected response format from DeepSeek:', response);
                        aiResponse = 'Nu am putut procesa răspunsul. Te rog să încerci din nou.';
                    }
                    
                    // Save user message and AI response to database
                    db.query(
                        'INSERT INTO openai_messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, NOW())',
                        [conversationId, 'user', message],
                        (err) => {
                            if (err) console.error('Error saving user message:', err);
                            
                            db.query(
                                'INSERT INTO openai_messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, NOW())',
                                [conversationId, 'assistant', aiResponse],
                                (err) => {
                                    if (err) console.error('Error saving AI response:', err);
                                    res.json({ response: aiResponse });
                                }
                            );
                        }
                    );
                })
                .catch(error => {
                    console.error('DeepSeek API error:', error);
                    res.status(500).json({
                        error: 'Error communicating with AI service',
                        details: error.message
                    });
                });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// Analyze an uploaded image with OpenAI's Vision model
router.post('/analyze-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        
        const { conversationId, prompt } = req.body;
        
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }
        
        // Default prompt if none is provided
        const imagePrompt = prompt || 'Analizează conținutul nutrițional aproximativ al acestei mâncări și oferă detalii despre calorii, proteine, carbohidrați și grăsimi. Menționează și dacă este o alegere sănătoasă.';
        
        // Read image file
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');
        
        // Call DeepSeek for text-based nutritional analysis
        callDeepSeek('chat/completions', {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'Ești un asistent nutrițional pentru aplicația "Hrana Mea". Analizează descrierile de mâncare și oferă informații nutriționale. Răspunde în română.'
                },
                {
                    role: 'user',
                    content: imagePrompt + '\n\n[Notă: utilizatorul a încărcat o imagine cu mâncare. Oferă sfaturi nutriționale generale bazate pe descrierea de mai sus.]'
                }
            ],
            max_tokens: 500
        })
        .then(response => {
            let aiResponse = '';
            if (response && response.choices && response.choices[0] && response.choices[0].message) {
                aiResponse = response.choices[0].message.content || '';
            } else {
                console.error('Unexpected response format from DeepSeek:', response);
                aiResponse = 'Am analizat imaginea, dar nu am putut prelucra răspunsul. Te rog să încerci din nou.';
            }
            
            // Save the interaction in the database
            db.query(
                'INSERT INTO openai_messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, NOW())',
                [conversationId, 'user', `[Image uploaded with prompt: ${imagePrompt}]`],
                (err) => {
                    if (err) console.error('Error saving image upload message:', err);
                    
                    db.query(
                        'INSERT INTO openai_messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, NOW())',
                        [conversationId, 'assistant', aiResponse],
                        (err) => {
                            if (err) console.error('Error saving image analysis response:', err);
                            
                            fs.unlink(req.file.path, (err) => {
                                if (err) console.error('Error deleting temp file:', err);
                            });
                            
                            res.json({ response: aiResponse });
                        }
                    );
                }
            );
        })
        .catch(error => {
            console.error('DeepSeek image analysis error:', error);
            
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
            
            res.status(500).json({
                error: 'Error analyzing image',
                details: error.message
            });
        });
    } catch (error) {
        console.error('Server error during image processing:', error);
        
        // Attempt to delete the file if it exists
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => {});
        }
        
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// Update or create user profile with AI preferences
router.post('/update-profile', (req, res) => {
    try {
        const { userId, dietPreferences, healthGoals, allergies } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Check if profile exists
        db.query(
            'SELECT * FROM user_ai_profiles WHERE user_id = ?',
            [userId],
            (err, results) => {
                if (err) {
                    console.error('Database error checking user profile:', err);
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }
                
                const profileData = {
                    diet_preferences: dietPreferences || '',
                    health_goals: healthGoals || '',
                    allergies: allergies || ''
                };
                
                if (results && results.length > 0) {
                    // Update existing profile
                    db.query(
                        'UPDATE user_ai_profiles SET diet_preferences = ?, health_goals = ?, allergies = ?, updated_at = NOW() WHERE user_id = ?',
                        [profileData.diet_preferences, profileData.health_goals, profileData.allergies, userId],
                        (err) => {
                            if (err) {
                                console.error('Error updating user profile:', err);
                                return res.status(500).json({ error: 'Failed to update profile', details: err.message });
                            }
                            
                            res.json({ success: true, message: 'Profile updated successfully' });
                        }
                    );
                } else {
                    // Create new profile
                    db.query(
                        'INSERT INTO user_ai_profiles (user_id, diet_preferences, health_goals, allergies, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                        [userId, profileData.diet_preferences, profileData.health_goals, profileData.allergies],
                        (err) => {
                            if (err) {
                                console.error('Error creating user profile:', err);
                                return res.status(500).json({ error: 'Failed to create profile', details: err.message });
                            }
                            
                            res.json({ success: true, message: 'Profile created successfully' });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// Get conversation history
router.get('/conversation/:id', (req, res) => {
    try {
        const conversationId = req.params.id;
        
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }
        
        db.query(
            'SELECT * FROM openai_messages WHERE conversation_id = ? ORDER BY created_at ASC',
            [conversationId],
            (err, messages) => {
                if (err) {
                    console.error('Database error fetching conversation:', err);
                    return res.status(500).json({ error: 'Failed to fetch conversation', details: err.message });
                }
                
                res.json({
                    conversationId: conversationId,
                    messages: messages.map(msg => ({
                        role: msg.role,
                        content: msg.content,
                        timestamp: msg.created_at
                    }))
                });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

module.exports = router;