const container = document.querySelector('.pro-container');
const category_url = "https://fakestoreapi.com/products/categories";
const products_url = "https://fakestoreapi.com/products";
const specific_category = "https://fakestoreapi.com/products/category";
let cart = JSON.parse(localStorage.getItem("cart"))
const navbar = document.querySelector('.navbar');
const sidebar = document.querySelector('.sidebar');
const barsIcon = document.querySelector('.fa-bars');
const closeBtn = document.querySelector('.close-btn');

barsIcon.addEventListener('click', () => {
    sidebar.style.left = '0';
});

closeBtn.addEventListener('click', () => {
    sidebar.style.left = '-350px';
});

function setCounter() {
    let counter = document.querySelector(".counter");
    if (cart && cart.length) {
        counter.innerText = cart.length;
    } else {
        counter.innerText = 0;
    }
}
setCounter()

const slider = document.querySelector(".slider");
const slides = slider.querySelectorAll("img");
let index = 0;
const categories_icon = [
    { name: "men's clothing", icon: "fa-male" },
    { name: "women's clothing", icon: "fa-female" },
    { name: "jewelery", icon: "fa-gem" },
    { name: "electronics", icon: "fa-laptop" },
];

function changeSlide() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    slides[index].classList.add("active");
    index = (index + 1) % slides.length
}
setInterval(changeSlide, 3000);
// Function to retrieve categories from the fakestore api
async function getCategories() {
    let categories = await fetch(category_url).then(res => res.json())
    console.log(categories)
    createCategories(categories)

}

getCategories()
    // creating navbar for all the categories
async function createCategories(categories) {
    const navBar = document.querySelector(".extracted");
    const navbar_list = document.createElement("ul");
    categories.map(itemgroup => {
        let navbar_list_item = document.createElement("li")
        for (const categ of categories_icon) {
            if (itemgroup === categ.name) {
                navbar_list_item.innerHTML = `<a category='${itemgroup}'>
                <span><i class='fas ${categ.icon}'></i></span>
                <span class='space_'>${itemgroup}</span></a>`
                navbar_list_item.addEventListener("click", async() => {
                    let products = await getSpecificCategory(itemgroup)
                    console.log(products)
                    product_display(products, container)
                })
            }
        }
        navbar_list.appendChild(navbar_list_item)
    })

    navBar.appendChild(navbar_list);


}
// fetch from specific category
async function getSpecificCategory(specific) {
    let products_category = await fetch(`${specific_category}/${specific}`).then(res => res.json())
    return products_category;
}
document.getElementById("selected").addEventListener("click", async() => {
    container.innerHTML = '';
    insert_product();
});
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


async function insert_product() {
    fetch(products_url)
        .then(response => response.json())
        .then(products => {
            products.forEach(product => product_design(product, container))
        }).catch(error => console.error(error));
}
insert_product();


function product_display(products, container) {
    container.innerHTML = '';
    products.map(product => product_design(product, container))
}

function addToCart(id) {
    console.log(id)
    cart = JSON.parse(localStorage.getItem("cart"))
    let ifExists = cart.find(product => product.id === id)
    if (cart.length && ifExists) {
        if (ifExists) {
            let index = cart.findIndex(i => i.id === id)
            let removedcart = cart.splice(index, 1);

            removedcart[0].quantity += 1;
            cart.push(...removedcart)
            localStorage.setItem("cart", JSON.stringify(cart))
            setCounter()
        } else {
            cart.push({
                id: id,
                quantity: 1
            });
            localStorage.setItem("cart", JSON.stringify(cart))
            setCounter()
        }
    } else {
        let cart = []
        cart.push({
            id: id,
            quantity: 1
        })
        localStorage.setItem("cart", JSON.stringify(cart))
        setCounter()
    }

}