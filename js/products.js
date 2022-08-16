let currentProductsArray = [];
let minCount = undefined;
let maxCount = undefined;


document.addEventListener("DOMContentLoaded", function(e){
    console.log(PRODUCTS_URL+'101.json')
    getJSONData(PRODUCTS_URL+'101.json').then(function(resultObj){
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

function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        //if (((minCount == undefined) || (minCount != undefined && parseInt(product.productCount) >= minCount)) &&
            //((maxCount == undefined) || (maxCount != undefined && parseInt(product.productCount) <= maxCount))){

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
        //}

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}