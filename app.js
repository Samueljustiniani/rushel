const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./conexion'); // Asegúrate de que el archivo 'database.js' esté correctamente configurado
const path = require('path'); 
const app = express();
const port = 3000;

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


app.use('/public', express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://3.227.119.32:${port}`);
});
