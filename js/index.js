// ==========================================================================
// index.js — 首頁邏輯
// 包含：輪播圖、限時促銷倒數、Cookie 同意、前端搜尋跳轉
// ==========================================================================

// ==========================================================================
// 1. 廣告輪播圖 (Carousel) 邏輯
// ==========================================================================
const container     = document.getElementById('carousel-container');
const slides        = container ? container.children : [];
const dotsContainer = document.getElementById('carousel-dots');
let currentIndex    = 0;

if (container && slides.length > 0 && dotsContainer) {
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateCarousel() {
    if (!container || !dotsContainer) return;
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
    Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function moveSlide(direction) {
    if (slides.length === 0) return;
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    if (currentIndex >= slides.length) currentIndex = 0;
    updateCarousel();
}

// 每 5 秒自動輪播下一張
setInterval(() => {
    moveSlide(1);
}, 5000);

// ==========================================================================
// 2. 限時促銷倒數計時器 (Countdown) 邏輯
// ==========================================================================
function initializeCountdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1); // 預設倒數 24 小時

    function updateCountdown() {
        const now      = new Date();
        const distance = endDate - now;

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownEl = document.getElementById('countdown');
        if (!countdownEl) return;

        if (distance < 0) {
            clearInterval(countdownTimer);
            countdownEl.innerHTML = "促銷活動已結束！";
        } else {
            countdownEl.innerHTML = `
                <div class="countdown-item">${days}<span>天</span></div>
                <div class="countdown-item">${hours}<span>時</span></div>
                <div class="countdown-item">${minutes}<span>分</span></div>
                <div class="countdown-item">${seconds}<span>秒</span></div>
            `;
        }
    }

    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);
}

// ==========================================================================
// 3. Cookie 隱私權政策同意提示邏輯
// ==========================================================================
function checkCookieConsent() {
    const cookieEl = document.getElementById('cookieConsent');
    if (cookieEl && !localStorage.getItem('cookieConsent')) {
        cookieEl.style.display = 'flex';
    }
}

function acceptCookies() {
    const cookieEl = document.getElementById('cookieConsent');
    localStorage.setItem('cookieConsent', 'true');
    if (cookieEl) {
        cookieEl.style.display = 'none';
    }
}

// ==========================================================================
// 4. 純前端免資料庫搜尋跳轉邏輯
// ==========================================================================
const searchRouteMap = {
    // 乾糧分類
    "幼貓":       "yocat.html",
    "成貓":       "chencat.html",
    "老貓":       "oldcat.html",
    "乾糧":       "yocat.html",
    "飼料":       "yocat.html",

    // 罐頭分類
    "銀魚":       "greencan.html",
    "鰹魚拌銀魚": "greencan.html",
    "鯷魚":       "bluecan.html",
    "鰹魚小鯷魚": "bluecan.html",
    "木魚":       "redcan.html",
    "鰹魚木魚乾": "redcan.html",
    "罐頭":       "greencan.html",

    // 周邊分類
    "貓砂":   "sa.html",
    "貓碗":   "bowl.html",
    "貓窩":   "wo.html",
    "組員介紹": "team.html",
    "組員":   "team.html"
};

function frontendSearch(event) {
    event.preventDefault(); // 阻擋傳統表單重整網頁

    const inputEl = document.getElementById("search-keyword");
    if (!inputEl) {
        console.error("找不到 id='search-keyword' 的搜尋輸入框！");
        return;
    }

    const keyword = inputEl.value.trim().toLowerCase();
    if (keyword === "") return;

    let foundPage = null;

    for (let key in searchRouteMap) {
        const lowerKey = key.toLowerCase();
        if (keyword.includes(lowerKey) || lowerKey.includes(keyword)) {
            foundPage = searchRouteMap[key];
            break;
        }
    }

    if (foundPage) {
        window.location.href = foundPage;
    } else {
        alert(`🔍 找不到與「${inputEl.value}」相關的產品！\n\n提示：您可以嘗試搜尋 幼貓、成貓、銀魚、鯷魚、貓砂、貓窩。`);
    }
}

// ==========================================================================
// 5. 網頁載入完成後的初始化事件監聽 (DOM Ready)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeCountdown(); // 啟動促銷倒數
    checkCookieConsent();  // 檢查 Cookie 同意橫幅
});
