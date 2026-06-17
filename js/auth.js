// ==========================================================================
// 前端身份驗證模擬 (auth.js)
// ==========================================================================

// ==========================================================================
// 1. 全站登入狀態檢查與導覽列更新
// ==========================================================================
function updateNavbarLoginState() {
    const user = localStorage.getItem('pet_user');
    
    // 處理首頁風格的導覽列 (#member-guest-zone)
    const memberGuestZone = document.getElementById('member-guest-zone');
    if (memberGuestZone) {
        const welcomeMsg = memberGuestZone.querySelector('#welcome-msg');
        const loginLink = memberGuestZone.querySelector('#login-link');
        const registerLink = memberGuestZone.querySelector('#register-link');
        const logoutLink = memberGuestZone.querySelector('#logout-link');
        
        if (user) {
            if (welcomeMsg) {
                welcomeMsg.textContent = `歡迎，${user}`;
                welcomeMsg.style.display = 'inline';
            }
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutLink) {
                logoutLink.style.display = 'inline';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        }
    }
    
    // 處理商品詳情頁風格的導覽列 (.member-zone)
    const memberZones = document.querySelectorAll('.member-zone');
    memberZones.forEach(zone => {
        const loginLink = zone.querySelector('a[href="login.html"]');
        const registerLink = zone.querySelector('a[href="register.html"]');
        
        if (user) {
            // 建立歡迎訊息和登出按鈕
            const welcomeSpan = document.createElement('span');
            welcomeSpan.style.cssText = 'color: #3fa34d; margin-right: 5px; font-weight: 700; border-right: 1px solid #eee; padding-right: 12px; font-size: 0.95rem;';
            welcomeSpan.textContent = `歡迎，${user}`;
            
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.style.cssText = 'margin-left: 8px; cursor: pointer; color: #dc3545;';
            logoutBtn.textContent = '登出';
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
            
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            
            zone.insertBefore(welcomeSpan, loginLink);
            zone.appendChild(logoutBtn);
        }
    });
}

function logout() {
    localStorage.removeItem('pet_user');
    // 登出時不需要清除購物車或評論，因為這些現在是按使用者儲存的
    // 下次登入不同帳號時，會自動載入該帳號的資料
    window.location.href = 'index.html';
}

// ==========================================================================
// 2. 處理註冊表單
// ==========================================================================
function setupRegisterForm() {
    const registerForm = document.querySelector('form[action="register_process.jsp"]');
    if (registerForm) {
        registerForm.action = "#"; // 移除後端跳轉
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            alert(`✅ 註冊成功！歡迎加入，${username}。\n(此為前端模擬，資料未儲存)`);
            window.location.href = 'index.html';
        });
    }
}

// ==========================================================================
// 3. 處理登入表單
// ==========================================================================
function setupLoginForm() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = loginForm.querySelector('input[name="username"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');
            
            const username = usernameInput.value;
            const password = passwordInput.value;

            // 預設測試帳號檢查
            if (username === 'test' && password === 'test123') {
                alert(`👋 測試帳號登入成功！歡迎回來，${username}。`);
                localStorage.setItem('pet_user', username);
                window.location.href = 'index.html';
            } else if (username && password) {
                // 一般模擬登入
                alert(`👋 登入成功！歡迎回來，${username}。`);
                localStorage.setItem('pet_user', username);
                window.location.href = 'index.html';
            } else {
                alert('請輸入帳號與密碼');
            }
        });
    }
}

// ==========================================================================
// 4. DOM 載入完成後的初始化
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarLoginState();  // 更新導覽列登入狀態
    setupRegisterForm();       // 設置註冊表單
    setupLoginForm();          // 設置登入表單
});
