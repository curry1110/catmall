function updateNavbarLoginState() {
    const userJson = localStorage.getItem('pet_user_data');
    let currentUser = null;

    if (userJson) {
        try {
            currentUser = JSON.parse(userJson);
        } catch (e) {
            currentUser = null;
        }
    }

    const memberGuestZone = document.getElementById('member-guest-zone');
    if (memberGuestZone) {
        const welcomeMsg = memberGuestZone.querySelector('#welcome-msg');
        const loginLink = memberGuestZone.querySelector('#login-link');
        const registerLink = memberGuestZone.querySelector('#register-link');
        const logoutLink = memberGuestZone.querySelector('#logout-link');

        if (currentUser) {
            if (welcomeMsg) {
                welcomeMsg.textContent = '歡迎，' + currentUser.username;
                welcomeMsg.style.display = 'inline';
            }
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutLink) {
                logoutLink.style.display = 'inline';
                logoutLink.onclick = function(e) { e.preventDefault(); logout(); };
            }
        } else {
            if (welcomeMsg) welcomeMsg.style.display = 'none';
            if (loginLink) loginLink.style.display = 'inline';
            if (registerLink) registerLink.style.display = 'inline';
            if (logoutLink) logoutLink.style.display = 'none';
        }
    }

    const memberZones = document.querySelectorAll('.member-zone');
    memberZones.forEach(function(zone) {
        const loginLink = zone.querySelector('a[href="login.html"]');
        const registerLink = zone.querySelector('a[href="register.html"]');

        if (currentUser) {
            zone.querySelectorAll('.dynamic-auth').forEach(function(el) { el.remove(); });

            const welcomeSpan = document.createElement('span');
            welcomeSpan.className = 'dynamic-auth';
            welcomeSpan.style.cssText = 'color: #3fa34d; margin-right: 10px; font-weight: bold;';
            welcomeSpan.textContent = '歡迎，' + currentUser.username;

            const logoutBtn = document.createElement('a');
            logoutBtn.className = 'dynamic-auth';
            logoutBtn.href = '#';
            logoutBtn.style.cssText = 'color: #dc3545; cursor: pointer;';
            logoutBtn.textContent = '登出';
            logoutBtn.onclick = function(e) { e.preventDefault(); logout(); };

            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';

            zone.prepend(welcomeSpan);
            zone.appendChild(logoutBtn);
        }
    });
}

function logout() {
    localStorage.removeItem('pet_user');
    localStorage.removeItem('pet_user_data');
    window.location.replace('index.html');
}

function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.onsubmit = function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !email || !password) {
            alert('請填寫所有欄位');
            return;
        }

        let members = [];
        try {
            members = JSON.parse(localStorage.getItem('pet_members') || '[]');
        } catch(err) {
            members = [];
        }

        if (members.find(function(m) { return m.username === username; })) {
            alert('此帳號已被註冊，請換一個帳號名稱。');
            return;
        }

        members.push({ username: username, email: email, password: password });
        localStorage.setItem('pet_members', JSON.stringify(members));
        
        alert('註冊成功！請重新登入。');
        window.location.replace('login.html');
    };
}

function setupLoginForm() {
    const loginForm = document.querySelector('.login-form');
    if (!loginForm) return;

    loginForm.onsubmit = function(e) {
        e.preventDefault();

        const usernameInput = loginForm.querySelector('input[name="username"]');
        const passwordInput = loginForm.querySelector('input[name="password"]');

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert('請輸入帳號與密碼');
            return;
        }

        let members = [];
        try {
            members = JSON.parse(localStorage.getItem('pet_members') || '[]');
        } catch(err) {
            members = [];
        }

        const member = members.find(function(m) {
            return m.username === username && m.password === password;
        });

        if (member) {
            localStorage.setItem('pet_user', member.username);
            localStorage.setItem('pet_user_data', JSON.stringify({ username: member.username, email: member.email }));
            window.location.replace('index.html');
        } else {
            alert('帳號或密碼錯誤，請重新輸入。');
        }
    };
}

function refreshAuthState() {
    updateNavbarLoginState();
    if (typeof window.onAuthStateRefresh === 'function') {
        window.onAuthStateRefresh();
    }
}

window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        refreshAuthState();
    }
});

window.addEventListener('storage', function (e) {
    if (!e.key || e.key === 'pet_user' || e.key === 'pet_user_data') {
        refreshAuthState();
    }
});

updateNavbarLoginState();
setupRegisterForm();
setupLoginForm();
