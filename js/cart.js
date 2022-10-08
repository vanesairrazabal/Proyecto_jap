let productosEnCarrito = []
let idUsuario = localStorage.getItem("usuario")
let carrito = []
// como el usuario actual no se craga en la base de datos, no puede obtenerse desde la API, por lo tanto te se usa el ID provisto en la entrega.
idUsuario = 25801;

getJSONData(CART_INFO_URL + idUsuario + '.json').then(function (resultObj) {
    if (resultObj.status === "ok") {
        productosEnCarrito = resultObj.data.articles
        //console.log(productosEnCarrito)
    }
    addProductUserCart(productosEnCarrito)   
})

function addProductUserCart(productosEnCarrito){
    carrito =  obtenerCarrito()  
   for(let product of productosEnCarrito) { 
    let prodEncontradoEnCarrito = carrito.find(prod => prod.id == product.id)
   if(prodEncontradoEnCarrito == undefined) {
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
}

function cambioCantidad(prodID){
  let cantidad = parseInt(document.getElementById('cantidad'+prodID).value)
  let prodEncontradoEnCarrito = carrito.find(prod => prod.id == prodID)
  if(prodEncontradoEnCarrito !== undefined){
    prodEncontradoEnCarrito.count = cantidad
    let monto = prodEncontradoEnCarrito.unitCost
    prodEncontradoEnCarrito.totalAmount = monto * cantidad
    let moneda = prodEncontradoEnCarrito.currency
    document.getElementById('total'+prodID).innerHTML= moneda + " " + monto * cantidad;
    guardarCarrito(carrito)
}
}