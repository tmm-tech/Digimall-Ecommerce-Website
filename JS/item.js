// display items on the items.html page
//cart items container
const cartItemsContainer = document.querySelector('.product-details');
const container = document.querySelector('.pro-container');
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log(id);
fetch(`https://fakestoreapi.com/products/${id}`)
    .then(response => response.json())
    .then(product => {
        console.log(product)
            //create cart items
        let ratingStars = "";
        const fullStars = Math.floor(product.rating.rate);
        for (let i = 0; i < fullStars; i++) {
            ratingStars += '<i class="fas fa-star star"></i>';
        }
        if (product.rating.rate % 1 !== 0) {
            ratingStars += '<i class="fas fa-star-half star"></i>' + '<i class="far fa-star star"></i>'.repeat(5 - fullStars - 1);
        } else {
            ratingStars += '<i class="far fa-star star"></i>'.repeat(5 - fullStars);
        }
        cartItem = `
        <div class="single-pro-image">
        <img src=${product.image} width="100%" alt="">
        <div class="single-pro-details">
            <h4 class="category">Home /${product.category}</h4>
            <h4 class="name">${product.title}</h4>
            <h2>Price: $ ${product.price}</h2>
            <div class='star'>
            ${ratingStars}
           </div>
           <h6>${product.rating.count} items remaining</h6>
            <button class="normal">Add To Cart</button>
            <h4>Product Details</h4>
            <span class='description'>${product.description}</span>
        </div>
    </div>
`;
        fetch(`https://fakestoreapi.com/products/category/${product.category}`)
            .then(res => res.json())
            .then((products) => {
                products.map(product => product_design(product, container))
            });
        // product_display(getSpecificCategory(product.category), container)
        cartItemsContainer.innerHTML += cartItem;
        //update total price


    }).catch(error => console.error(error));


// design product display
function product_design(item, container) {
    let cart = {};
    if (localStorage.getItem('cart_items')) {
        cart = JSON.parse(localStorage.getItem('cart_items'));
    }
    let ratingStars = "";
    const fullStars = Math.floor(item.rating.rate);
    for (let i = 0; i < fullStars; i++) {
        ratingStars += '<i class="fas fa-star  star"></i>';
    }
    if (item.rating.rate % 1 !== 0) {
        ratingStars += '<i class="fas fa-star-half star"></i>' + '<i class="far fa-star star"></i>'.repeat(5 - fullStars - 1);
    } else {
        ratingStars += '<i class="far fa-star star"></i>'.repeat(5 - fullStars);
    }
    let pro = document.createElement("div");
    pro.classList.add("pro");
    pro.innerHTML = `
    <img src="${item.image}" alt="${item.title}" />
    <div class="des">
      <h5>${item.title}</h5>
      <div class="star">${ratingStars}</div>
      <h4>$${item.price}</h4>  
    </div>
    <div class="btn">
    <button onclick="addToCart(${item.id})" id="${item.id}">
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      Add to Cart
    </button>
    </div>
  `;
    pro.addEventListener("click", () => {
        //direct the item selected to the item.html page
        window.location.href = `Pages/item.html?id=${item.id}`;
    });
    container.appendChild(pro)
}