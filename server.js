const express = require('express');
const path = require('path');
const db = require('./db');
const session = require('express-session');
const app = express();
const pwaMiddleware = require('./middleware/pwa-middleware');

// Optional: Add dotenv for environment variables (if installed)
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv not installed, skipping...');
}

// Session middleware configuration
app.use(session({
    secret: 'hranamea-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set character encoding for all responses
app.use((req, res, next) => {
    if (!req.path.startsWith('/api/ai/')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

// Serve static files with proper encoding - prioritize this before middleware
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }
    }
}));

// Add PWA middleware to inject PWA functionality into HTML responses
// This should be after static file serving to prevent conflicts
app.use(pwaMiddleware);

// Handle verification page route with explicit content type
app.get('/verify-email', (req, res) => {
    // Override previous middleware content type settings
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    
    // Read file and send with proper content type
    const filePath = path.join(__dirname, 'public', 'verify-email.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending verify-email.html:', err);
            res.status(500).send('Error loading verification page');
        }
    });
});

// Body parser middleware with increased limits for image processing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Import middleware
const authMiddleware = require('./middleware/auth');

// Always attempt to load the AI routes
let aiRoutesLoaded = false;
try {
    // Load authentication routes
    const authRoutes = require('./routes/auth-routes');
    app.use('/api/auth', authRoutes);
    console.log('Authentication routes initialized successfully.');
    
    // Load AI routes with auth middleware
    const aiRoutes = require('./routes/ai-routes');
    
    // Apply authentication middleware only to image analysis route
    app.use('/api/ai/analyze-image', authMiddleware.hasFullAccess);
    
    // All other AI routes are available to everyone
    app.use('/api/ai', aiRoutes);
    
    // Load glycemic routes with authentication middleware
    try {
        const glycemicRoutes = require('./routes/glycemic-routes');
        app.use('/api/glycemic', glycemicRoutes);
        console.log('Glycemic routes initialized successfully.');
    } catch (e) {
        console.error('Error loading glycemic routes:', e.message);
    }
    
    // Load OCR routes for glycemic analyzer
    try {
        const glycemicOcrRoutes = require('./routes/glycemic-ocr-routes');
        app.use('/api/glycemic-ocr', glycemicOcrRoutes);
        console.log('Glycemic OCR routes initialized successfully.');
    } catch (e) {
        console.error('Error loading glycemic OCR routes:', e.message);
        console.error('OCR initialization stack:', e.stack);
    }
    
    console.log('AI routes initialized successfully.');
    aiRoutesLoaded = true;
} catch (e) {
    console.error('Error loading AI routes:', e.message);
    console.log('Make sure to run npm install openai dotenv mysql2 multer express-session cors');
    
    // Set up fallback AI routes if the main ones fail to load
    console.log('Setting up fallback AI routes...');
    const router = express.Router();
    
    // Fallback conversation endpoint
    router.post('/conversation', (req, res) => {
        console.log('Fallback conversation endpoint called');
        res.json({
            conversationId: 'fallback-' + Date.now(),
            messages: []
        });
    });
    
    // Fallback message endpoint
    router.post('/message', (req, res) => {
        console.log('Fallback message endpoint called');
        res.json({
            response: "Îmi pare rău, serviciul AI este momentan indisponibil. Vă rugăm să încercați din nou mai târziu."
        });
    });
    
    // Fallback image analysis endpoint
    router.post('/analyze-image', (req, res) => {
        console.log('Fallback image analysis endpoint called');
        res.json({
            response: "Îmi pare rău, analiza imaginilor este momentan indisponibilă. Vă rugăm să încercați din nou mai târziu."
        });
    });
    
    // Fallback profile update endpoint
    router.post('/update-profile', (req, res) => {
        console.log('Fallback profile update endpoint called');
        res.json({ success: true });
    });
    
    app.use('/api/ai', router);
    console.log('Fallback AI routes initialized.');
}

// Log environment variables status without exposing values
console.log('Environment status:');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('- XAI_API_KEY:', process.env.XAI_API_KEY ? 'Set' : 'Not set');
console.log('- DB_HOST:', process.env.DB_HOST ? 'Set' : 'Not set');
console.log('- DB_USER:', process.env.DB_USER ? 'Set' : 'Not set');
console.log('- DB_NAME:', process.env.DB_NAME ? 'Set' : 'Not set');

