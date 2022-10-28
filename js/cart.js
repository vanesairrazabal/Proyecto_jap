let productosEnCarrito = []
let idUsuario = localStorage.getItem("usuario")
let carrito = []
let subtotalCompra = 0
let formaPagoSeleccionada = ''
let nroTarjetaCredito = ''
let codSeg = ''
let fechaVenc = ''
let nroCuentaBancaria = ''

// como el usuario actual no se craga en la base de datos, no puede obtenerse desde la API, por lo tanto te se usa el ID provisto en la entrega.
idUsuario = 25801;

document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(CART_INFO_URL + idUsuario + '.json').then(function (resultObj) {
        if (resultObj.status === "ok") {
            productosEnCarrito = resultObj.data.articles
        }
        addProductUserCart(productosEnCarrito)
    })
    
});

function eventosTiposEnvios() {
    document.getElementsByName("tipoEnvio").forEach(control => control.onchange = calculoTotales);
}

function addProductUserCart(productosEnCarrito) {
    carrito = obtenerCarrito()
    for (let product of productosEnCarrito) {
        let prodEncontradoEnCarrito = carrito.find(prod => prod.id == product.id)
        if (prodEncontradoEnCarrito == undefined) {
            let productoNuevo = {
                id: product.id,
                name: product.name,
                count: product.count,
                unitCost: product.unitCost,
                currency: product.currency,
                image: product.image,
                totalAmount: product.unitCost * product.count
            }
            carrito.push(productoNuevo)
        }
    }

    mostrarCarrito(carrito)
}

