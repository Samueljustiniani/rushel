const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const fs = require('fs');
const ip = 'localhost';
const port = 3000;

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));


// Configuración de conexión a MySQL con un pool
let pool = mysql.createPool({
    host: "ods1.c9svexml9zrk.us-east-1.rds.amazonaws.com",
    database: "ods",
    user: "admin",
    password: "samuel123",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Manejo de la solicitud POST del formulario
app.post('/submit-form', (req, res) => {
    const { nombres, apellidos, correo, telefono, seleccion_objetos, comentario } = req.body;

    const query = 'INSERT INTO donaciones (nombres, apellidos, correo, telefono, seleccion_objetos , comentario) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(query, [nombres, apellidos, correo, telefono, seleccion_objetos, comentario], (err, result) => {
        if (err) {
            console.error('Error al insertar datos: ' + err.stack);
            res.status(500).send('Ocurrió un error al procesar tu donación.');
            return;
        }

        // Redirigir al index.html después de un envío exitoso
        res.redirect('/');
    });
});


// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
}); 

app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});
