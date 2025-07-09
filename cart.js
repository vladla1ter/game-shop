// Получаем корзину из localStorage
function getCartFromStorage() {
    let cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Обновляем счетчик товаров в корзине
function updateCartCounter() {
    let cart = getCartFromStorage();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Обновляем элемент счетчика (если он есть на странице)
    let counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = totalItems;
    }
}

// Генерируем HTML для карточки товара в корзине
function getCartItemHTML(item) {
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">${item.price}$ </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">${(item.price * item.quantity).toFixed(2)}$</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Delete</button>
            </div>
        </div>
    `;
}

// Отображаем товары в корзине
function displayCartItems() {
    let cart = getCartFromStorage();
    let cartContainer = document.querySelector('.cart-container');
    let totalContainer = document.querySelector('.cart-total');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">your cart is empty</p>';
        if (totalContainer) totalContainer.innerHTML = '';
        return;
    }
    
    let cartHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        cartHTML += getCartItemHTML(item);
        totalPrice += item.price * item.quantity;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    // Отображаем общую сумму
    if (totalContainer) {
        totalContainer.innerHTML = `
            <div class="cart-summary">
                <h3>Общая сумма: ${totalPrice.toFixed(2)}$</h3>
                <button class="checkout-btn">Make an order</button>
                <button class="clear-cart-btn" onclick="clearCart()">clear the cart</button>
            </div>
        `;
    }
}

// Изменяем количество товара в корзине
function changeQuantity(id, change) {
    let cart = getCartFromStorage();
    let item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        // Если количество стало 0 или меньше, удаляем товар
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCounter();
    }
}

// Удаляем товар из корзины
function removeFromCart(id) {
    let cart = getCartFromStorage();
    cart = cart.filter(item => item.id !== id);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCounter();
    
    console.log('Товар удален из корзины');
}

// Очищаем всю корзину
function clearCart() {
    localStorage.removeItem('cart');
    displayCartItems();
    updateCartCounter();
    console.log('Корзина очищена');
}


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();
    
    // Если мы на странице корзины, отображаем товары
    if (document.querySelector('.cart-container')) {
        displayCartItems();
    }
});

