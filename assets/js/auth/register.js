// 注册模块

// 注册功能
async function handleRegister() {
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const securityQuestion = document.getElementById('securityQuestion').value;
    const securityAnswer = document.getElementById('securityAnswer').value;

    // 密码强度验证
    if (!isPasswordStrong(password)) {
        alert('密码强度不足！需要12+字符，包含大写字母、小写字母、数字和特殊符号');
        return;
    }

    // 密码一致性检查
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }

    // 检查账户是否已存在
    if (await isUserExists(email)) {
        alert('该邮箱已注册');
        return;
    }

    // 创建新用户
    const newUser = {
        id: generateUUID(),
        email,
        nickname,
        password: encryptPassword(password),
        createdAt: new Date().toISOString(),
        securityQuestion,
        securityAnswer: encryptPassword(securityAnswer),
        favorites: []
    };

    // 保存用户数据
    const users = await getUsers();
    users.push(newUser);
    await saveUsers(users);
    saveCurrentUser(newUser.id);
    
    // 显示账户ID提示
    alert(`注册成功！\n\n您的账户ID是：${newUser.id}\n\n请务必保存此ID，用于后续的账户管理和密码重置。`);
    
    // 跳转到账户页面
    window.location.href = '../account/index.html';
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    if (!strengthBar || !strengthText) return;

    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 12.5;

    let strengthClass = '';
    let strengthMessage = '';

    if (strength < 25) {
        strengthClass = 'bg-red-500';
        strengthMessage = '<span class="lang-zh">弱</span><span class="lang-en hidden">Weak</span>';
    } else if (strength < 75) {
        strengthClass = 'bg-yellow-500';
        strengthMessage = '<span class="lang-zh">中等</span><span class="lang-en hidden">Medium</span>';
    } else {
        strengthClass = 'bg-green-500';
        strengthMessage = '<span class="lang-zh">强</span><span class="lang-en hidden">Strong</span>';
    }

    strengthBar.style.width = strength + '%';
    strengthBar.className = 'h-full transition-all duration-300 ' + strengthClass;
    strengthText.innerHTML = strengthMessage;
}

function initRegisterPage() {
    initPage();

    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function(e) {
            updatePasswordStrength(e.target.value);
        });
    }
}

// 导出函数
window.handleRegister = handleRegister;
window.initRegisterPage = initRegisterPage;