const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const fs = require('fs');
const ip = '3.227.119.32';
const port = 3000;

// Importamos CORS
const cors = require('cors');

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

const connection = require('./public/js/static/conexion'); // Asegúrate de que el archivo 'database.js' esté correctamente configurado

// Middleware para parsear datos JSON y archivos estáticos
app.use(bodyParser.json());
app.use(express.static('public')); // Carpeta con archivos estáticos

// Ruta para obtener comentarios y sus respuestas
app.get('/comments', (req, res) => {
    const queryComments = `
        SELECT c.id AS comentario_id, c.nombre AS autor_comentario, c.comentario, c.fecha AS fecha_comentario,
               r.id AS respuesta_id, r.nombre AS autor_respuesta, r.respuesta, r.fecha AS fecha_respuesta
        FROM comentarios c
        LEFT JOIN respuestas r ON c.id = r.comentario_id
        ORDER BY c.fecha DESC, r.fecha ASC;
    `;

    connection.query(queryComments, (err, results) => {
        if (err) {
            console.error("Error al obtener comentarios:", err.message);
            return res.status(500).json({ success: false, message: "Error al obtener los comentarios." });
        }

        const comments = {};
        results.forEach(row => {
            if (!comments[row.comentario_id]) {
                comments[row.comentario_id] = {
                    id: row.comentario_id,
                    nombre: row.autor_comentario,
                    comentario: row.comentario,
                    fecha: row.fecha_comentario,
                    replies: [],
                };
            }
            if (row.respuesta_id) {
                comments[row.comentario_id].replies.push({
                    id: row.respuesta_id,
                    nombre: row.autor_respuesta,
                    respuesta: row.respuesta,
                    fecha: row.fecha_respuesta,
                });
            }
        });

        res.json(Object.values(comments)); // Convertir el objeto en un array
    });
});

// Ruta para insertar un comentario
app.post('/submit', (req, res) => {
    const { nombre, comentario } = req.body;

    // Verificar si los datos son válidos
    if (!nombre || nombre.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 2 caracteres.' });
    }

    if (!comentario || comentario.trim().length < 5) {
        return res.status(400).json({ success: false, message: 'El comentario debe tener al menos 5 caracteres.' });
    }

    console.log('Datos recibidos:', { nombre, comentario });

    // Insertar el comentario en la base de datos
    connection.query(
        'INSERT INTO comentarios (nombre, comentario) VALUES (?, ?)',
        [nombre, comentario],
        (err, result) => {
            if (err) {
                console.error("Error al insertar comentario:", err.message);
                return res.status(500).json({ success: false, message: 'Error al enviar el comentario.' });
            }
            console.log('Comentario insertado con éxito', result);
            res.json({ success: true, message: 'Comentario enviado con éxito.' });
        }
    );
});




// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});


