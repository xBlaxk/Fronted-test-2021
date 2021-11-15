const productList = document.getElementById("productList");
const cartTable = document.getElementById("cartTable");
const createOrderButton = document.getElementById("createOrderButton");
const totalPriceLabel = document.getElementById("totalPriceLabel");
let totalPrice = 0;
let jsonObject;
let shoppingCart = new Map();

// ON STARTUP
console.log("post-Time");
fetch("./data.json")
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        jsonObject = data;
        fillProductList(jsonObject.products);
    });

// FUNCTIONS
// FILL THE LIST OF PRODUCTS
function fillProductList(products) {
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
        let products = jsonObject.products;
        let parentNode = e.target.parentNode;

        if (!parentNode.disabled) {
            // .JSON info
            // Find object with name
            let productIndex = products.findIndex(x => x.name === parentNode.children[0].innerHTML);
            
            // Object info
            let productName = products[productIndex].name;
            let productPrice = products[productIndex].unit_price;
            let productStock = products[productIndex].stock;
            let productAmount = parseInt(parentNode.children[2].value);

            // Shopping cart handler
            if (productStock) { // There is stock of the product?
                if (productStock >= productAmount && productAmount > 0) { // True if there is enough stock of the product
                    if (!shoppingCart.get(productName)) { // Create a new object if the product is not in the shopping cart
                        shoppingCart.set(productName, {
                            price: productPrice,
                            stock: productStock,
                            amount: productAmount
                        });
                        if (shoppingCart.get(productName).stock == shoppingCart.get(productName).amount) {
                            disableProduct(parentNode);
                        }
                        printProductList(shoppingCart, parentNode);
                    } else { // Update the product amount of the object
                        let newAmount = shoppingCart.get(productName).amount + productAmount;
                        if (newAmount <= productStock) {
                            shoppingCart.get(productName).amount = newAmount;
                            if (parentNode.children[2].value > 0) {
                                totalPrice = printProductList(shoppingCart);
                                totalPriceLabel.innerText = totalPrice;
                            }
                        } else {
                            alert(`There is no enough stock for you to buy, the max amount you can buy is ${productStock}`);
                        }
                        if (shoppingCart.get(productName).stock == shoppingCart.get(productName).amount) {
                            disableProduct(parentNode);
                        }
                    }
                } else {
                    if (!productAmount) {
                        alert("you must select the amount to buy");
                    } else {
                        alert(`There is no enough stock for you to buy, the max amount you can buy is ${productStock}`);
                    }
                }
            } else {
                disableProduct(parentNode);
                alert("Sorry, at the moment there is no stock");
            }
        }
    }
});

const printProductList = (map) => {
    let total = 0;
    cartTable.innerHTML = '<tr>' +
                                '<th>Product Name</th>' +
                                '<th>Quantity</th>' +
                                '<th>Unit Price</th>' +
                                '<th>Total Price</th>' +
                            '</tr>';

    map.forEach((productName, key) => {
        cartTable.innerHTML += '<tr><td></td><td></td><td></td><td></td></tr>';
        cartTable.lastChild.children[0].innerHTML = key;
        cartTable.lastChild.children[1].innerHTML = productName.amount;
        cartTable.lastChild.children[2].innerHTML = productName.price
        cartTable.lastChild.children[3].innerHTML = productName.price * productName.amount;
        total += productName.price * productName.amount;
    });
    return total;
}

const disableProduct = (parentNode) => {
    parentNode.classList.add("product_unavaliable");
    parentNode.disabled = true;
    parentNode.children[2].disabled = true;
    parentNode.children[2].value = 0;
    parentNode.children[3].disabled = true;
}