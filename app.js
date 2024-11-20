const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const fs = require('fs');
const ip = '34.199.28.49';
const port = 3000;

// Importamos CORS
const cors = require('cors');

// Configuración de middleware
app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para servir archivos estáticos desde la carpeta "public"
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
            return res.status(500).send('Ocurrió un error al procesar tu donación.');
        }

        // Redirigir al index.html después de un envío exitoso
        res.redirect('/');
    });
});

// Nueva funcionalidad del calendario
app.get('/evento', async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    try {
        // Consulta a la base de datos para el evento del día
        const [results] = await pool.promise().query(
            'SELECT evento, ods FROM fechas_importantes WHERE fecha = ?',
            [today]
        );

        // Verificar si hay resultados
        if (results.length > 0) {
            const { evento, ods } = results[0];
            res.json({ evento, ods });
        } else {
            res.json({ mensaje: `Hoy es ${today}, no hay eventos programados.` });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta: ' + error.message);
    }
});



// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
}); 

app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});
