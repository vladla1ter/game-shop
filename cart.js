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

    if (totalContainer) {
        totalContainer.innerHTML = `
            <div class="cart-summary">
                <h3>Total price: ${totalPrice.toFixed(2)}$</h3>
                <button class="checkout-btn">Make an order</button>
                <button class="clear-cart-btn" onclick="clearCart()">clear the cart</button>
            </div>
        `;
    }
}

function changeQuantity(id, change) {
    let cart = getCartFromStorage();
    let item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCounter();
    }
}

function removeFromCart(id) {
    let cart = getCartFromStorage();
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCounter();

}

function clearCart() {
    localStorage.removeItem('cart');
    displayCartItems();
    updateCartCounter();
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();

    if (document.querySelector('.cart-container')) {
        displayCartItems();
    }
});

function displayCartItems() {
    let cart = getCartFromStorage();
    let cartContainer = document.querySelector('.cart-container');
    let totalContainer = document.querySelector('.cart-total');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
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

    if (totalContainer) {
        totalContainer.innerHTML = `
            <div class="cart-summary">
                <h3>Total: $${totalPrice.toFixed(2)}</h3>
                <button class="checkout-btn" onclick="openOrderModal()">Checkout</button>
                <button class="continue-shopping-btn" onclick="window.location.href='index.html'">Continue Shopping</button>
                <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
            </div>
        `;
    }
}

// Функции для работы с модальными окнами
function openOrderModal() {
    document.getElementById('orderModal').style.display = 'block';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function openSuccessModal() {
    // Генерируем случайный номер заказа
    const orderNumber = Math.floor(Math.random() * 1000000);
    document.getElementById('orderNumber').textContent = '#' + orderNumber;
    document.getElementById('successModal').style.display = 'block';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    // Очищаем корзину после успешного заказа
    clearCart();
}

// Обработка формы заказа
document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();

    if (document.querySelector('.cart-container')) {
        displayCartItems();
    }

    // Закрытие модального окна при клике на крестик
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close')) {
            closeOrderModal();
            closeSuccessModal();
        }
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        const orderModal = document.getElementById('orderModal');
        const successModal = document.getElementById('successModal');

        if (e.target === orderModal) {
            closeOrderModal();
        }
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });

    // Обработка отправки формы
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Имитация отправки заказа
            setTimeout(function() {
                closeOrderModal();
                openSuccessModal();
            }, 1000);
        });
    }
});
