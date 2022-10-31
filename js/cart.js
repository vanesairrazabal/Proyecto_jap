let productosEnCarrito = []
let idUsuario = localStorage.getItem("usuario")
let carrito = []
let subtotalCompra = 0
let objDatosTarjeta = undefined;
let objDatosTransBancaria = undefined;

// como el usuario actual no se craga en la base de datos, no puede obtenerse desde la API, por lo tanto te se usa el ID provisto en la entrega.
idUsuario = 25801;

document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(CART_INFO_URL + idUsuario + '.json').then(function (resultObj) {
        if (resultObj.status === "ok") {
            productosEnCarrito = resultObj.data.articles
        }
        addProductUserCart(productosEnCarrito)
    })
    cargarValidacionForm('form1');
    cargarFormaPago();
});

function cargarFormaPago() {
    document.getElementById('medioDePago').innerText = localStorage.getItem('formaPago');
}

function cargarValidacionForm(formName) {
   
    let form = document.getElementById(formName);
    form.addEventListener('submit', function(event) {       
        event.preventDefault();
        if (!form.checkValidity()) {            
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated')
    }, false)
}

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

    if (carrito === undefined || carrito.length == 0) {
        ocultarControlesForm();
        mostrarMensaje('No hay productos en su carrito', false, 'alert-danger');
    }
    else {
        let htmlContentToAppend = `     
            <div class="row">
                <h3 class="fc-gray fs-1 mb-5">Carrito de Compras</h3>
            </div>
            <div class="row">
                <h3 class="fc-black fs-2 mt-2 mb-3">Articulos a Comprar</h3>
            </div>
        `;
        
        for (let i = 0; i < carrito.length; i++) {
            let productInCart = carrito[i]
            //console.log(productInCart)
            htmlContentToAppend += `
            <div class="mt-4 mb-2">
                <div class="row">
                    <div class="col ms-3 left">
                    </div>
                    <div class="col left">
                        <h4 class="mb-1 nombre fw-bold">Nombre</h4>
                    </div>
                    <div class="col right">
                        <h4 class="mb-1 fw-bold">Costo</h4>
                    </div>
                    <div class="col right">
                        <h4 class="mb-1 fw-bold">Cantidad</h4>
                    </div>
                    <div class="col right">
                        <h4 class="mb-1 fw-bold">Subtotal</h4>
                    </div>
                    <div class="col w-25 center">
                    </div>
                </div>

                <div class="row itemCarrito">
                    <div onclick="setProdID(${productInCart.id})" class="col left cursor-active ms-3">
                        <img src="${productInCart.image}" alt="${productInCart.description}" class="img-thumbnail">
                    </div>
                    <div class="col left">
                        <h4 class="mb-1 nombre">${productInCart.name}</h4>
                    </div>
                    <div class="col right fontCalibri">
                        <h4 id="monto"${productInCart.id}" class="mb-1">${productInCart.currency} ${productInCart.unitCost}</h4>
                    </div>
                    <div class="col right">
                        <input id= "cantidad${productInCart.id}" onchange="cambioCantidad(${productInCart.id})" class="quantity" type="number" value="${productInCart.count}" min="1" placeholder="" required></input>
                    </div>
                    <div class="col right fontCalibri">
                        <h4 id="total${productInCart.id}" class="mb-1 fw-bold">${productInCart.currency} ${productInCart.totalAmount}</h4>
                    </div>
                    <div class="col w-25 center">
                        <button id="btnBorrarItemCarrito" onclick='deleteProdInCart(${productInCart.id})' type="button" class="btn btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                        </svg>
                        </button>
                    </div>
                </div>
            </div>
            `
            document.getElementById("container-cart").innerHTML = htmlContentToAppend;
        }

        let htmlContentToAppendCost = `
        <div class="list-group-item producto">
            <div class="row">
                <div class="col left">
                    <p class="mb-1 fs-5">Subtotal</p>
                </div>
                <div class="col right fontCalibri">
                    <p id="subtotal" class="mb-1 fs-5"></p>
                </div>
            </div>
        </div>  

        <div class="list-group-item producto">
            <div class="row">
                <div class="col left">
                    <p class="mb-1 fs-5">Costo de envío</p>
                </div>
                <div class="col right fontCalibri">
                    <p id="costo-envio" class="mb-1 fs-5"></p>
                </div>
            </div>
        </div>  

        <div class="list-group-item producto">
            <div class="row">
                <div class="col left text-success">
                    <p class="mb-1 fs-5 fw-bold">Total a pagar (USD)</p>
                </div>
                <div class="col right fontCalibri text-success">
                    <p id="total-a-pagar" class="mb-1 fs-5 fw-bold"></p>
                </div>
            </div>
        </div>`

        document.getElementById("container-cost").innerHTML = htmlContentToAppendCost;
        eventosTiposEnvios()
        calculoTotales()
    }
}

function deleteProdInCart(idProducto) {
    let prod = carrito.find(p => p.id == idProducto);
    let index = carrito.indexOf(prod);
    if (carrito.length > 1) {
        carrito.splice(index, 1);
    }
    else {
        carrito = [];
    }
    
    guardarCarrito(carrito);
    mostrarCarrito(carrito);
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

function validaNumericos(event) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
}

