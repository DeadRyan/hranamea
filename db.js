const mysql = require('mysql');

// Create connection with environment variable support for production
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'hranamea_admin',
    password: process.env.DB_PASSWORD || 'Ciceugiurgesti1#',
    database: process.env.DB_NAME || 'hranamea_db',
    charset: 'utf8mb4',  // For proper Romanian character support
    connectTimeout: 60000 // Increase connection timeout for hosting environment
});

// Connect
db.connect((err) => {
    if(err) {
        console.error('MySQL Connection Error:', err);
        throw err;
    }
    
    // Set connection character set
    db.query('SET NAMES utf8mb4', (err) => {
        if(err) console.error('Error setting character set:', err);
        console.log('MySQL Connected with UTF-8 charset...');
        
        // Log database connection details (without sensitive information)
        console.log(`Connected to database: ${process.env.DB_NAME || 'hranamea_db'} on host: ${process.env.DB_HOST || 'localhost'}`);
    });
});

// Add more robust query method with better error handling
db.queryPromise = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Database query error:', err.message);
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = db;