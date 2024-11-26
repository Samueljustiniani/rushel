document.addEventListener('DOMContentLoaded', function () {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    // Función para obtener los comentarios desde el servidor
    function fetchComments() {
        fetch('/comments')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Para depurar la respuesta
                displayComments(data); // Mostrar los comentarios desde el servidor
            })
            .catch(error => {
                console.error('Error al cargar los comentarios:', error);
            });
    }

    // Función para crear los elementos de comentario
    function displayComments(comentarios) {
        commentsList.innerHTML = ''; // Limpiar la lista de comentarios
        comentarios.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.classList.add('comment-item');

            const commentHeader = document.createElement('div');
            commentHeader.classList.add('comment-profile');

            // Imagen de perfil
            const profilePic = document.createElement('div');
            profilePic.classList.add('profile-pic');
            profilePic.style.backgroundImage = "url('/img/perfil.png')"; // Cambiar por la ruta correcta de la imagen

            // Detalles del comentario (nombre y texto del comentario)
            const commentDetails = document.createElement('div');
            commentDetails.classList.add('comment-details');
            commentDetails.innerHTML = `<strong>${comment.nombre}</strong>`; // Nombre del autor

            const commentText = document.createElement('p');
            commentText.classList.add('comment-text');
            commentText.textContent = comment.comentario;

            // Botón "Ver respuestas"
            const viewRepliesBtn = document.createElement('button');
            viewRepliesBtn.classList.add('view-replies-btn');
            viewRepliesBtn.textContent = `Ver respuestas (${comment.replies.length})`;
            viewRepliesBtn.addEventListener('click', function () {
                repliesContainer.classList.toggle('hidden');
            });

            // Contenedor de respuestas (inicialmente oculto)
            const repliesContainer = document.createElement('div');
            repliesContainer.classList.add('replies', 'hidden');

            // Crear las respuestas
            comment.replies.forEach(reply => {
                const replyItem = document.createElement('div');
                replyItem.classList.add('reply-item');
                replyItem.innerHTML = `<div class="reply-profile">
                    <div class="profile-pic"></div>
                    <div class="reply-details">
                        <strong>${reply.nombre}</strong>
                        <p>${reply.respuesta}</p>
                    </div>
                </div>`;
                repliesContainer.appendChild(replyItem);
            });

            // Construir el comentario
            commentItem.appendChild(commentHeader);
            commentHeader.appendChild(profilePic);
            commentItem.appendChild(commentDetails);
            commentItem.appendChild(commentText);
            commentItem.appendChild(viewRepliesBtn);
            commentItem.appendChild(repliesContainer);

            // Añadir comentario a la lista
            commentsList.appendChild(commentItem);
        });
    }

    // Manejar el envío de un nuevo comentario
    commentForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto (recargar la página)
        const nameInput = document.getElementById('nombre');
        const commentInput = document.getElementById('comentario');

        if (nameInput.value && commentInput.value) {
            const newComment = {
                nombre: nameInput.value, // Asegúrate de que el campo sea "nombre"
                comentario: commentInput.value // Asegúrate de que el campo sea "comentario"
            };

            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComment)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchComments(); // Recargar los comentarios
                    nameInput.value = ''; // Limpiar el campo de nombre
                    commentInput.value = ''; // Limpiar el campo de comentario
                } else {
                    alert(data.message); // Mostrar mensaje de error
                }
            })
            .catch(error => {
                console.error('Error al enviar el comentario:', error);
            });
        } else {
            alert('Por favor, ingrese un nombre y un comentario.');
        }
    });

    // Inicializar la lista de comentarios
    fetchComments();  // Cargar los comentarios al cargar la página
});