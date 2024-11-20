//Validación para formulario

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
//cosnt lastname and phone
const lastname = document.getElementById("Lastname");
const phone = document.getElementById("phone");
const title = document.querySelector(".title");
const button = document.querySelector("button");
const message = document.querySelector(".message");
const donation = document.getElementById("donation");

//! Event listeners for real-time input validation
username.addEventListener("input", validateUsername);

phone.addEventListener("input", validatePhone);
lastname.addEventListener("input", validateLastname);

email.addEventListener("input", validateEmail);
donation.addEventListener("change", validateDonation);

//! Event listener for form submission

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    validateUsername() &&
    //para validar con exito
    validateLastname() &&
    validatePhone() &&

    validateEmail() &&
    validateDonation()

  ) {
    submittedForm();
  }
});

//! Validation functions
function validateUsername() {
  const usernameValue = username.value.trim();
  const usernameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
  if (usernameValue === "") {
    setErrorFor(username, "Nombre no puede estar en blanco");
    return false;
  } else if (!usernameRegex.test(usernameValue)) {
    setErrorFor(username, "Nombre solo debe contener letras");
    return false;
  }
  else {
    setSuccessFor(username);
    return true;
  }
}

function validateLastname() {
  const lastnameValue = lastname.value.trim();
  const lastnameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios

  if (lastnameValue === "") {
    setErrorFor(lastname, "Apellido no puede estar en blanco");
    return false;
  } else if (!lastnameRegex.test(lastnameValue)) {
    setErrorFor(lastname, "Apellido solo debe contener letras");
    return false;
  } else {
    setSuccessFor(lastname);
    return true;
  }
}

function validatePhone() {
  const phoneValue = phone.value.trim();
  const phoneRegex = /^[0-9]{9}$/;
  if (phoneValue === "") {
    setErrorFor(phone, "Celular no puede estar en blanco");
    return false;
  } else if (!phoneRegex.test(phoneValue)) {
    setErrorFor(phone, "Celular debe tener 9 dígitos");
    return false;
  } else {
    setSuccessFor(phone);
    return true;
  }
}


function validateEmail() {
  const emailValue = email.value.trim();
  if (emailValue === "") {
    setErrorFor(email, "Email no puede estar en blanco");
    return false;
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Email no es valido");
    return false;
  } else {
    setSuccessFor(email);
    return true;
  }
}


//Validación de la selección de donación
function validateDonation() {
  const donationValue = donation.value.trim();

  if (donationValue === "") {
    setErrorFor(donation, "Por favor selecciona un monto de donación");
    return false;
  } else {
    setSuccessFor(donation);
    return true;
  }
}

//! Helper functions
function setErrorFor(input, message) {
  const inputControl = input.parentElement;
  const small = inputControl.querySelector("small");

  small.innerText = message;
  inputControl.classList.remove("success");
  inputControl.classList.add("error");
  inputControl.style.paddingBottom = "20px";
  inputControl.style.marginBottom = "14px";
}

function setSuccessFor(input) {
  const inputControl = input.parentElement;

  inputControl.classList.remove("error");
  inputControl.classList.add("success");
  inputControl.style.paddingBottom = "0";
  inputControl.style.marginBottom = "20px";
}

//! Checking email
function isEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

// https://emaillistvalidation.com/blog/email-validation-in-javascript-using-regular-expressions-the-ultimate-guide/

//! Showing the 'submitted' message
function submittedForm() {
  title.classList.add("hidden");
  form.classList.add("hidden");
  message.classList.remove("hidden");
  setTimeout(() => location.reload(true), 2500);
} 
