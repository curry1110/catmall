// ==========================================================================
// yocat.js — 幼貓乾糧商品頁面邏輯
// ==========================================================================

// 數量加減功能
function changeQuantity(amount) {
    const quantityInput = document.getElementById("quantity");
    let current = parseInt(quantityInput.value);
    if (!isNaN(current) && current + amount >= 1) {
        quantityInput.value = current + amount;
    }
}

document.getElementById("decreaseBtn").addEventListener("click", () => changeQuantity(-1));
document.getElementById("increaseBtn").addEventListener("click", () => changeQuantity(1));

// 攔截加入購物車表單
document.getElementById('purchaseForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const product = {
        productId:   "9",
        productName: "幼貓乾糧",
        price:       "300",
        quantity:    document.getElementById('quantity').value
    };
    if (typeof addToCart === 'function') {
        addToCart(product);
    } else {
        const items = JSON.parse(localStorage.getItem('pet_cart') || '[]');
        items.push(product);
        localStorage.setItem('pet_cart', JSON.stringify(items));
        alert('已成功加入購物車！');
    }
});

// 直接購買（改為 URL 參數跳轉至 checkoutCart.html）
function buyNow() {
    const quantity = document.getElementById("quantity").value;
    const url = `checkoutCart.html?productId=9&productName=${encodeURIComponent("幼貓乾糧")}&price=300&quantity=${quantity}`;
    window.location.href = url;
}
