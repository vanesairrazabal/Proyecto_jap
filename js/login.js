
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formLogin").addEventListener('submit', validarFormulario); 
});

function validarFormulario(evento) {
 
  let mail= document.getElementById('mi-email').value;
  let password= document.getElementById('mi-contraseña').value;
  let error= document.getElementById('error')
  let errorMail = 'No has escrito nada en el email'
  let errorPass = 'La contraseña no es válida'
  let mensajesDeError= [];
  evento.preventDefault();

  if(mail === "") {
    mensajesDeError.push(errorMail);
  }

  if (password.length < 6) {
    mensajesDeError.push(errorPass);
  }

  if (mensajesDeError.length > 0) {
    error.style.color = 'red';
    error.innerHTML = '<p>' + mensajesDeError.join(' , ') + '</p>'
  }
  else {
    localStorage.setItem("usuario", mail);
    window.location.href = 'index1.html';
  }
}

function handleCredentialResponse(respuesta) {
  // respuesta es un json que hay que procesarlo
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.

  console.log(respuesta.credential)
  
  const responsePayload = JSON.parse(decodeJwtResponse(respuesta.credential));

  localStorage.setItem("usuario", responsePayload.email);
  window.location.href = 'index1.html';

}

function decodeJwtResponse(credencial) {
  let payload = atob(credencial.split('.')[1]);
  return payload;
}