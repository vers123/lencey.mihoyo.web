// 管理员登录模块

function handleAdminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('用户名或密码错误');
    }
}

function initAdminLoginPage() {
    initPage();
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (!adminLoginForm) return;

    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAdminLogin();
    });
}

window.handleAdminLogin = handleAdminLogin;
window.initAdminLoginPage = initAdminLoginPage;
