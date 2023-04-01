window.addEventListener("load", function() {
    renderCartItems();
});
//get count element
const cartCont = document.querySelector('.cart-count');
//cart items container
const cartItemsContainer = document.querySelector('.cart-container');
//get total price element
const totalPrice = document.querySelector('.total-price');

//get stored cart items
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function updateQuantity(id, quantity) {
    //find product in the cart
    let product = cartItems.find(item => item.id === id);
    if (product) {
        //update product quantity
        product.quantity = quantity;
        product.totalPrice = product.price * product.quantity;
        cartCont.textContent = cartItems.reduce((count, item) => count + item.quantity, 0);

        localStorage.setItem('cart', JSON.stringify(cartItems));
        location.reload();
    }
}

function removeFromCart(id) {
    let cartData = JSON.parse(localStorage.getItem("cart"));
    for (let i = 0; i < cartData.length; i++) {
        if (cartData[i].id === id) {
            cartData.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartData));
    cartCont.textContent = cartItems.reduce((count, item) => count + item.quantity, 0);
    location.reload();

}

async function renderCartItems() {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        let id = cartItems[i].id;
        console.log(id)
        let quantity = cartItems[i].quantity;

        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(response => response.json())
            .then(product => {
                console.log(product)
                let sum = 0;
                sum += product.price * quantity;
                //create cart items
                cartItem = `
                <div class="cart-items">           
                    <img src="${product.image}" alt="${id} class="cart-item-image">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${product.title}</h3>
                        <p class="cart-item-price">${sum}</p>
                        <div class="cart-item-quantity">
                        <button class="btn btn-light btn-sm" onclick="updateQuantity(${id},${quantity-1})">-</button>
                        <input type="text"  value="${quantity}" class="form-control form-control-sm" readonly>
                        <button class="btn btn-light btn-sm" onclick="updateQuantity(${id},${quantity+1})">+</button>
                        </div>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${id})">
                        <i class="fa fa-trash-alt"></i>
                        </button>
                </div>
         `;
                total += product.price * quantity;
                cartCont.textContent = cartItems.length;
                totalPrice.textContent = total;
                //add cart item to thecart items
                cartItemsContainer.innerHTML += cartItem;
                //update total price

            }).catch(error => console.error(error));
    }


}