const order_desc_price = 'des_precio';
const order_asc_price =  'asc_precio';
const order_vendidos = 'vendidos';
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minSell= undefined;
let maxSell= undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === order_asc_price)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === order_desc_price){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === order_vendidos){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

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

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showProductsList() {

    let htmlContentToAppend = "";

    if(currentProductsArray.length > 0 ){

        for(let i = 0; i < currentProductsArray.length; i++){
            let product = currentProductsArray[i];
            
            if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
                <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                    <div class="row">
                        <div class="col-3">
                            <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">${product.name}</h4>
                                <small class="text-muted">${product.soldCount} vendidos</small>
                            </div>
                            <p class="mb-1">${product.description}</p>
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

    currentProductsArray = sortCategories(currentSortCriteria, currentProductsArray);

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
    sortAndShowProducts(order_vendidos);
});


// Filtrado
document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minCount = undefined;
    maxCount = undefined;

    showCategoriesList();
});

document.getElementById("rangeFilterPrice").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
    
    minCount = document.getElementById("rangeFilterPriceMin").value;
    maxCount = document.getElementById("rangeFilterPriceMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    showCategoriesList();
});

