// live server

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'nozomi.proxy.rlwy.net',        // ✅ Remote host from CLI
    port: 48488,                           // ✅ Port from CLI
    user: 'root',                          // ✅ Username
    password: 'IgqaBOnvVntHIquaIjMjvATrnuEuRZSz',  // ✅ Password
    database: 'railway',                  // ✅ Database name
    multipleStatements: true              // Optional, allows running multiple queries
});

console.warn('✅ Connected to Railway MySQL');

module.exports = db;