// Enhanced API endpoint for recipes with regime support
app.get('/api/recipe/:mealType', (req, res) => {
    // Get meal type parameter and regime from query
    const mealType = req.params.mealType;
    const regime = req.query.regime || 'diabetic'; // Default to diabetic regime if not specified
    
    console.log('Recipe requested for:', mealType, 'with regime:', regime);
    
    // Set character encoding before query
    const handleEncodingSetup = (err) => {
        if (err) {
            console.error('Error setting character encoding:', err);
        }
    };
    
    db.query('SET NAMES utf8mb4 COLLATE utf8mb4_romanian_ci', handleEncodingSetup);
    
    // Determine which database table to query based on regime and meal type
    if (regime === 'sanatos') {
        // Map meal type to the appropriate healthy recipe table
        let tableToQuery = '';
        switch(mealType) {
            case 'Mic dejun':
                tableToQuery = 'sanatos_mic_dejun';
                break;
            case 'Prânz':
                tableToQuery = 'sanatos_pranz';
                break;
            case 'Cină':
                tableToQuery = 'sanatos_cina';
                break;
            case 'Snack':
            case 'Gustare':
                tableToQuery = 'sanatos_gustare';
                break;
            default:
                tableToQuery = 'sanatos_mic_dejun'; // Default to breakfast if unknown
        }
        
        // Query the appropriate healthy recipe table
        const healthyRecipeQuery = `SELECT * FROM ${tableToQuery} ORDER BY RAND() LIMIT 1`;
        
        db.query(healthyRecipeQuery, (err, results) => {
            if (err) {
                console.error('Database error fetching healthy recipe:', err);
                
                // Fallback to in-memory healthy recipes
                try {
                    const healthyRecipes = require('./public/healthyRecipeData');
                    const category = mealType === 'Snack' ? 'Gustare' : mealType;
                    
                    if (healthyRecipes[category] && healthyRecipes[category].length > 0) {
                        const randomIndex = Math.floor(Math.random() * healthyRecipes[category].length);
                        const recipe = healthyRecipes[category][randomIndex];
                        
                        // Add metadata
                        recipe.tip_masa = mealType;
                        recipe.regime = 'sanatos';
                        
                        return res.json(recipe);
                    }
                } catch (e) {
                    console.error('Error fetching from healthy recipe data:', e);
                }
                
                // If both database and in-memory fetch failed, return an error
                return res.status(500).json({ success: false, error: 'No healthy recipes found' });
            }
            
            if (results && results.length > 0) {
                const recipe = results[0];
                
                // Add metadata
                recipe.tip_masa = mealType;
                recipe.regime = 'sanatos';
                
                return res.json(recipe);
            } else {
                // No results from database, try in-memory healthy recipes
                try {
                    const healthyRecipes = require('./public/healthyRecipeData');
                    const category = mealType === 'Snack' ? 'Gustare' : mealType;
                    
                    if (healthyRecipes[category] && healthyRecipes[category].length > 0) {
                        const randomIndex = Math.floor(Math.random() * healthyRecipes[category].length);
                        const recipe = healthyRecipes[category][randomIndex];
                        
                        // Add metadata
                        recipe.tip_masa = mealType;
                        recipe.regime = 'sanatos';
                        
                        return res.json(recipe);
                    }
                } catch (e) {
                    console.error('Error fetching from healthy recipe data:', e);
                }
                
                return res.status(404).json({ success: false, error: 'No healthy recipes found' });
            }
        });
    } else {
        // This is the diabetic regime, use the existing logic with regular recipes
        try {
            // Try to fetch from local recipe data first
            const recipeData = require('./recipeData');
            if (recipeData && recipeData[mealType] && recipeData[mealType].length > 0) {
                // Select a random recipe from the available ones
                const randomIndex = Math.floor(Math.random() * recipeData[mealType].length);
                const recipe = recipeData[mealType][randomIndex];
                
                // Add the meal type to the recipe object for reference
                recipe.tip_masa = mealType;
                
                // Add a regime tag
                recipe.regime = 'diabetic';
                
                return res.json(recipe);
            }
        } catch (e) {
            console.error('Error fetching from recipe data:', e);
        }
        
        // If we reach here, we couldn't get from the local data, so try the database
        
        // Get a recipe that starts with the first letter of the meal type
        const firstLetter = mealType.charAt(0);
        const query = 'SELECT * FROM recipes WHERE categorie LIKE ? ORDER BY RAND() LIMIT 1';
        
        const handleRecipeQueryResult = (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, error: 'Database error' });
            }
            
            if (results && results.length > 0) {
                const recipe = results[0];
                
                // Add the meal type to the recipe object for reference
                recipe.tip_masa = mealType;
                
                // Add a regime tag to differentiate
                recipe.regime = 'diabetic';
                
                return res.json(recipe);
            } else {
                // Fallback to any random recipe
                const handleFallbackQueryResult = (err2, results2) => {
                    if (err2 || !results2 || results2.length === 0) {
                        return res.status(404).json({ success: false, error: 'No recipes found' });
                    }
                    
                    const recipe = results2[0];
                    
                    // Add the meal type to the recipe object for reference
                    recipe.tip_masa = mealType;
                    
                    // Add a regime tag
                    recipe.regime = 'diabetic';
                    
                    return res.json(recipe);
                };
                
                db.query('SELECT * FROM recipes ORDER BY RAND() LIMIT 1', handleFallbackQueryResult);
            }
        };
        
        db.query(query, [firstLetter + '%'], handleRecipeQueryResult);
    }
});

