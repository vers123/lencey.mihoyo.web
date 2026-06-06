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
let storageInitialized = false;

// 初始化存储
async function initStorage() {
    if (storageInitialized) return;
    
    let localStorageAvailable = false;
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        localStorageAvailable = true;
    } catch (error) {
        console.warn('localStorage is not available:', error);
        localStorageAvailable = false;
    }
    
    let localStorageData = null;
    if (localStorageAvailable) {
        localStorageData = localStorage.getItem('users');
    }
    
    if ('indexedDB' in window) {
        try {
            db = await openIndexedDB();
            
            const indexedDBData = await new Promise((resolve) => {
                const transaction = db.transaction(['users'], 'readonly');
                const store = transaction.objectStore('users');
                const request = store.getAll();
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                request.onerror = function() {
                    resolve([]);
                };
            });
            
            if (localStorageAvailable && localStorageData && indexedDBData.length === 0) {
                try {
                    const users = JSON.parse(localStorageData);
                    const transaction = db.transaction(['users'], 'readwrite');
                    const store = transaction.objectStore('users');
                    store.clear();
                    users.forEach(user => store.add(user));
                    await new Promise((resolve) => {
                        transaction.oncomplete = resolve;
                        transaction.onerror = resolve;
                    });
                    console.log('数据从localStorage迁移到IndexedDB');
                } catch (error) {
                    console.warn('数据迁移失败:', error);
                }
            }
            
            storageType = 'indexedDB';
        } catch (error) {
            console.warn('IndexedDB initialization failed, falling back to localStorage', error);
            if (localStorageAvailable) {
                storageType = 'localStorage';
            } else {
                console.error('Both IndexedDB and localStorage are not available');
                storageType = 'none';
            }
        }
    } else {
        if (localStorageAvailable) {
            storageType = 'localStorage';
        } else {
            console.error('Both IndexedDB and localStorage are not available');
            storageType = 'none';
        }
    }
    
    storageInitialized = true;
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

// 确保存储初始化完成
async function ensureStorageInitialized() {
    if (!storageInitialized) {
        await initStorage();
    }
}

// 存储用户数据
async function saveUsers(users) {
    await ensureStorageInitialized();
    
    if (storageType === 'indexedDB' && db) {
        return new Promise((resolve) => {
            try {
                const transaction = db.transaction(['users'], 'readwrite');
                const store = transaction.objectStore('users');
                
                store.clear();
                
                users.forEach(user => {
                    store.add(user);
                });
                
                transaction.oncomplete = function() {
                    try {
                        localStorage.setItem('users', JSON.stringify(users));
                    } catch (error) {
                        console.warn('Error updating localStorage:', error);
                    }
                    resolve();
                };
                
                transaction.onerror = function(event) {
                    console.warn('IndexedDB error, using localStorage', event.target.error);
                    try {
                        localStorage.setItem('users', JSON.stringify(users));
                    } catch (error) {
                        console.warn('Error updating localStorage:', error);
                    }
                    resolve();
                };
            } catch (error) {
                console.warn('IndexedDB error, using localStorage', error);
                try {
                    localStorage.setItem('users', JSON.stringify(users));
                } catch (error) {
                    console.warn('Error updating localStorage:', error);
                }
                resolve();
            }
        });
    } else {
        try {
            localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.warn('Error updating localStorage:', error);
        }
        return Promise.resolve();
    }
}

// 获取用户数据
async function getUsers() {
    await ensureStorageInitialized();
    
    if (storageType === 'none') {
        console.warn('Storage is not available, returning empty array');
        return [];
    }
    
    let localStorageData = [];
    try {
        localStorageData = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
        console.warn('Error parsing localStorage data:', error);
        localStorageData = [];
    }
    
    if (storageType === 'indexedDB' && db) {
        return new Promise((resolve) => {
            try {
                const transaction = db.transaction(['users'], 'readonly');
                const store = transaction.objectStore('users');
                const request = store.getAll();
                
                request.onsuccess = function(event) {
                    try {
                        const result = event.target.result || [];
                        
                        if (result.length > 0) {
                            try {
                                localStorage.setItem('users', JSON.stringify(result));
                            } catch (error) {
                                console.warn('Error updating localStorage:', error);
                            }
                            resolve(result);
                        } else if (localStorageData.length > 0) {
                            try {
                                const transaction = db.transaction(['users'], 'readwrite');
                                const store = transaction.objectStore('users');
                                store.clear();
                                localStorageData.forEach(user => store.add(user));
                                transaction.oncomplete = function() {
                                    console.log('数据从localStorage迁移到IndexedDB');
                                };
                            } catch (error) {
                                console.warn('数据迁移失败:', error);
                            }
                            resolve(localStorageData);
                        } else {
                            resolve([]);
                        }
                    } catch (error) {
                        console.warn('Error processing IndexedDB result:', error);
                        resolve(localStorageData);
                    }
                };
                
                request.onerror = function(event) {
                    console.warn('IndexedDB error, using localStorage', event.target.error);
                    resolve(localStorageData);
                };
            } catch (error) {
                console.warn('Error accessing IndexedDB:', error);
                resolve(localStorageData);
            }
        });
    } else {
        return localStorageData;
    }
}

// 当前用户管理
function saveCurrentUser(userId) {
    localStorage.setItem('currentUser', userId);
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// 导出函数
window.generateUUID = generateUUID;
window.initStorage = initStorage;
window.saveUsers = saveUsers;
window.getUsers = getUsers;
window.saveCurrentUser = saveCurrentUser;
window.getCurrentUser = getCurrentUser;
window.clearCurrentUser = clearCurrentUser;

// 初始化存储
initStorage();