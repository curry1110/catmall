// ==========================================================================
// 結帳頁面邏輯 (checkout.js — 支援多帳號隔離)
// ==========================================================================

function getCartKey() {
    const user = localStorage.getItem('pet_user');
    return user ? `pet_cart_${user}` : 'pet_cart_guest';
}

function getHistoryKey() {
    const user = localStorage.getItem('pet_user');
    return user ? `pet_order_history_${user}` : 'pet_order_history_guest';
}

let _directProductId = null;
let _directQuantity = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. 嘗試從 URL 參數獲取單一商品資訊 (直接購買流程)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    const productName = params.get('productName');
    const price = params.get('price');
    const quantity = params.get('quantity');

    if (productId && productName && price && quantity) {
        _directProductId = productId;
        _directQuantity = parseInt(quantity);
        renderDirectCheckout(productName, price, quantity);
    } else {
        // 2. 否則嘗試從 localStorage 獲取購物車資訊 (購物車結帳流程)
        renderCartCheckout();
    }

    // 3. 表單提交處理
    const orderForm = document.getElementById('direct-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
});

function renderDirectCheckout(name, price, qty) {
    const displayName = document.getElementById('display-product-name');
    const displayPriceQty = document.getElementById('display-price-qty');
    const displaySubtotal = document.getElementById('display-subtotal');
    const totalAmount = document.getElementById('total-amount-display');

    const subtotal = parseInt(price) * parseInt(qty);

    if (displayName) displayName.textContent = `商品名稱：${name}`;
    if (displayPriceQty) displayPriceQty.textContent = `單價：${price} 元 × 數量：${qty}`;
    if (displaySubtotal) displaySubtotal.textContent = `NT$ ${subtotal}`;
    if (totalAmount) totalAmount.textContent = `NT$ ${subtotal}`;
}

function renderCartCheckout() {
    const cartItems = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const displayName = document.getElementById('display-product-name');
    const displayPriceQty = document.getElementById('display-price-qty');
    const displaySubtotal = document.getElementById('display-subtotal');
    const totalAmount = document.getElementById('total-amount-display');

    if (cartItems.length === 0) {
        if (displayName) displayName.textContent = '購物車目前沒有商品';
        return;
    }

    let total = 0;
    let names = [];
    cartItems.forEach(item => {
        total += item.price * item.quantity;
        names.push(`${item.productName}(${item.quantity})`);
    });

    if (displayName) displayName.textContent = `商品名稱：${names.join(', ')}`;
    if (displayPriceQty) displayPriceQty.textContent = `多樣商品結帳`;
    if (displaySubtotal) displaySubtotal.textContent = `NT$ ${total}`;
    if (totalAmount) totalAmount.textContent = `NT$ ${total}`;
}

// 扣減庫存
function deductStock(productId, quantity) {
    const STOCK_KEY = 'pet_stock';
    const DEFAULT_STOCK = {
        '1': 150, '2': 120, '3': 100, '4': 45,
        '5': 60,  '6': 95,  '7': 50,  '8': 80, '9': 100
    };

    let stockData = {};
    try {
        stockData = JSON.parse(localStorage.getItem(STOCK_KEY) || '{}');
    } catch (e) { stockData = {}; }

    for (const id in DEFAULT_STOCK) {
        if (stockData[id] === undefined) stockData[id] = DEFAULT_STOCK[id];
    }

    const id = String(productId);
    const current = stockData[id] !== undefined ? stockData[id] : (DEFAULT_STOCK[id] || 0);
    stockData[id] = Math.max(0, current - quantity);
    localStorage.setItem(STOCK_KEY, JSON.stringify(stockData));
}

// 寫入訂單歷史
function saveOrderHistory(productId, productName, price, quantity) {
    const HISTORY_KEY = getHistoryKey();
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch (e) { history = []; }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const orderId = 'ORD-' + now.getFullYear() + '-' + String(Date.now()).slice(-6);

    history.unshift({
        id: orderId,
        date: dateStr,
        product: productName,
        quantity: quantity,
        amount: price * quantity,
        status: 'completed'
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function handleOrderSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('buyer_name').value;
    const phone = document.getElementById('buyer_phone').value;
    if (!name || !phone) {
        alert('請填寫完整的收件人資訊！');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const isDirectBuy = !!params.get('productId');

    if (isDirectBuy) {
        // 直接購買：扣減單一商品庫存
        const productId = params.get('productId');
        const productName = decodeURIComponent(params.get('productName') || '');
        const price = parseInt(params.get('price') || '0');
        const quantity = parseInt(params.get('quantity') || '1');

        deductStock(productId, quantity);
        saveOrderHistory(productId, productName, price, quantity);
    } else {
        // 購物車結帳：扣減所有商品庫存
        const cartItems = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
        cartItems.forEach(item => {
            deductStock(item.productId, item.quantity);
            saveOrderHistory(item.productId, item.productName, item.price, item.quantity);
        });
        localStorage.removeItem(getCartKey());
    }

    alert(`感謝您的訂購，${name}！\n訂單已成功送出，我們將盡快與您聯繫。`);
    window.location.href = 'history.html';
}