// Function to import recipe data with proper encoding
const importRecipes = (recipeData) => {
    // Define the import function
    const handleImportEncodingSetup = (err) => {
        if (err) {
            console.error('Error setting character encoding:', err);
            return;
        }
        
        console.log('Character encoding set for import');
        
        // Import each recipe with proper encoding
        const importRecipeItem = (recipe, category) => {
            const query = 'INSERT INTO recipes (nume, descriere, categorie) VALUES (?, ?, ?)';
            db.query(query, [recipe.nume, recipe.descriere, category], (err) => {
                if (err) {
                    console.error('Error importing recipe:', err);
                }
            });
        };
        
        for (const category in recipeData) {
            const recipesInCategory = recipeData[category];
            for (let i = 0; i < recipesInCategory.length; i++) {
                importRecipeItem(recipesInCategory[i], category);
            }
        }
        console.log('Recipe import process initiated');
    };
    
    // Set connection character encoding before import
    db.query('SET NAMES utf8mb4 COLLATE utf8mb4_romanian_ci', handleImportEncodingSetup);
};

// Check and force reimport recipes
const checkAndImportRecipes = () => {
    try {
        console.log('Importing recipes from data file...');
        const recipeData = require('./recipeData');
        importRecipes(recipeData);
        
        // Create tables for healthy recipes if they don't exist
        createHealthyRecipeTables();
    } catch (e) {
        console.error('Error during recipe import:', e);
    }
};

