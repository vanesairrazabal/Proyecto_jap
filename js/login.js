
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
    window.location.href = 'index1.html';
  }
}