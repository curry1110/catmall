
const DEFAULT_STOCK = {
    '1': 150, '2': 120, '3': 100, '4': 45, '5': 60, '6': 95, '7': 50, '8': 80, '9': 100
};

const DB = {
    STOCK_KEY: 'pet_stock',
    REVIEW_KEY: 'pet_reviews',
    

    getCurrentUser() {
        const userJson = localStorage.getItem('pet_user_data');
        if (!userJson) return null;
        try { return JSON.parse(userJson); } catch (e) { return null; }
    },


    getCartKey() {
        const user = this.getCurrentUser();
        return user ? `pet_cart_${user.username}` : 'pet_cart_guest';
    },

    getCart() {
        const items = localStorage.getItem(this.getCartKey());
        if (!items) return [];
        try { return JSON.parse(items); } catch (e) { return []; }
    },
    
    saveCart(items) { 
        localStorage.setItem(this.getCartKey(), JSON.stringify(items)); 
    },

    getStock() {
        const stored = localStorage.getItem(this.STOCK_KEY);
        if (!stored) {
            localStorage.setItem(this.STOCK_KEY, JSON.stringify(DEFAULT_STOCK));
            return { ...DEFAULT_STOCK };
        }
        try { return JSON.parse(stored); } catch (e) { return { ...DEFAULT_STOCK }; }
    },

    getProductStock(productId) {
        const stock = this.getStock();
        return stock[String(productId)] || 0;
    },

    deductStock(productId, quantity) {
        const stock = this.getStock();
        const id = String(productId);
        if ((stock[id] || 0) < quantity) return false;
        stock[id] -= quantity;
        localStorage.setItem(this.STOCK_KEY, JSON.stringify(stock));
        return true;
    },

    getReviews(productId) {
        const reviews = localStorage.getItem(this.REVIEW_KEY);
        if (!reviews) return [];
        try {
            const all = JSON.parse(reviews);
            return productId ? all.filter(r => String(r.productId) === String(productId)) : all;
        } catch (e) { return []; }
    },

    saveReview(review) {
        const all = JSON.parse(localStorage.getItem(this.REVIEW_KEY) || '[]');
        const user = this.getCurrentUser();
        
        all.unshift({
            ...review,
            user: user ? user.username : '訪客', 
            date: new Date().toLocaleDateString('zh-TW'),
            id: Date.now()
        });
        localStorage.setItem(this.REVIEW_KEY, JSON.stringify(all));
    }
};

function refreshStockDisplay(productId) {
    const stock = DB.getProductStock(productId);
    const el = document.getElementById('stock-quantity') || document.getElementById('maxStock');
    if (el) el.textContent = stock;
}

function renderReviews(productId) {
    const container = document.getElementById('commentsList');
    if (!container) return;
    const reviews = DB.getReviews(productId);
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">目前尚無評論，快來分享您的使用心得吧！</p>';
        return;
    }

    container.innerHTML = reviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-username">${r.userName} <small style="color:#999; font-weight:normal;">(${r.user || '訪客'})</small></span>
                <span class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
            </div>
            <p class="review-message">${r.content}</p>
            <div class="review-date">${r.date}</div>
        </div>
    `).join('');
}

function changeQuantity(amount) {
    const input = document.getElementById("quantity");
    if (!input) return;
    let val = (parseInt(input.value) || 1) + amount;
    if (val >= 1) input.value = val;
}

function buyNow() {
    const purchaseForm = document.getElementById("purchaseForm");
    if (!purchaseForm) return;
    
    const productId = purchaseForm.querySelector('input[name="productId"]').value;
    const qty = Number(document.getElementById("quantity").value);
    const name = purchaseForm.querySelector('input[name="productName"]').value;
    const price = Number(purchaseForm.querySelector('input[name="price"]').value);

    if (qty > DB.getProductStock(productId)) {
        alert("⚠️ 庫存不足！");
        return;
    }

    const cart = DB.getCart();
    const exist = cart.find(i => String(i.productId) === String(productId));
    if (exist) exist.quantity += qty;
    else cart.push({ productId, productName: name, price, quantity: qty });
    
    DB.saveCart(cart);
    window.location.href = 'checkoutCart.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const purchaseForm = document.getElementById("purchaseForm");
    const commentForm = document.getElementById("commentForm");
    const productId = purchaseForm?.querySelector('input[name="productId"]')?.value;

    if (productId) {
        refreshStockDisplay(productId);
        renderReviews(productId);
    }

    document.getElementById("decreaseBtn")?.addEventListener('click', () => changeQuantity(-1));
    document.getElementById("increaseBtn")?.addEventListener('click', () => changeQuantity(1));

    if (purchaseForm) {
        purchaseForm.onsubmit = (e) => {
            e.preventDefault();
            const qty = Number(document.getElementById("quantity").value);
            const name = purchaseForm.querySelector('input[name="productName"]').value;
            const price = Number(purchaseForm.querySelector('input[name="price"]').value);
            
            if (qty > DB.getProductStock(productId)) {
                alert("⚠️ 庫存不足！");
                return;
            }

            const cart = DB.getCart();
            const exist = cart.find(i => String(i.productId) === String(productId));
            if (exist) exist.quantity += qty;
            else cart.push({ productId, productName: name, price, quantity: qty });
            
            DB.saveCart(cart);
            alert(`🛒 已將 ${qty} 件商品加入購物車！`);
        };
    }

    if (commentForm) {
     
        const user = DB.getCurrentUser();
        const reviewerNameInput = document.getElementById("reviewerName");
        if (user && reviewerNameInput) {
            reviewerNameInput.value = user.username;
            reviewerNameInput.readOnly = true; 
        }

        commentForm.onsubmit = (e) => {
            e.preventDefault();
            
            // 檢查是否已登入
            if (!user) {
                alert("🔒 請先登入會員再發表評論！");
                window.location.href = 'login.html';
                return;
            }

            const userName = document.getElementById("reviewerName").value;
            const rating = parseInt(document.getElementById("reviewRating").value);
            const content = document.getElementById("reviewContent").value;
            const productName = purchaseForm?.querySelector('input[name="productName"]')?.value || "商品";

            if (!userName || !content) {
                alert("請填寫姓名與評論內容！");
                return;
            }

            DB.saveReview({ productId, productName, userName, rating, content });
            alert("✅ 評論發表成功！");
            commentForm.reset();
            if (user && reviewerNameInput) {
                reviewerNameInput.value = user.username;
                reviewerNameInput.readOnly = true;
            }
            renderReviews(productId);
        };
    }
});
