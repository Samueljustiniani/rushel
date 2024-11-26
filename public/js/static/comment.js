const form = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');

// Enviar comentario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const comentario = document.getElementById('comentario').value;

    const response = await fetch('/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, comentario })
    });

    if (response.ok) {
        form.reset();
        loadComments(); // Recargar comentarios después de enviar
    } else {
        alert('Error al agregar el comentario.');
    }
});

// Cargar comentarios
async function loadComments() {
    const response = await fetch('/get-comments');
    const data = await response.json();

    commentsList.innerHTML = '';

    // Agrupar comentarios y respuestas
    const comments = {};
    data.forEach(row => {
        const { comentario_id, comentario_nombre, comentario, comentario_fecha, respuesta_nombre, respuesta } = row;

        if (!comments[comentario_id]) {
            comments[comentario_id] = {
                nombre: comentario_nombre,
                texto: comentario,
                fecha: comentario_fecha,
                respuestas: []
            };
        }

        if (respuesta_nombre && respuesta) {
            comments[comentario_id].respuestas.push({ nombre: respuesta_nombre, texto: respuesta });
        }
    });

    // Renderizar comentarios
    for (const id in comments) {
        const comment = comments[id];
        const commentElement = document.createElement('li');

        commentElement.innerHTML = `
                <strong>${comment.nombre}</strong> (${comment.fecha}): ${comment.texto}
                <ul>
                    ${comment.respuestas.map(r => `<li><em>${r.nombre}</em>: ${r.texto}</li>`).join('')}
                </ul>
            `;
        commentsList.appendChild(commentElement);
    }
}

// Cargar comentarios al inicio
document.addEventListener('DOMContentLoaded', loadComments);