function setUsuarios(usuarios) {
    localStorage.setItem('arrayUsuarios', JSON.stringify(usuarios))
}

function getUsuarios() {
    let listaUsuarios = localStorage.getItem('arrayUsuarios')
    if (listaUsuarios == null) {
        listaUsuarios = []
        return listaUsuarios
    }
    else {
        return JSON.parse(listaUsuarios)
    }
}

function agregarUsuario(user) {
    let users = getUsuarios();
    users.push(user);
    setUsuarios(users);
}

function recuperarUsuario(mail){
    let usuarios = getUsuarios()
    let retorno
    if(usuarios.length > 0){
        retorno = usuarios.find(user => user.email == mail)
    }
    return retorno
}

function actualizarUsuario(usuario) {
    let usuarios = getUsuarios();
    let index = usuarios.findIndex(user => user.email == usuario.email);
    usuarios[index] = usuario;
    setUsuarios(usuarios);
}