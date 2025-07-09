// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("products.json");
    let products = await response.json();
    return products;
};

// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    // Экранируем кавычки в JSON для безопасной передачи
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


// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-container')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }

   })
   // Функция добавления товара в корзину
function addToCart(product) {
    const {id, name, price, image} = product
    
    let cart = getCartFromStorage();

    // Проверяем, есть ли уже такой товар в корзине
    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        existingItem.quantity += 1;
    } else {
        // Если товара нет, добавляем новый
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Обновляем счетчик товаров в корзине
    updateCartCounter();

}
function getCartFromStorage() {
    let cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
function updateCartCounter() {
    let cart = getCartFromStorage();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Обновляем элемент счетчика (если он есть на странице)
    let counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = totalItems;
    }
}