// Create tables for healthy recipes
const createHealthyRecipeTables = () => {
    console.log('Creating or checking tables for healthy recipes...');
    
    // Create table for each healthy recipe category
    const createTableQueries = [
        `CREATE TABLE IF NOT EXISTS sanatos_mic_dejun (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nume VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            descriere TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS sanatos_pranz (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nume VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            descriere TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS sanatos_cina (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nume VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            descriere TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS sanatos_gustare (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nume VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            descriere TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];
    
    // Execute each query
    createTableQueries.forEach(query => {
        db.query(query, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            }
        });
    });
    
    // Import healthy recipes
    try {
        const healthyRecipes = require('./public/healthyRecipeData');
        importHealthyRecipes(healthyRecipes);
    } catch (e) {
        console.error('Error importing healthy recipes:', e);
    }
};

// Function to import healthy recipes
const importHealthyRecipes = (healthyRecipes) => {
    // Set character encoding
    db.query('SET NAMES utf8mb4 COLLATE utf8mb4_romanian_ci', (err) => {
        if (err) {
            console.error('Error setting character encoding for healthy recipes:', err);
            return;
        }
        
        console.log('Character encoding set for healthy recipe import');
        
        // Check if connection is active
        if (db.state === 'disconnected') {
            console.error('Database connection is not active. Trying to reconnect...');
            db.connect((err) => {
                if (err) {
                    console.error('Failed to reconnect to database:', err);
                    return;
                }
                console.log('Reconnected to database successfully');
                proceedWithImport();
            });
        } else {
            proceedWithImport();
        }
        
        function proceedWithImport() {
        
        // Clear existing data from tables
        const clearTables = [
            'TRUNCATE TABLE sanatos_mic_dejun',
            'TRUNCATE TABLE sanatos_pranz',
            'TRUNCATE TABLE sanatos_cina',
            'TRUNCATE TABLE sanatos_gustare'
        ];
        
        clearTables.forEach(query => {
            db.query(query, (err) => {
                if (err) {
                    console.error('Error clearing table:', err);
                }
            });
        });
        
        // Import recipes by category
        const importRecipe = (recipe, tableName) => {
            const query = `INSERT INTO ${tableName} (nume, descriere) VALUES (?, ?)`;
            db.query(query, [recipe.nume, recipe.descriere], (err) => {
                if (err) {
                    console.error(`Error importing recipe to ${tableName}:`, err);
                }
            });
        };
        
        // Import each category
        if (healthyRecipes["Mic dejun"]) {
            healthyRecipes["Mic dejun"].forEach(recipe => {
                importRecipe(recipe, 'sanatos_mic_dejun');
            });
        }
        
        if (healthyRecipes["Prânz"]) {
            healthyRecipes["Prânz"].forEach(recipe => {
                importRecipe(recipe, 'sanatos_pranz');
            });
        }
        
        if (healthyRecipes["Cină"]) {
            healthyRecipes["Cină"].forEach(recipe => {
                importRecipe(recipe, 'sanatos_cina');
            });
        }
        
        if (healthyRecipes["Gustare"]) {
            healthyRecipes["Gustare"].forEach(recipe => {
                importRecipe(recipe, 'sanatos_gustare');
            });
        }
        
            console.log('Healthy recipe import process initiated');
            
            // Check if import was successful by counting records
            setTimeout(() => {
                const tables = ['sanatos_mic_dejun', 'sanatos_pranz', 'sanatos_cina', 'sanatos_gustare'];
                tables.forEach(table => {
                    db.query(`SELECT COUNT(*) as count FROM ${table}`, (err, result) => {
                        if (err) {
                            console.error(`Error checking table ${table} after import:`, err);
                        } else {
                            console.log(`Table ${table} has ${result[0].count} records after import`);
                        }
                    });
                });
            }, 2000); // Check after a short delay to allow inserts to complete
        }
    });
};

// API endpoint to check healthy recipe tables status
app.get('/api/admin/check-healthy-tables', (req, res) => {
    const tables = ['sanatos_mic_dejun', 'sanatos_pranz', 'sanatos_cina', 'sanatos_gustare'];
    const results = {};
    
    let completedQueries = 0;
    
    tables.forEach(table => {
        db.query(`SELECT COUNT(*) as count FROM ${table}`, (err, result) => {
            if (err) {
                console.error(`Error checking table ${table}:`, err);
                results[table] = { error: 'Error checking table', details: err.message };
            } else {
                results[table] = { count: result[0].count };
            }
            
            completedQueries++;
            if (completedQueries === tables.length) {
                res.json({
                    status: 'success',
                    tables: results
                });
            }
        });
    });
});

// API endpoint to manually trigger import of healthy recipes
app.get('/api/admin/import-healthy-recipes', (req, res) => {
    console.log('Manual import of healthy recipes triggered');
    try {
        const healthyRecipes = require('./public/healthyRecipeData');
        importHealthyRecipes(healthyRecipes);
        
        res.json({
            status: 'success',
            message: 'Healthy recipe import process started'
        });
    } catch (e) {
        console.error('Error during manual import of healthy recipes:', e);
        res.status(500).json({
            status: 'error',
            message: 'Failed to import healthy recipes',
            error: e.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
const handleServerStart = () => {
    console.log(`Server running on port ${PORT}`);
    // Force reimport recipes with proper encoding
    try {
        console.log('Starting automatic import of recipes on server start');
        checkAndImportRecipes();
        console.log('Recipe import process initiated successfully');
    } catch (e) {
        console.error('Error during automatic recipe import on server start:', e);
    }
    
    // Create glycemic readings table if it doesn't exist - SQL inline instead of reading from file
    try {
        // Create glycemic_readings table directly with SQL statement
        const createGlycemicTableSQL = `
            CREATE TABLE IF NOT EXISTS glycemic_readings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                value FLOAT NOT NULL,
                timing VARCHAR(50) NOT NULL,
                meal_type VARCHAR(50) NOT NULL,
                reading_time DATETIME NOT NULL,
                image_data LONGTEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (user_id),
                INDEX (reading_time)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_romanian_ci
        `;
        
        db.query(createGlycemicTableSQL, (err) => {
            if (err) {
                console.error('Error creating glycemic table:', err);
            } else {
                console.log('Glycemic readings table verified/created successfully');
            }
        });
    } catch (e) {
        console.error('Error setting up glycemic database table:', e);
    }
};

app.listen(PORT, handleServerStart);
