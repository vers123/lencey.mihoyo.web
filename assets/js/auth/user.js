// 用户管理模块

// 密码加密
function encryptPassword(password) {
    const salt = generateUUID().substring(0, 8);
    const saltedPassword = password + salt;
    const encoded = btoa(saltedPassword);
    return encoded + '|' + salt;
}

// 密码验证
function verifyPassword(inputPassword, storedPassword) {
    const [encoded, salt] = storedPassword.split('|');
    const saltedPassword = inputPassword + salt;
    return btoa(saltedPassword) === encoded;
}

// 密码强度检查
function isPasswordStrong(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

// 检查用户是否已存在
async function isUserExists(email) {
    const users = await getUsers();
    return users.some(user => user.email === email);
}

// 根据邮箱获取用户
async function getUserByEmail(email) {
    const users = await getUsers();
    return users.find(user => user.email === email);
}

// 根据ID获取用户
async function getUserById(userId) {
    const users = await getUsers();
    return users.find(user => user.id === userId);
}

// 更新用户资料
async function updateUserProfile(nickname) {
    const userId = getCurrentUser();
    if (!userId) return false;

    try {
        const users = await getUsers();
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return { ...user, nickname };
            }
            return user;
        });
        await saveUsers(updatedUsers);
        return true;
    } catch (error) {
        console.error('更新用户资料失败:', error);
        return false;
    }
}

// 修改密保问题
async function changeSecurityQuestion(userId, securityQuestion, securityAnswer, confirmAnswer) {
    if (!userId) return { success: false, message: '请提供账户ID' };

    if (securityAnswer !== confirmAnswer) {
        return { success: false, message: '两次输入的答案不一致' };
    }

    try {
        const users = await getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        const updatedUsers = users.map(u => {
            if (u.id === userId) {
                return { 
                    ...u, 
                    securityQuestion, 
                    securityAnswer: encryptPassword(securityAnswer) 
                };
            }
            return u;
        });
        await saveUsers(updatedUsers);
        
        return { success: true, message: '密保问题修改成功' };
    } catch (error) {
        console.error('修改密保问题失败:', error);
        return { success: false, message: '修改密保问题失败，请重试' };
    }
}

// 登录历史管理
function recordLoginHistory() {
    const userId = getCurrentUser();
    if (!userId) return;

    try {
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '{}');
        
        if (!loginHistory[userId]) {
            loginHistory[userId] = [];
        }
        
        loginHistory[userId].unshift({
            timestamp: new Date().toISOString(),
            ip: '本地登录',
            userAgent: navigator.userAgent
        });
        
        if (loginHistory[userId].length > 20) {
            loginHistory[userId] = loginHistory[userId].slice(0, 20);
        }
        
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    } catch (error) {
        console.error('记录登录历史失败:', error);
    }
}

function getLoginHistory(userId) {
    try {
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '{}');
        return loginHistory[userId] || [];
    } catch (error) {
        console.error('获取登录历史失败:', error);
        return [];
    }
}

// 数据导入导出
async function exportUserData() {
    try {
        const users = await getUsers();
        const currentUser = getCurrentUser();
        
        const userData = {
            users: users,
            currentUser: currentUser,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `game-nav-user-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        alert('数据导出成功');
    } catch (error) {
        console.error('导出数据失败:', error);
        alert('数据导出失败，请重试');
    }
}

async function importUserData(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const userData = JSON.parse(e.target.result);
                
                if (!userData.users || !Array.isArray(userData.users)) {
                    throw new Error('无效的数据格式');
                }
                
                await saveUsers(userData.users);
                if (userData.currentUser) {
                    saveCurrentUser(userData.currentUser);
                }
                
                alert('数据导入成功，页面将刷新');
                window.location.reload();
            } catch (error) {
                console.error('解析数据失败:', error);
                alert('数据解析失败，请确保文件格式正确');
            }
        };
        reader.onerror = function() {
            alert('文件读取失败，请重试');
        };
        reader.readAsText(file);
    } catch (error) {
        console.error('导入数据失败:', error);
        alert('数据导入失败，请重试');
    }
}

// 导出函数
window.encryptPassword = encryptPassword;
window.verifyPassword = verifyPassword;
window.isPasswordStrong = isPasswordStrong;
window.isUserExists = isUserExists;
window.getUserByEmail = getUserByEmail;
window.getUserById = getUserById;
window.updateUserProfile = updateUserProfile;
window.changeSecurityQuestion = changeSecurityQuestion;
window.recordLoginHistory = recordLoginHistory;
window.getLoginHistory = getLoginHistory;
window.exportUserData = exportUserData;
window.importUserData = importUserData;