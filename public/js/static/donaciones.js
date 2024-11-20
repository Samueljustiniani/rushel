//checkbox y el cuadro de comentarios
function toggleComments() {
  var checkbox = document.getElementById("showComments");
  var commentsBox = document.getElementById("commentsBox");

  // Mostrar/ocultar cuadro de comentarios según el estado del checkbox
  if (checkbox.checked) {
      commentsBox.style.display = "block";
  } else {
      commentsBox.style.display = "none";
  }
}



//validación del formulario de donación

document.getElementById('form')
.addEventListener('submit', function(event) {
  
  // Prevenimos el envío automático del formulario hasta que se validen los datos
  event.preventDefault(); 
  
  // Obtenemos los valores de los campos de texto y edad
  const name = document.getElementById('name').value;
  const Apellido = document.getElementById('lastname').value;
  const email = document.getElementById('email').value
  const telefono = document.getElementById('phone').value;

  // Validación del campo de nombre:
  // Verificamos que el nombre solo contenga letras (mayúsculas o minúsculas) y espacios
  if (!/^[a-zA-Z\s]+$/.test(name)) {//si -> no
      alert('El campo nombre debe contener solo letras y espacios.');
      return; // Si no pasa la validación, detenemos el proceso
  }

  // Validación del campo de apellido:
  // Verificamos que la edad sea un número, es decir, solo contenga dígitos
  if (!/^[a-zA-Z\s]+$/.test(Apellido)) {
      alert('El campo Apellido debe contener solo letras y espacios.');
      return; // Si no pasa la validación, detenemos el proceso
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return; // Si no pasa la validación, detenemos el proceso
  }
  

  if (!/^\d{1,9}$/.test(telefono)) {
      alert('Por favor, ingresa un número de hasta 9 dígitos.');
      return;
  }


  // Si ambas validaciones son correctas, mostramos un mensaje de éxito
  alert('Formulario válido. ¡Enviado correctamente!');
});
