// local mysql

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'eminoids',
    multipleStatements: true
});

 

console.warn('Connected');

module.exports = db;


// live server

// const mysql = require('mysql2/promise');

// const db = mysql.createPool({
//     host: 'shuttle.proxy.rlwy.net',   // Updated host
//     port: 32074,                      // Updated port
//     user: 'root',                     // User
//     password: 'zkfLLtwLtzgONVIHWnOHNpnfMAGeuIeL', // Updated password
//     database: 'railway',              // Database name
//     multipleStatements: true         // Allow multiple SQL statements
// });

// console.warn('Connected to Railway MySQL Database');

// module.exports = db;


