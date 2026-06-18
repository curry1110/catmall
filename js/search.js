const searchRouteMap = {
    "幼貓乾糧": "yocat.html",
    "成貓乾糧": "chencat.html",
    "老貓乾糧": "oldcat.html",
    "幼貓": "yocat.html",
    "成貓": "chencat.html",
    "老貓": "oldcat.html",
    "kittens": "yocat.html",
    "kitten": "yocat.html",
    "adult cat": "chencat.html",
    "senior cat": "oldcat.html",

    "鰹魚拌銀魚": "greencan.html",
    "鰹魚小鯷魚": "bluecan.html",
    "鰹魚木魚乾": "redcan.html",
    "銀魚罐頭": "greencan.html",
    "鯷魚罐頭": "bluecan.html",
    "木魚罐頭": "redcan.html",
    "銀魚": "greencan.html",
    "鯷魚": "bluecan.html",
    "木魚": "redcan.html",
    "green": "greencan.html",
    "blue": "bluecan.html",
    "red": "redcan.html",

    "乾糧": "product1.html",
    "飼料": "product1.html",
    "乾飼料": "product1.html",
    "貓糧": "product1.html",
    "罐頭": "product2.html",
    "罐罐": "product2.html",
    "濕食": "product2.html",
    "鰹魚": "product2.html",
    "wet food": "product2.html",
    "dry food": "product1.html",

    "貓砂": "sa.html",
    "砂": "sa.html",
    "litter": "sa.html",
    "貓碗": "bowl.html",
    "碗": "bowl.html",
    "bowl": "bowl.html",
    "貓窩": "wo.html",
    "窩": "wo.html",
    "bed": "wo.html",
    "house": "wo.html",
    "貓": "index.html",
    "cat": "index.html",
    "組員": "team.html",
    "團隊": "team.html",
    "team": "team.html",
    "介紹": "team.html",
    "首頁": "index.html",
    "home": "index.html",
    "購物車": "cart.html",
    "cart": "cart.html",
    "其他": "product3.html",
    "配件": "product3.html",
    "用品": "product3.html"
};

function frontendSearch(event) {
    if (event) event.preventDefault();
    const inputEl = document.getElementById("search-keyword");
    if (!inputEl) return;

    const keyword = inputEl.value.trim();
    const keywordLower = keyword.toLowerCase();
    if (!keyword) return;

    const sortedKeys = Object.keys(searchRouteMap).sort((a, b) => b.length - a.length);
    let foundPage = null;

    for (let key of sortedKeys) {
        if (keywordLower.includes(key.toLowerCase())) {
            foundPage = searchRouteMap[key];
            break;
        }
    }

    if (foundPage) {
        window.location.href = foundPage;
    } else {
        alert(`找不到與「${keyword}」相關的結果。\n您可以試試：幼貓、成貓、老貓、罐頭、貓砂、鰹魚、貓碗、貓窩。`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchForms = document.querySelectorAll('.search-box');
    searchForms.forEach(form => {
        form.onsubmit = frontendSearch;
    });
});
