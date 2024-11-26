// database.js
const mysql = require('mysql2');

// Configuración de conexión con RDS MySQL
const connection = mysql.createConnection({
    host: 'ods1.c9svexml9zrk.us-east-1.rds.amazonaws.com', // Cambia por tu host RDS
    user: 'admin',               // Cambia por tu usuario de RDS
    password: 'samuel123',        // Cambia por tu contraseña
    database: 'ods'       // Cambia por tu base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos con ID ' + connection.threadId);
});

module.exports = connection;