const order_desc_price = 'des_precio';
const order_asc_price =  'asc_precio';
const order_sold= 'vendidos';
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === order_asc_price)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === order_desc_price){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === order_sold){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

document.addEventListener("DOMContentLoaded", function(e){
    
    let idCategoria = localStorage.getItem("catID")
    getJSONData(PRODUCTS_URL + idCategoria + '.json').then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products
            showProductsList()
        }
    });
    
});


function showProductsList() {

    let htmlContentToAppend = "";

    if(currentProductsArray.length > 0 ){

        for(let i = 0; i < currentProductsArray.length; i++){
            let product = currentProductsArray[i];
            
            if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){

            htmlContentToAppend += `
                <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active producto">
                    <div class="row">
                        <div class="col-3">
                            <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1 nombre">${product.name}</h4>
                                <small class="text-muted">${product.soldCount} vendidos</small>
                            </div>
                            <p class="mb-1 descripcion">${product.description}</p>
                            <div class="d-flex w-100 justify-content-between">
                                <small class="text-muted"></small>
                                <h4 class="mb-1">${product.currency} ${product.cost}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                `
            }
           
            document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
        }
    }else {
        htmlContentToAppend +=`
        <div class="list-group-item cursor-inactive">
            <h4 class="mb-1">Categoría sin productos</h4>
        </div>
        `
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList();
}

document.getElementById("sortMountAsc").addEventListener("click", function(){
    sortAndShowProducts(order_asc_price);
});

document.getElementById("sortMountDesc").addEventListener("click", function(){
    sortAndShowProducts(order_desc_price);
});

document.getElementById("sortByCount").addEventListener("click", function(){
    sortAndShowProducts(order_sold);
});


// Filtrado
document.getElementById("clearRangeFilter").addEventListener("click", function(){

    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minPrice = undefined;
    maxPrice = undefined;

    showProductsList();
});

document.getElementById("rangeFilterPrice").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio

    minPrice = document.getElementById("rangeFilterPriceMin").value;
    console.log('minPrice:' + minPrice)
    maxPrice = document.getElementById("rangeFilterPriceMax").value;
    console.log('maxPrice:' + maxPrice)

    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
        minPrice = parseInt(minPrice);
    }
    else{
        minPrice = undefined;
    }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
    }
    else{
        maxPrice = undefined;
    }

    showProductsList();
});

document.getElementById('buscar').addEventListener('keyup', (e)=>{
    if (e.key === "Escape") e.target.value = ""
    let info = ""
  
    document.querySelectorAll(".producto").forEach(prod =>{

        prod.querySelectorAll(".nombre").forEach(elemento =>{
            info = elemento.textContent; 
        })

        prod.querySelectorAll(".descripcion").forEach(elemento =>{          
            info += elemento.textContent; 
        })

        info.toLowerCase().includes(e.target.value.toLowerCase())
                ?prod.classList.remove("ocultar")
                :prod.classList.add("ocultar") 
    })
});