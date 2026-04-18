// 本地存储工具函数

// 生成唯一ID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 存储类型检测
let storageType = 'localStorage';
let db = null;

// 初始化存储
async function initStorage() {
    if ('indexedDB' in window) {
        try {
            db = await openIndexedDB();
            storageType = 'indexedDB';
        } catch (error) {
            console.warn('IndexedDB initialization failed, falling back to localStorage', error);
            storageType = 'localStorage';
        }
    }
}

// 打开IndexedDB
function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('gameNavDB', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'id' });
            }
        };
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// 存储用户数据
async function saveUsers(users) {
    if (storageType === 'indexedDB' && db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            
            // 清空现有数据
            store.clear();
            
            // 批量添加用户
            users.forEach(user => {
                store.add(user);
            });
            
            transaction.oncomplete = function() {
                resolve();
            };
            
            transaction.onerror = function(event) {
                reject(event.target.error);
            };
        });
    } else {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// 获取用户数据
async function getUsers() {
    if (storageType === 'indexedDB' && db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();
            
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            
            request.onerror = function(event) {
                reject(event.target.error);
                // 降级到localStorage
                resolve(JSON.parse(localStorage.getItem('users') || '[]'));
            };
        });
    } else {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }
}

// 存储当前登录用户
function saveCurrentUser(userId) {
    localStorage.setItem('currentUser', userId);
}

// 获取当前登录用户
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// 清除当前登录用户
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// 密码加密 - 使用更安全的方法
function encryptPassword(password) {
    // 添加盐值
    const salt = generateUUID().substring(0, 8);
    // 组合密码和盐值
    const saltedPassword = password + salt;
    // 使用btoa进行编码
    const encoded = btoa(saltedPassword);
    // 返回加密后的密码和盐值
    return encoded + '|' + salt;
}

// 密码验证
function verifyPassword(inputPassword, storedPassword) {
    // 提取盐值
    const [encoded, salt] = storedPassword.split('|');
    // 组合输入密码和盐值
    const saltedPassword = inputPassword + salt;
    // 加密并验证
    return btoa(saltedPassword) === encoded;
}

// 密码强度检查
function isPasswordStrong(password) {
    // 至少12个字符，包含大写字母、小写字母、数字和特殊符号
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
    
    // 跳转到账户页面
    window.location.href = '../account/index.html';
}

// 登录功能
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // 检查用户是否存在
    const user = await getUserByEmail(email);
    if (!user) {
        alert('账户不存在');
        return;
    }

    // 验证密码
    if (!verifyPassword(password, user.password)) {
        alert('密码错误');
        return;
    }

    // 保存登录状态
    saveCurrentUser(user.id);
    
    // 跳转到账户页面
    window.location.href = '../account/index.html';
}

// 忘记密码功能
async function handleForgotPassword() {
    const email = document.getElementById('email').value;
    const securityQuestion = document.getElementById('securityQuestion').value;
    const securityAnswer = document.getElementById('securityAnswer').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // 检查用户是否存在
    const user = await getUserByEmail(email);
    if (!user) {
        alert('账户不存在');
        return;
    }

    // 验证密保问题和答案
    if (user.securityQuestion !== securityQuestion || !verifyPassword(securityAnswer, user.securityAnswer)) {
        alert('密保问题或答案错误');
        return;
    }

    // 密码强度验证
    if (!isPasswordStrong(newPassword)) {
        alert('密码强度不足！需要12+字符，包含大写字母、小写字母、数字和特殊符号');
        return;
    }

    // 密码一致性检查
    if (newPassword !== confirmNewPassword) {
        alert('两次输入的密码不一致');
        return;
    }

    // 更新密码
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

// 加载用户信息
async function loadUserInfo() {
    const userId = getCurrentUser();
    if (!userId) return;

    const user = await getUserById(userId);
    if (!user) {
        clearCurrentUser();
        window.location.href = '../auth/login.html';
        return;
    }

    // 显示用户信息
    document.getElementById('userNickname').textContent = user.nickname;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userId').textContent = user.id;
    document.getElementById('userCreatedAt').textContent = new Date(user.createdAt).toLocaleString();
}

// 加载收藏列表
async function loadFavorites() {
    const userId = getCurrentUser();
    if (!userId) return;

    const user = await getUserById(userId);
    if (!user) return;

    const favoritesList = document.getElementById('favoritesList');
    
    if (user.favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="text-gray-500 dark:text-gray-400 text-center py-8">
                <span class="lang-zh">暂无收藏</span>
                <span class="lang-en hidden">No favorites yet</span>
            </div>
        `;
        return;
    }

    // 生成收藏列表
    const favoritesHTML = user.favorites.map(favorite => `
        <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth">
            <div>
                <h3 class="font-medium text-gray-800 dark:text-white">${favorite.gameName}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">${favorite.category}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">${new Date(favorite.addedAt).toLocaleString()}</p>
            </div>
            <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-smooth" 
                    onclick="removeFavorite('${favorite.gameId}')">
                <svg aria-hidden="true" class="icon w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        </div>
    `).join('');

    favoritesList.innerHTML = favoritesHTML;
}

// 移除收藏
async function removeFavorite(gameId) {
    const userId = getCurrentUser();
    if (!userId) return;

    const users = await getUsers();
    const updatedUsers = users.map(user => {
        if (user.id === userId) {
            return {
                ...user,
                favorites: user.favorites.filter(fav => fav.gameId !== gameId)
            };
        }
        return user;
    });
    await saveUsers(updatedUsers);
    await loadFavorites();
}

// 添加收藏
async function addFavorite(gameId, gameName, category) {
    const userId = getCurrentUser();
    if (!userId) {
        alert('请先登录');
        window.location.href = '../auth/login.html';
        return;
    }

    const users = await getUsers();
    const updatedUsers = users.map(user => {
        if (user.id === userId) {
            // 检查是否已经收藏
            const isAlreadyFavorited = user.favorites.some(fav => fav.gameId === gameId);
            if (isAlreadyFavorited) {
                alert('已经收藏过该游戏');
                return user;
            }

            return {
                ...user,
                favorites: [...user.favorites, {
                    gameId,
                    gameName,
                    category,
                    addedAt: new Date().toISOString()
                }]
            };
        }
        return user;
    });
    await saveUsers(updatedUsers);
    alert('收藏成功');
}

// 导出用户数据
async function exportUserData() {
    try {
        const users = await getUsers();
        const currentUser = getCurrentUser();
        
        // 过滤出当前用户的数据
        const userData = {
            users: users,
            currentUser: currentUser,
            exportDate: new Date().toISOString()
        };
        
        // 创建JSON文件
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // 创建下载链接
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `game-nav-user-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        // 清理
        URL.revokeObjectURL(url);
        
        alert('数据导出成功');
    } catch (error) {
        console.error('导出数据失败:', error);
        alert('数据导出失败，请重试');
    }
}

// 导入用户数据
async function importUserData(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;
        
        // 读取文件
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const userData = JSON.parse(e.target.result);
                
                // 验证数据格式
                if (!userData.users || !Array.isArray(userData.users)) {
                    throw new Error('无效的数据格式');
                }
                
                // 保存数据
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
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.loadUserInfo = loadUserInfo;
window.loadFavorites = loadFavorites;
window.removeFavorite = removeFavorite;
window.addFavorite = addFavorite;
window.exportUserData = exportUserData;
window.importUserData = importUserData;

// 初始化存储
initStorage();