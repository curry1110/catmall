// ==========================================================================
// 全站搜尋邏輯 (search.js)
// ==========================================================================
const searchRouteMap = {
    "幼貓": "yocat.html", "成貓": "chencat.html", "老貓": "oldcat.html",
    "乾糧": "product1.html", "飼料": "product1.html",
    "銀魚": "greencan.html", "鯷魚": "bluecan.html", "木魚": "redcan.html",
    "罐頭": "product2.html", "罐罐": "product2.html",
    "貓砂": "sa.html", "貓碗": "bowl.html", "貓窩": "wo.html",
    "組員": "team.html", "團隊": "team.html", "介紹": "team.html"
};

function frontendSearch(event) {
    if (event) event.preventDefault();
    const inputEl = document.getElementById("search-keyword");
    if (!inputEl) return;
    const keyword = inputEl.value.trim().toLowerCase();
    if (!keyword) return;

    let foundPage = null;
    for (let key in searchRouteMap) {
        if (keyword.includes(key) || key.includes(keyword)) {
            foundPage = searchRouteMap[key];
            break;
        }
    }

    if (foundPage) {
        window.location.href = foundPage;
    } else {
        alert(`🔍 找不到與「${keyword}」相關的結果。\n您可以試試：幼貓、成貓、罐頭、貓砂。`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 確保所有頁面的搜尋表單都綁定事件
    const searchForm = document.querySelector('.search-box');
    if (searchForm) {
        searchForm.onsubmit = frontendSearch;
    }
});
