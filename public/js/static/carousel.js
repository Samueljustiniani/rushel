let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-image');

function showSlides() {
    // Ocultar todas las imágenes
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
    });

    // Incrementar índice del slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1; // Reiniciar a la primera imagen
    }

    // Mostrar la imagen actual
    slides[slideIndex - 1].classList.add('active');

    // Cambiar de imagen cada 6 segundos
    setTimeout(showSlides, 6000);
}

// Iniciar el carrusel cuando cargue la página
window.onload = showSlides;
//Funcionalidad carousel