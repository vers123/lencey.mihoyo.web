// 登录模块

// 登录功能
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const user = await getUserByEmail(email);
    if (!user) {
        alert('账户不存在');
        return;
    }

    if (!verifyPassword(password, user.password)) {
        alert('密码错误');
        return;
    }

    saveCurrentUser(user.id);
    recordLoginHistory();
    
    window.location.href = '../account/index.html';
}

// 忘记密码功能
async function handleForgotPassword() {
    const email = document.getElementById('email').value;
    const securityQuestion = document.getElementById('securityQuestion').value;
    const securityAnswer = document.getElementById('securityAnswer').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    const user = await getUserByEmail(email);
    if (!user) {
        alert('账户不存在');
        return;
    }

    if (user.securityQuestion !== securityQuestion || !verifyPassword(securityAnswer, user.securityAnswer)) {
        alert('密保问题或答案错误');
        return;
    }

    if (!isPasswordStrong(newPassword)) {
        alert('密码强度不足！需要12+字符，包含大写字母、小写字母、数字和特殊符号');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert('两次输入的密码不一致');
        return;
    }

    const users = await getUsers();
    const updatedUsers = users.map(u => {
        if (u.email === email) {
            return { ...u, password: encryptPassword(newPassword) };
        }
        return u;
    });
    await saveUsers(updatedUsers);
    
    alert('密码重置成功，请登录');
    window.location.href = 'login.html';
}

// 登出功能
function logout() {
    clearCurrentUser();
    window.location.href = '../auth/login.html';
}

// 检查登录状态
function checkLoginStatus() {
    return getCurrentUser() !== null;
}

// 登录页面初始化
function initLoginPage() {
    initPage();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// 忘记密码页面初始化
function initForgotPasswordPage() {
    initPage();

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
}

// 修改密码
async function changePassword(currentPassword, newPassword, confirmPassword, userId = null, securityAnswer = null, securityQuestion = null) {
    const currentUserId = userId || getCurrentUser();
    if (!currentUserId) return { success: false, message: '用户未登录' };

    if (!isPasswordStrong(newPassword)) {
        return { success: false, message: '密码强度不足！需要12+字符，包含大写字母、小写字母、数字和特殊符号' };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: '两次输入的密码不一致' };
    }

    try {
        const users = await getUsers();
        const user = users.find(u => u.id === currentUserId);
        
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        let isValid = false;
        if (currentPassword) {
            isValid = verifyPassword(currentPassword, user.password);
        } else if (securityAnswer && securityQuestion) {
            isValid = user.securityQuestion === securityQuestion && verifyPassword(securityAnswer, user.securityAnswer);
        }

        if (!isValid) {
            return { success: false, message: '验证失败，请检查输入' };
        }

        const updatedUsers = users.map(u => {
            if (u.id === currentUserId) {
                return { ...u, password: encryptPassword(newPassword) };
            }
            return u;
        });
        await saveUsers(updatedUsers);
        
        return { success: true, message: '密码修改成功' };
    } catch (error) {
        console.error('修改密码失败:', error);
        return { success: false, message: '修改密码失败，请重试' };
    }
}

// 导出函数
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.initLoginPage = initLoginPage;
window.initForgotPasswordPage = initForgotPasswordPage;
window.changePassword = changePassword;