function validarMetodoPago(){
    let panel = document.getElementById('container-payment');
    let eleccionDePago = document.getElementById('medioDePago').innerText
    let errorMedioDePago = 'Debe seleccionar una forma de pago'
    let error = document.getElementById('mgsError')

    if(eleccionDePago === "No has seleccionado") {
        error.style.color = 'red';
        panel.style.borderColor = 'red';
        error.innerHTML = errorMedioDePago
        return false;
    }
    else {
        panel.style.borderColor = 'gray';
        error.innerHTML = ''
        return true;
    }
}

function obtenerTipoPagoSeleccionado() {
    // Obtener el tipo de pago desde el value de los controles con name = tipoPago
    let formaPagoSeleccionada;
    let seleccion = '';
    let radioChecked = Array.from(
        document.getElementsByName("tipoPago")
    ).filter((radio) => radio.checked == true)[0];

    if (radioChecked !== undefined) {
        seleccion = radioChecked.value;
    }

    if (seleccion === PAGO_TARJETA) {
        formaPagoSeleccionada = 'Tarjeta de crédito';
    }
    else if (seleccion === PAGO_BANCO){
        formaPagoSeleccionada = 'Transferencia bancaria';
    }
    else {
        formaPagoSeleccionada = 'No has seleccionado';
    }
    localStorage.setItem('formaPago', formaPagoSeleccionada);
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
    else if (formaPago === PAGO_BANCO) {
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

function confirmarCompra() {
    let formPrincipal = document.getElementById('form1')
    let mensaje = ""
    if (validarMetodoPago() && formPrincipal.checkValidity()) {
        // Como la compra fue confirmada vacío el carrito y oculto los controles del form
        vaciarCarrito();
        ocultarControlesForm();
        // Debe llamar a la API al endpoint CART_BUY_URL para obtener la respuesta del intento de compra
        getJSONData(CART_BUY_URL).then(function(resultObj){
            if (resultObj.status === "ok"){
                mensaje = resultObj.data.msg;
                mostrarMensaje(mensaje, true);
            }
        })
    }
}

function mostrarMensaje(mensaje, permiteCerrar) {
    let htmlMensaje = '';

    if(permiteCerrar) {
        htmlMensaje = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <button id='btnCierreModal' type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
    if (permiteCerrar) {
        document.getElementById("btnCierreModal").addEventListener('click', returnHomePage); 
    }
}

function desplegarModal() {
    cargarValidacionForm('medioDePagoForm');
    cargarDatosFormaPago();
    habilitacionControlesPopUp();
}

function cargarDatosFormaPago() {
    let formaPago = localStorage.getItem('formaPago');
    if (formaPago === FORMA_PAGO_TARJETA) {
        document.getElementById('radioTarjeta').checked = true;
        let datosTarjeta = JSON.parse(localStorage.getItem('objDatosTarjeta'));
        if(datosTarjeta !== null) {
            document.getElementById("numtarjeta").value = datosTarjeta.nroTarjetaCredito;
            document.getElementById("codigoSeg").value = datosTarjeta.codSeg;
            document.getElementById("vencimiento").value = datosTarjeta.fechaVenc;
            document.getElementById("numCuenta").value = '';
        }
    }
    else if (formaPago === FORMA_PAGO_BANCO){
        document.getElementById('radioCuentaBancaria').checked = true;
        let datosBanco = JSON.parse(localStorage.getItem('objDatosTransBancaria'));
        if(datosBanco !== null) {
            document.getElementById("numtarjeta").value = '';
            document.getElementById("codigoSeg").value = '';
            document.getElementById("vencimiento").value = '';
            document.getElementById("numCuenta").value = datosBanco.nroCuentaBancaria;
        }
    }
}

function validarFormularioFormaPago() {
    
    let formModal = document.getElementById('medioDePagoForm');
    let btnGuardar = document.getElementById('btnGuardarDatosModal');
    
    if (formModal.checkValidity()) {            
        let formaPago = localStorage.getItem('formaPago');
        if (formaPago === FORMA_PAGO_TARJETA) {
            objDatosTarjeta = {
                nroTarjetaCredito : document.getElementById("numtarjeta").value,
                codSeg : document.getElementById("codigoSeg").value,
                fechaVenc : document.getElementById("vencimiento").value
            }
            localStorage.setItem('objDatosTarjeta', JSON.stringify(objDatosTarjeta));
        }
        else if (formaPago === FORMA_PAGO_BANCO){
            objDatosTransBancaria = {
                nroCuentaBancaria : document.getElementById("numCuenta").value
            }
            localStorage.setItem('objDatosTransBancaria', JSON.stringify(objDatosTransBancaria));
        }
        document.getElementById('medioDePago').innerText = formaPago;
        const att = document.createAttribute("data-bs-dismiss");
        att.value = "modal";
        btnGuardar.setAttributeNode(att);
        validarMetodoPago();
    }
    else {
        const attr = btnGuardar.getAttributeNode("data-bs-dismiss");
        if (attr !== null) {
            btnGuardar.removeAttributeNode(attr);
        }
    }
    btnGuardar.dispatchEvent(new Event('onsubmit'));
}

function ocultarControlesForm() {
    document.getElementById("container-cart").innerHTML = '';
    document.getElementById("container-cost").innerHTML = '';
    document.getElementById("container-form").innerHTML = '';
}