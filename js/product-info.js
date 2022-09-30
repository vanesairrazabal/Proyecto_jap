
let producto = undefined
let comentariosProducto = []
let localComment = []
let productosRelacionados = []


document.addEventListener("DOMContentLoaded", function(e){
    let idProducto = localStorage.getItem("prodID")

    // Traer detalle del producto
    getJSONData(PRODUCT_INFO_URL + idProducto + '.json').then(function(resultObj){
        if (resultObj.status === "ok"){
            producto = resultObj.data
            mostrarDetalles(producto)
            mostrarRelacionados(producto.relatedProducts)
        }
    });

    // Traer comentarios del producto
    getJSONData(PRODUCT_INFO_COMMENTS_URL + idProducto + '.json').then(function(resultObj){
        if (resultObj.status === "ok"){
            comentariosProducto = resultObj.data
            mostrarComentarios(comentariosProducto)
        }
    });
});

function mostrarDetalles(prod) {
    console.log(prod);
    let htmlContentToAppend = "";
    /*let sliderImages = '<ul class="slider">';
    let navImages = '<ul class="menu">';

    sliderImages += loadImagesSlider(prod);
    sliderImages += '</ul>';
    navImages += loadNavImagesButton(prod);
    sliderImages += '</ul>';*/

    htmlContentToAppend = `
        <div class="col cardProduct center">
            <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-inner">
                `
            for(let i = 0; i < prod.images.length; i++){
                let imagen = prod.images[i]
                if(i == 0){
                    htmlContentToAppend += `
                    <div class="carousel-item active data-bs-interval="5000">
                        <img src="${imagen}" class="d-block w-75" alt="...">
                     </div>`
                } else {
                    htmlContentToAppend += `
                    <div class="carousel-item data-bs-interval="5000"">
                        <img src="${imagen}" class="d-block w-75" alt="...">
                     </div>`
                }
                }

    htmlContentToAppend += `
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
             <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>

        <div class="cardProduct-info">
            <p class="cardProduct-title">${prod.name}</p>
            <p class="cardProduct-body">${prod.description}</p>
            </div>
        <div class="cardProduct-footer">
            <span class="cardProduct-title price">${prod.currency} ${prod.cost}</span>
        <div class="cardProduct-button">
            <svg class="svg-icon" viewBox="0 0 20 20">
                <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
            </svg>
        </div>
        </div>`

    document.getElementById("ficha-container").innerHTML = htmlContentToAppend;
};

function loadImagesSlider(prod) {
    let listImages = "";
    for(let i = 0; i < prod.images.length; i++){
        listImages += `
        <li id="slide${i}">
            <img src="${prod.images[i]}"/>
        </li>
    `
    }
    return listImages;
};

function loadNavImagesButton(prod) {
    let navButton = "";
    for(let i = 0; i < prod.images.length; i++){
        navButton += `
        <li>
            <a href="#slide${i}">${i+1}</a>
    
        </li>
    `
    }
    return navButton;
};

function mostrarRelacionados(productosRelacionados){    
    let htmlContentToAppend = `
    <div class="col mt-5">
        <div class="mt-1 me-4 right">
        <div class="">
            <h3 class="fc-gray">Productos Relacionados</h3>
        </div>
    </div>
    `

    for(let i = 0; i < productosRelacionados.length; i++) {
        let relatedProduct = productosRelacionados[i]

        htmlContentToAppend += `
        <div onclick="setProdID(${relatedProduct.id})" class="right">
            <div class="row">
                <div class="w-100 right">
                    <img id="imgRelacionado" src="${relatedProduct.image}" alt="${relatedProduct.name}" class="img-thumbnail w-75 mt-4 me-3 cursor-active shadow">
                </div>
            </div>
            <div class="row">
                <div class="mt-1">
                    <h4 class="mb-2 me-4 name">${relatedProduct.name}</h4>
                </div>
            </div>
        </div>
        `
    }
    htmlContentToAppend += '</div>'
    document.getElementById("relacionados").innerHTML += htmlContentToAppend;
}



function mostrarComentarios(comentariosProducto) {
    let htmlContentToAppend = "";
    if(localStorage.getItem("comentarios") != null) {
        localComment = JSON.parse(localStorage.getItem("comentarios"))
    }
    else {
        localComment = []
    }   
    let todosLosComentarios = comentariosProducto.concat(localComment)

    for(let i = 0; i < todosLosComentarios.length; i++){
        let comment = todosLosComentarios[i];
        let stars = '';
        stars += loadStars(comment.score);
        console.log("description: " + comment.description)
    
        htmlContentToAppend += `
        <div onclick="" class="list-group-item list-group-item-action mb-2">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div>
                            ${stars} 
                        </div>                  
                        <small class="design_date">${comment.dateTime}</small>
                    </div> 
                    <p class="mb-1 text-start diseño_user">${comment.user}:</p>
                    <h5 class="mb-1 text-start com">${comment.description}</h5>
                </div>       
            </div>
        </div>
     `
     document.getElementById("ficha-container2").innerHTML = htmlContentToAppend;
    };

    for(let i = 0; i < localComment.length; i++){
        let comment = localComment[i];
        let stars = '';
        stars += loadStars(comment.score);

        if (comment.product === localStorage.getItem("prodID")) {
            htmlContentToAppend += `
            <div onclick="" class="list-group-item list-group-item-action mb-2">
                <div class="row">
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div>
                                ${stars} 
                            </div>                  
                            <small class="design_date">${comment.dateTime}</small>
                        </div> 
                        <p class="mb-1 text-start diseño_user">${comment.user}:</p>
                        <h5 class="mb-1 text-start com">${comment.description}</h5>
                    </div>       
                </div>
            </div>
        `
        }  
     document.getElementById("ficha-container2").innerHTML = htmlContentToAppend;
    };
};

function loadStars(score) {
    let htmlToAppend = '';

    if (score >= 1) { htmlToAppend += '<span class="fa fa-star checked"></span>'; } else { htmlToAppend += '<span class="fa fa-star"></span>'; }
    if (score >= 2) { htmlToAppend += '<span class="fa fa-star checked"></span>'; } else { htmlToAppend += '<span class="fa fa-star"></span>'; }
    if (score >= 3) { htmlToAppend += '<span class="fa fa-star checked"></span>'; } else { htmlToAppend += '<span class="fa fa-star"></span>'; }
    if (score >= 4) { htmlToAppend += '<span class="fa fa-star checked"></span>'; } else { htmlToAppend += '<span class="fa fa-star"></span>'; }
    if (score >= 5) { htmlToAppend += '<span class="fa fa-star checked"></span>'; } else { htmlToAppend += '<span class="fa fa-star"></span>'; }
    return htmlToAppend;
};

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnComment").addEventListener('click', enviarComentario);
  });

function enviarComentario() {
    
          try {
        const comentarioNuevo = { 
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss'), 
            description: document.getElementById("txtComentario").value, 
            product: localStorage.getItem("prodID"), 
            score: 4,
            user: localStorage.getItem("usuario"), 
        }
        if (Array.isArray(localComment)) {
            localComment.push(comentarioNuevo)
        }
        localStorage.setItem("comentarios", JSON.stringify(localComment))
    } catch (error) {
        alert(error)
    }
    
}