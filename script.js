const productList = document.getElementById("productList");
const cartTable = document.getElementById("cartTable");
const createOrderButton = document.getElementById("createOrderButton");
const totalPriceLabel = document.getElementById("totalPriceLabel");
let totalPrice = 0;
let jsonObject;
let products;

// ON STARTUP
fetch("./data.json")
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        jsonObject = data;
        products = jsonObject.products;
        fillProductList();
    });



// FUNCTIONS
// FILL THE LIST OF PRODUCTS
function fillProductList() {
    products.forEach((product) => {
        productList.innerHTML += '<div class="product_item">' +
        '<h3 class="item_name"></h3>' +
        '<img class="item_image" src="img/Blaxk_logo.png" alt="RedBull">' +
        '<input class="item_quantity" type="number" placeholder="0"></input>' +
        '<button class="item_addButton">Add to cart</button>' +
        '</div>';
        productList.lastChild.children[0].innerHTML = product.name;
    });
}

// EVENT LISTENERS
// CREATE ORDEN (.JSON)
createOrderButton.addEventListener("click", (e) => {
    console.log("Crear .JSON file");
});

// ADD TO CART EVENT
productList.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON") {
        let parentNode = e.target.parentNode;
        if (!parentNode.disabled) {
            let productIndex = products.findIndex(x => x.name === parentNode.children[0].innerHTML);
            let productName = products[productIndex].name;
            let productAmount = parentNode.children[2].value;
            let productPrice = products[productIndex].unit_price;

            let productStock = products[productIndex].stock;
            if (productStock) {
                if (productStock >= productAmount) {
                    if (parentNode.children[2].value > 0) {
                        cartTable.innerHTML += '<tr><td></td><td></td><td></td><td></td></tr>';
                        cartTable.lastChild.children[0].innerHTML = productName;
                        cartTable.lastChild.children[1].innerHTML = productAmount;
                        cartTable.lastChild.children[2].innerHTML = productPrice
                        cartTable.lastChild.children[3].innerHTML = productPrice * productAmount;
                        totalPrice += productPrice * productAmount;
                        totalPriceLabel.innerText = totalPrice;
                    } else {
                        alert("you must select the amount to buy");
                        return;
                    }
                } else {
                    alert(`There is no enough stock for you to buy, the max amount you can buy is ${productStock}`)
                }
            } else {
                parentNode.classList.add("product_unavaliable");
                parentNode.disabled = true;
                parentNode.children[2].disabled = true;
                parentNode.children[3].disabled = true;
                alert("Sorry, at the moment there is no stock");
            }
        }
    }
});