function mostrarCarrito(carrito) {
    let htmlContentToAppend = ""
    for (let i = 0; i < carrito.length; i++) {
        let productInCart = carrito[i]
        //console.log(productInCart)
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action producto">

            <div class="row">
                <div class="col">
                </div>
                <div class="col left">
                    <h4 class="mb-1 nombre">Nombre</h4>
                </div>
                <div class="col left">
                    <h4 class="mb-1">Costo</h4>
                </div>
                <div class="col left">
                    <h4 class="mb-1">Cantidad</h4>
                </div>
                <div class="col left">
                    <h4 class="mb-1">Subtotal</h4>
                </div>
            </div>

            <div class="row">
                <div onclick="setProdID(${productInCart.id})" class="col cursor-active">
                    <img src="${productInCart.image}" alt="${productInCart.description}" class="img-thumbnail">
                </div>
                <div class="col left">
                    <h4 class="mb-1 nombre">${productInCart.name}</h4>
                </div>
                <div class="col left">
                    <h4 id="monto"${productInCart.id}" class="mb-1">${productInCart.currency} ${productInCart.unitCost}</h4>
                </div>
                <div class="col left">
                    <input id= "cantidad${productInCart.id}" onchange="cambioCantidad(${productInCart.id})" class="mb-1 w-25" type="number" value="${productInCart.count}" min="1" placeholder=""></input>
                </div>
                <div class="col left">
                    <h4 id="total${productInCart.id}" class="mb-1">${productInCart.currency} ${productInCart.totalAmount}</h4>
                </div>
            </div>
        </div>
        `
        document.getElementById("container-cart").innerHTML = htmlContentToAppend;
    }

    let htmlContentToAppendCost = `
    <div class="list-group-item list-group-item-action producto">
        <div class="row">
            <div class="col left">
                 <p class="mb-1 fs-5">Subtotal</p>
            </div>
            <div class="col right">
                 <p id="subtotal" class="mb-1 fs-5"></p>
            </div>
        </div>
    </div>  

    <div class="list-group-item list-group-item-action producto">
        <div class="row">
             <div class="col left">
                 <p class="mb-1 fs-5">Costo de envío</p>
            </div>
            <div class="col right">
                 <p id="costo-envio" class="mb-1 fs-5"></p>
            </div>
        </div>
    </div>  

    <div class="list-group-item list-group-item-action producto">
        <div class="row">
            <div class="col left">
                <p class="mb-1 fs-5">Total a pagar</p>
            </div>
            <div class="col right">
                <p id="total-a-pagar" class="mb-1 fs-5"></p>
            </div>
        </div>
    </div>`

    document.getElementById("container-cost").innerHTML = htmlContentToAppendCost;
    eventosTiposEnvios()
    calculoTotales()

}


function cambioCantidad(prodID) {
    let cantidad = parseInt(document.getElementById('cantidad' + prodID).value)
    let prodEncontradoEnCarrito = carrito.find(prod => prod.id == prodID)
    if (prodEncontradoEnCarrito !== undefined) {
        prodEncontradoEnCarrito.count = cantidad
        let monto = prodEncontradoEnCarrito.unitCost
        prodEncontradoEnCarrito.totalAmount = monto * cantidad
        let moneda = prodEncontradoEnCarrito.currency
        document.getElementById('total' + prodID).innerHTML = moneda + " " + monto * cantidad;
        guardarCarrito(carrito)
    }
    calculoTotales()
}

function calculoTotales() {
    subtotalCompra = carrito.reduce((acumulador, producto) => {
        if (producto.currency === 'UYU') { return acumulador + parseInt(producto.totalAmount / DOLAR) }
        else {
            return acumulador + producto.totalAmount
        }
    }, 0)
    document.getElementById("subtotal").innerHTML = 'USD ' + subtotalCompra;
    let tasaDeEnvio = Array.from(document.getElementsByName('tipoEnvio')).filter((radio) => radio.checked == true)[0].value
    let costoEnvio = parseInt(subtotalCompra * tasaDeEnvio / 100)
    let total = subtotalCompra + costoEnvio;
    document.getElementById('costo-envio').innerHTML = 'USD ' + costoEnvio;
    document.getElementById('total-a-pagar').innerHTML = 'USD ' + total
}


function validar() {
    let valida = true
    const forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms).forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault()
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                valida = false
            }
            else {
                nroTarjetaCredito = document.getElementById("numtarjeta").value;
                codSeg = document.getElementById("codigoSeg").value;
                fechaVenc = document.getElementById("vencimiento").value;
                nroCuentaBancaria = document.getElementById("numCuenta").value;
                if (formaPagoSeleccionada !== '') {
                    document.getElementById('medioDePago').innerText = formaPagoSeleccionada;
                }
            }
            validarMetodoPago()
            form.classList.add('was-validated')
        }, false)
        
    })
    return valida
}

function validaNumericos(event) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
}

function validarMetodoPago(){

    let eleccionDePago = document.getElementById('medioDePago').innerText
    console.log(eleccionDePago)
    let errorMedioDePago = 'Debes seleccionar la forma de pago'
    let error= document.getElementById('error')
    

    if(eleccionDePago === "No has seleccionado") {

        error.style.color = 'red';
        error.innerHTML = '<p>' + errorMedioDePago + '</p>'
    }
    else {
        error.innerHTML = '<p>' + '' + '</p>'
    }
}

function obtenerTipoPagoSeleccionado() {
    // Obtener el tipo de pago desde el value de los controles con name = tipopago 
    let seleccion = Array.from(
        document.getElementsByName("tipoPago")
    ).filter((radio) => radio.checked == true)[0].value;

    if (seleccion === 'tarjeta') {
        formaPagoSeleccionada = 'Tarjeta de crédito';
    }
    else {
        formaPagoSeleccionada = 'Transferencia bancaria';
    }
    return seleccion;
}


function habilitacionControlesPopUp() {
    let formaPago = obtenerTipoPagoSeleccionado();
    if (formaPago === PAGO_TARJETA) {
        // Habilito los controles para la carga de datos de la tarjeta de crédito y deshabilito los de transferencia bancaria
        Array.from(
            document.getElementsByClassName("paymentControl")
        ).forEach(function(control) {
            if(control.name === 'creditCard') {
                control.disabled = false;
            }
            else {
                control.disabled = true;
            }
        });
    }
    else {
        // Habilito los controles para la carga de datos de transferencia bancaria y deshabilito los de tarjeta de crédito
        Array.from(
            document.getElementsByClassName("paymentControl")
        ).forEach(function(control) {
            if(control.name === 'transferenciaBancaria') {
                control.disabled = false;
            }
            else {
                control.disabled = true;
            }
        });
    }
}

function confirmarCompra(){
    let mensaje = ''
    if(validar()){
        getJSONData(CART_BUY_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                mensaje = resultObj.data.msg;
                mostrarMensaje(mensaje,true)
            }
        })
    }
    
}

function mostrarMensaje(mensaje, permiteCerrar) {
    let htmlMensaje = '';

    if(permiteCerrar) {
        htmlMensaje = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                <p></p>
                <h4 class="alert-heading">${mensaje}</h4>
                <p></p>
                <p class="mb-0"></p>
            </div>
        `;
    }
    else {
        htmlMensaje = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <p></p>
                <h4 class="alert-heading">${mensaje}</h4>
                <p></p>
                <p class="mb-0"></p>
            </div>
        `;
    }
    
    document.getElementById("container-message").innerHTML = htmlMensaje;
}

