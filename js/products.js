let currentProductsArray = [];

document.addEventListener("DOMContentLoaded", function(e){
    
    let idCategoria = localStorage.getItem("catID")
    getJSONData(PRODUCTS_URL + idCategoria + '.json').then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products
            showProductsList()
        }
    });
    
});

function setProdIDd(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showProductsList() {

    let htmlContentToAppend = "";

    if(currentProductsArray.length > 0 ){

        for(let i = 0; i < currentProductsArray.length; i++){
            let product = currentProductsArray[i];

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
                
            /*
            htmlContentToAppend += `
            <div class="col-3" float=inline>
                        <div class="card">
                        <div class="image">
                            <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                        </div>
                        <h2 class="title">${product.name}</h2>
                        <h5 class="description">${product.description}</h5>
                        <span class="price">${product.currency} ${product.cost}</span>
                        </div>
                    </div>
            `*/

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

