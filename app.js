const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Importamos CORS
const app = express();
const ip = '3.227.119.32';
const port = 3000;

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Habilitamos CORS
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configuración de conexión a MySQL con un pool
const pool = mysql.createPool({
    host: "ods1.c9svexml9zrk.us-east-1.rds.amazonaws.com",
    database: "ods",
    user: "admin",
    password: "samuel123",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Ruta para el formulario de donaciones
app.post('/submit-form', async (req, res) => {
    const { nombres, apellidos, correo, telefono, seleccion_objetos, comentario } = req.body;

    try {
        const query = 'INSERT INTO donaciones (nombres, apellidos, correo, telefono, seleccion_objetos, comentario) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.query(query, [nombres, apellidos, correo, telefono, seleccion_objetos, comentario]);
        res.redirect('/'); // Redirige al index.html tras el envío exitoso
    } catch (err) {
        console.error('Error al insertar datos: ', err.message);
        res.status(500).send('Ocurrió un error al procesar tu donación.');
    }
});

// Ruta para obtener el evento del día
app.get('/evento', async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    try {
        const [results] = await pool.query('SELECT evento, ods FROM fechas_importantes WHERE fecha = ?', [today]);

        if (results.length > 0) {
            const { evento, ods } = results[0];
            res.json({ evento, ods });
        } else {
            res.json({ mensaje: `Hoy es ${today}, no hay eventos programados.` });
        }
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al obtener eventos.');
    }
});

// Ruta para insertar un comentario
app.post('/submit', async (req, res) => {
    const { nombre, comentario } = req.body;

    if (!nombre || nombre.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 2 caracteres.' });
    }

    if (!comentario || comentario.trim().length < 5) {
        return res.status(400).json({ success: false, message: 'El comentario debe tener al menos 5 caracteres.' });
    }

    try {
        const query = 'INSERT INTO comentarios (nombre, comentario, fecha) VALUES (?, ?, NOW())';
        await pool.query(query, [nombre, comentario]);
        res.json({ success: true, message: 'Comentario enviado con éxito.' });
    } catch (err) {
        console.error('Error al guardar el comentario:', err.message);
        res.status(500).json({ success: false, message: 'Error al guardar el comentario.' });
    }
});

// Aquí viene la parte de comentarios, para obtenerlos, procesarlos, y retornarlos
app.get('/comentarios', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM comentarios');

        // Para organizar los comentarios y sus respuestas
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
    } catch (error) {
        console.error('Error al obtener los comentarios:', error.message);
        res.status(500).send('Error al obtener los comentarios.');
    }
});

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});
