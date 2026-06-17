// ==========================================================================
// 購物車結帳頁面邏輯 (checkoutCart.js — 支援多帳號隔離)
// ==========================================================================

function getCartKey() {
    const user = localStorage.getItem('pet_user');
    return user ? `pet_cart_${user}` : 'pet_cart_guest';
}

function getHistoryKey() {
    const user = localStorage.getItem('pet_user');
    return user ? `pet_order_history_${user}` : 'pet_order_history_guest';
}

document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutPreview();

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCartOrderSubmit();
        });
    }
});

function renderCheckoutPreview() {
    const cartItems = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const listContainer = document.getElementById('checkout-products-list');
    const totalDisplay = document.getElementById('total-amount-display');

    if (!listContainer) return;

    if (cartItems.length === 0) {
        listContainer.innerHTML = '<p class="loading-text">您的購物車是空的，無法結帳。</p>';
        const form = document.getElementById('order-form');
        if (form) form.style.display = 'none';
        return;
    }

    listContainer.innerHTML = '';
    let totalSum = 0;

    cartItems.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalSum += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'product-info-item';
        itemDiv.innerHTML = `
            <div class="prod-name">${item.productName}</div>
            <div class="prod-details">
                <span>NT$ ${item.price} × ${item.quantity}</span>
                <span class="prod-subtotal">NT$ ${subtotal}</span>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    });

    if (totalDisplay) totalDisplay.textContent = `NT$ ${totalSum}`;
}

// 扣減庫存
function deductStockForItems(cartItems) {
    const STOCK_KEY = 'pet_stock';
    const DEFAULT_STOCK = {
        '1': 150, '2': 120, '3': 100, '4': 45,
        '5': 60,  '6': 95,  '7': 50,  '8': 80, '9': 100
    };

    let stockData = {};
    try {
        stockData = JSON.parse(localStorage.getItem(STOCK_KEY) || '{}');
    } catch (e) { stockData = {}; }

    // 確保所有商品都有初始庫存
    for (const id in DEFAULT_STOCK) {
        if (stockData[id] === undefined) {
            stockData[id] = DEFAULT_STOCK[id];
        }
    }

    // 扣減每個商品的庫存
    cartItems.forEach(item => {
        const id = String(item.productId);
        const current = stockData[id] !== undefined ? stockData[id] : (DEFAULT_STOCK[id] || 0);
        stockData[id] = Math.max(0, current - item.quantity);
    });

    localStorage.setItem(STOCK_KEY, JSON.stringify(stockData));
}

// 寫入訂單歷史
function saveOrderHistory(cartItems, buyerName, totalAmount) {
    const key = getHistoryKey();
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) { history = []; }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const orderId = 'ORD-' + now.getFullYear() + '-' + String(Date.now()).slice(-6);

    // 每個商品各建一筆紀錄
    cartItems.forEach(item => {
        history.unshift({
            id: orderId,
            date: dateStr,
            product: item.productName,
            quantity: item.quantity,
            amount: item.price * item.quantity,
            status: 'completed'
        });
    });

    localStorage.setItem(key, JSON.stringify(history));
}

function handleCartOrderSubmit() {
    const name = document.getElementById('buyer_name').value.trim();
    const phone = document.getElementById('buyer_phone').value.trim();

    if (!name || !phone) {
        alert('請填寫完整的姓名與電話。');
        return;
    }

    const cartItems = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 扣減庫存
    deductStockForItems(cartItems);

    // 寫入訂單歷史
    saveOrderHistory(cartItems, name, totalAmount);

    alert(`🎉 訂單已成功送出！感謝您的購買，${name}。`);
    localStorage.removeItem(getCartKey());
    window.location.href = 'index.html';
}
