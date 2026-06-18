
document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const user = localStorage.getItem('pet_user');
    const loginPrompt = document.getElementById('login-prompt');
    const cartContent = document.getElementById('cart-content');
    
    if (user) {
        if (loginPrompt) loginPrompt.style.display = 'none';
        const welcome = document.createElement('p');
        welcome.textContent = `歡迎回來，${user}！您可以管理您的購物車。`;
        welcome.style.color = '#3fa34d';
        welcome.style.marginBottom = '20px';
        const title = document.querySelector('.cart-container h2');
        if (title) title.after(welcome);
    } else {
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
    }
    
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        const form = checkoutBtn.closest('form') || checkoutBtn.parentElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'checkoutCart.html';
        });
    }
});

function getCartItems() {
    const user = localStorage.getItem('pet_user');
    const key = user ? `pet_cart_${user}` : 'pet_cart_guest';
    const items = localStorage.getItem(key);
    
    if (!items) return [];
    
    try {
        const parsed = JSON.parse(items);
        return parsed.map(item => ({
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1
        }));
    } catch (e) {
        console.error("購物車資料解析失敗", e);
        return [];
    }
}

function saveCartItems(items) {
    const user = localStorage.getItem('pet_user');
    const key = user ? `pet_cart_${user}` : 'pet_cart_guest';
    localStorage.setItem(key, JSON.stringify(items));
}

function renderCart() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyPrompt = document.getElementById('empty-prompt');
    const cartContent = document.getElementById('cart-content');

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
        if (emptyPrompt) emptyPrompt.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyPrompt) emptyPrompt.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cartItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.productName}</td>
            <td>NT$ ${item.price.toLocaleString()}</td>
            <td>
                <div class="qty-control-box">
                    <button type="button" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td>NT$ ${subtotal.toLocaleString()}</td>
            <td>
                <button type="button" class="btn-delete" onclick="deleteItem(${index})">刪除</button>
            </td>
        `;
        cartItemsContainer.appendChild(tr);
    });

    if (cartTotalElement) cartTotalElement.textContent = `NT$ ${total.toLocaleString()}`;
}

window.updateQuantity = function(index, delta) {
    const cartItems = getCartItems();
    if (cartItems[index]) {
        const currentQty = Number(cartItems[index].quantity) || 1;
        const targetQty = currentQty + delta;
        cartItems[index].quantity = Math.max(1, targetQty);
        saveCartItems(cartItems);
        renderCart();
    }
};

window.deleteItem = function(index) {
    if (confirm('確定要刪除此商品嗎？')) {
        const cartItems = getCartItems();
        cartItems.splice(index, 1);
        saveCartItems(cartItems);
        renderCart();
    }
};

window.addToCart = function(product) {
    const cartItems = getCartItems();
    const inputQty = Number(product.quantity) || 1;
    const inputPrice = Number(product.price) || 0;

    const existingItem = cartItems.find(item => String(item.productId) === String(product.productId));
    
    if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + inputQty;
    } else {
        cartItems.push({
            productId: product.productId,
            productName: product.productName,
            price: inputPrice,
            quantity: inputQty
        });
    }
    
    saveCartItems(cartItems);
    alert('🛒 已成功加入購物車！');
};
