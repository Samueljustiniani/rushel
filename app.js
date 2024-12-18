const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const fs = require('fs');
const ip = 'ec2-3-222-250-196.compute-1.amazonaws.com';
const port = 3000;

// Importamos CORS
const cors = require('cors');

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));


// Configuración de conexión a MySQL con un pool
let pool = mysql.createPool({
    host: "finalapobreza.c920g66kq4od.us-east-1.rds.amazonaws.com",
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


//comentarios del producto -----------------------------------------------------------------------------------------------
// Insertar comentario
app.post('/add-comment', (req, res) => {
    const { nombre, comentario } = req.body;

    const query = 'INSERT INTO comentarios (nombre, comentario) VALUES (?, ?)';
    pool.query(query, [nombre, comentario], (err, result) => {
        if (err) {
            console.error('Error al agregar comentario: ' + err.stack);
            res.status(500).send('Error al agregar el comentario.');
            return;
        }
        res.status(200).send('Comentario agregado con éxito.');
    });
});



// Obtener comentarios con respuestas
app.get('/get-comments', (req, res) => {
    const query = `
        SELECT c.id AS comentario_id, c.nombre AS comentario_nombre, c.comentario, c.fecha AS comentario_fecha,
               r.id AS respuesta_id, r.nombre AS respuesta_nombre, r.respuesta, r.fecha AS respuesta_fecha
        FROM comentarios c
        LEFT JOIN respuestas r ON c.id = r.comentario_id
        ORDER BY c.fecha ASC, r.fecha ASC
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener comentarios: ' + err.stack);
            res.status(500).send('Error al obtener comentarios.');
            return;
        }
        res.json(results);
    });
});



// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});

