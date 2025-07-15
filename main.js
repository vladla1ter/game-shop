
let allProducts = [];

async function getProducts() {
    let response = await fetch("products.json");
    let products = await response.json();
    return products;
};

function getCardHTML(product) {
    const productJson = JSON.stringify(product).replace(/"/g, '&quot;');

    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            
            <div class="product-content">
                <h2 class="product-name">${product.name}</h2>
                <div class="product-price">${product.price}$</div>
                <button class="buy-button" onclick='addToCart(${productJson})'>Buy</button>
            </div>
        </div>
    `;
}

function displayProducts(products) {
    let productsList = document.querySelector('.products-container');
    if (productsList) {
        productsList.innerHTML = '';
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product);
        });
    }
}

function searchProducts(searchTerm) {
    if (!searchTerm.trim()) {
        displayProducts(allProducts);
        return;
    }

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    displayProducts(filteredProducts);

    if (filteredProducts.length === 0) {
        let productsList = document.querySelector('.products-container');
        if (productsList) {
            productsList.innerHTML = `
                <div class="no-results">
                    <h3>No products found</h3>
                    <p>No results were found for "${searchTerm}". Please try a different search term.</p>
                </div>
`;
        }
    }
}

function initializeSearch() {
    const searchInput = document.querySelector('.header-search');
    const searchButton = document.querySelector('.search-button');

    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(this.value);
            }, 300); // Задержка 300ms для оптимизации
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts(this.value);
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            searchProducts(searchTerm);
        });
    }
}

getProducts().then(function (products) {
    allProducts = products;
    displayProducts(products);
    initializeSearch();
    updateCartCounter();
});

function addToCart(product) {
    const {id, name, price, image} = product

    let cart = getCartFromStorage();

    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }


    localStorage.setItem('cart', JSON.stringify(cart));


    updateCartCounter();

}
function getCartFromStorage() {
    let cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
function updateCartCounter() {
    let cart = getCartFromStorage();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    let counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = totalItems;
    }
}

function getCartFromStorage() {
    let cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

updateCartCounter();

