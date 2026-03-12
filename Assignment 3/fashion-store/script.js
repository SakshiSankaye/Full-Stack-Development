// ===============================
// PRODUCTS DATA
// ===============================

const products = [

{ id:1, name:"Men's Jacket", category:"Men", price:1999, rating:4.5,
image:"https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600" },

{ id:2, name:"Men's T-Shirt", category:"Men", price:799, rating:4.2,
image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },

{ id:3, name:"Women's Dress", category:"Women", price:1499, rating:4.6,
image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600" },

{ id:4, name:"Women's Top", category:"Women", price:999, rating:4.1,
image:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600" },

{ id:5, name:"Sneakers", category:"Shoes", price:2999, rating:4.7,
image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },

{ id:6, name:"Formal Shoes", category:"Shoes", price:2499, rating:4.4,
image:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600" },

{ id:7, name:"Handbag", category:"Accessories", price:1899, rating:4.3,
image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600" },

{ id:8, name:"Sunglasses", category:"Accessories", price:599, rating:4.0,
image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600" }

];

// ===============================
// LOCAL STORAGE
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(filteredProducts = products) {

    const container = document.getElementById("product-container");
    if (!container) return;

    container.innerHTML = filteredProducts.map(product => `

        <div class="col-md-3 mb-4">

            <div class="card p-2 shadow-sm h-100">

                <img src="${product.image}" class="card-img-top"
                style="height:220px;object-fit:cover;">

                <div class="card-body d-flex flex-column">

                    <h6>${product.name}</h6>

                    <span class="badge bg-success">${product.rating} ★</span>

                    <p class="fw-bold text-success mt-2">₹${product.price}</p>

                    <button class="btn btn-primary w-100 mb-2"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                    </button>

                    <button class="btn btn-outline-danger w-100"
                    onclick="addToWishlist(${product.id})">
                    ❤️ Wishlist
                    </button>

                </div>

            </div>

        </div>

    `).join('');

}

// ===============================
// CATEGORY FILTER
// ===============================

function filterCategory(category) {

    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);

}

// ===============================
// SEARCH
// ===============================

function setupSearch() {

    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(value)
        );

        displayProducts(filtered);

    });

}

// ===============================
// CART
// ===============================

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.qty += 1;

    } else {

        cart.push({ ...product, qty: 1 });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Added to Cart 🛒");

}

function updateCartCount() {

    const count = document.getElementById("cart-count");

    if (count) {

        count.innerText = cart.reduce((sum, item) => sum + item.qty, 0);

    }

}

// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = "<h5>Your cart is empty</h5>";

        const totalBox = document.getElementById("total-price");
        if (totalBox) totalBox.innerText = 0;

        return;

    }

    let total = 0;

    container.innerHTML = cart.map((item, index) => {

        total += item.price * item.qty;

        return `

        <div class="card p-3 mb-3 shadow-sm">

            <div class="row align-items-center">

                <div class="col-md-3 text-center">
                    <img src="${item.image}"
                    style="width:120px;height:120px;object-fit:cover;">
                </div>

                <div class="col-md-3">
                    <h6>${item.name}</h6>
                    <p class="text-success fw-bold">₹${item.price}</p>
                </div>

                <div class="col-md-3 d-flex align-items-center">

                    <button class="btn btn-outline-secondary me-2"
                    onclick="changeQty(${index}, -1)">-</button>

                    <span>${item.qty}</span>

                    <button class="btn btn-outline-secondary ms-2"
                    onclick="changeQty(${index}, 1)">+</button>

                </div>

                <div class="col-md-3 text-end">

                    <button class="btn btn-success btn-sm mb-2"
                    onclick="buyNow()">
                    Buy Now
                    </button>

                    <br>

                    <button class="btn btn-danger btn-sm"
                    onclick="removeItem(${index})">
                    Remove
                    </button>

                </div>

            </div>

        </div>

        `;

    }).join('');

    const totalBox = document.getElementById("total-price");
    if (totalBox) totalBox.innerText = total;

}

// ===============================
// CHANGE QUANTITY
// ===============================

function changeQty(index, change) {

    cart[index].qty += change;

    if (cart[index].qty <= 0) {

        cart.splice(index, 1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

    updateCartCount();

}

// ===============================
// REMOVE ITEM
// ===============================

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

    updateCartCount();

}

// ===============================
// WISHLIST
// ===============================

function addToWishlist(id) {

    const product = products.find(p => p.id === id);

    if (!wishlist.find(item => item.id === id)) {

        wishlist.push(product);

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        alert("Added to Wishlist ❤️");

    } else {

        alert("Already in Wishlist");

    }

}

// ===============================
// BUY NOW → CHECKOUT PAGE
// ===============================

function buyNow() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    window.location.href = "checkout.html";

}

// ===============================
// PLACE ORDER (CHECKOUT PAGE)
// ===============================

function placeOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Cart is empty!");

        return;

    }

    alert("🎉 Order Placed Successfully!\n\nThank you for shopping with us.");

    localStorage.removeItem("cart");

    cart = [];

    window.location.href = "index.html";

}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    displayProducts();

    displayCart();

    updateCartCount();

    setupSearch();

});