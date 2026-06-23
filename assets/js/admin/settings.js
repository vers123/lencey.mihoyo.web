// 系统设置模块

// HTML转义函数
function escapeHtml(text) {
    return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 默认设置
const defaultSettings = {
    site: {
        name: 'Vers123 游戏导航',
        nameEn: 'Vers123 Game Navigation',
        description: '专注于游戏资源整合的导航网站',
        descriptionEn: 'A game navigation website focused on integrating game resources',
        keywords: '游戏导航,米哈游,原神,崩坏3,星穹铁道,Minecraft,CS2',
        keywordsEn: 'game navigation,mihoyo,genshin impact,honkai,star rail,minecraft,cs2',
        author: 'Vers123',
        email: 'contact@vers123.com'
    },
    interface: {
        defaultTheme: 'light', // light, dark, system
        defaultLanguage: 'zh'
    },
    categories: {
        mihoyo: { enabled: true, order: 1 },
        other: { enabled: true, order: 2 }
    },
    version: '3.0.0'
};

// 加载设置
function loadSettings() {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
        try {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.error('加载设置失败:', e);
        }
    }
    return { ...defaultSettings };
}

// 保存设置
function saveSettings(settings) {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    return true;
}

// 获取系统信息
async function getSystemInfo() {
    const users = await getUsers();
    const games = getAllGames();
    
    return {
        version: defaultSettings.version,
        totalUsers: users.length,
        totalGames: games.length,
        totalFavorites: users.reduce((sum, u) => sum + (u.favorites ? u.favorites.length : 0), 0),
        storageUsed: JSON.stringify(localStorage).length,
        lastBackup: localStorage.getItem('lastBackupTime') || null
    };
}

// 清除所有用户数据
async function clearAllUsers() {
    if (!confirm('确定要清除所有用户数据吗？此操作不可恢复！')) {
        return false;
    }
    localStorage.setItem('users', JSON.stringify([]));
    return true;
}

// 清除所有收藏
async function clearAllFavorites() {
    if (!confirm('确定要清除所有用户的收藏吗？此操作不可恢复！')) {
        return false;
    }
    
    const users = await getUsers();
    users.forEach(user => {
        user.favorites = [];
    });
    await saveUsers(users);
    return true;
}

// 导出配置
function exportConfig() {
    const settings = loadSettings();
    const users = localStorage.getItem('users');
    const config = {
        exportDate: new Date().toISOString(),
        settings: settings,
        users: users ? JSON.parse(users) : []
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vers123-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    localStorage.setItem('lastBackupTime', new Date().toISOString());
    return true;
}

// 导入配置
async function importConfig(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                if (config.settings) {
                    saveSettings(config.settings);
                }
                if (config.users) {
                    localStorage.setItem('users', JSON.stringify(config.users));
                }
                
                resolve(true);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// 渲染系统设置表单
function renderSettingsForm(settings) {
    return `
        <!-- 站点信息 -->
        <div class="bg-light-card dark:bg-dark-card rounded-xl shadow-md p-6 mb-6 transition-smooth">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                <span class="lang-zh">站点信息</span>
                <span class="lang-en hidden">Site Information</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">站点名称</span>
                        <span class="lang-en hidden">Site Name (ZH)</span>
                    </label>
                    <input type="text" id="siteName" value="${escapeHtml(settings.site.name)}"
                           class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">站点名称（英文）</span>
                        <span class="lang-en hidden">Site Name (EN)</span>
                    </label>
                    <input type="text" id="siteNameEn" value="${escapeHtml(settings.site.nameEn)}"
                           class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">站点描述</span>
                        <span class="lang-en hidden">Description (ZH)</span>
                    </label>
                    <input type="text" id="siteDescription" value="${escapeHtml(settings.site.description)}"
                           class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">站点描述（英文）</span>
                        <span class="lang-en hidden">Description (EN)</span>
                    </label>
                    <input type="text" id="siteDescriptionEn" value="${escapeHtml(settings.site.descriptionEn)}"
                           class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">SEO 关键词</span>
                        <span class="lang-en hidden">SEO Keywords</span>
                    </label>
                    <input type="text" id="siteKeywords" value="${escapeHtml(settings.site.keywords)}"
                           class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
            </div>
        </div>

        <!-- 界面偏好 -->
        <div class="bg-light-card dark:bg-dark-card rounded-xl shadow-md p-6 mb-6 transition-smooth">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                <span class="lang-zh">界面偏好</span>
                <span class="lang-en hidden">Interface Preferences</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">默认主题</span>
                        <span class="lang-en hidden">Default Theme</span>
                    </label>
                    <select id="defaultTheme" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="light" ${settings.interface.defaultTheme === 'light' ? 'selected' : ''}>
                            <span class="lang-zh">浅色</span><span class="lang-en hidden">Light</span>
                        </option>
                        <option value="dark" ${settings.interface.defaultTheme === 'dark' ? 'selected' : ''}>
                            <span class="lang-zh">深色</span><span class="lang-en hidden">Dark</span>
                        </option>
                        <option value="system" ${settings.interface.defaultTheme === 'system' ? 'selected' : ''}>
                            <span class="lang-zh">跟随系统</span><span class="lang-en hidden">System</span>
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span class="lang-zh">默认语言</span>
                        <span class="lang-en hidden">Default Language</span>
                    </label>
                    <select id="defaultLanguage" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-light dark:bg-dark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="zh" ${settings.interface.defaultLanguage === 'zh' ? 'selected' : ''}>中文</option>
                        <option value="en" ${settings.interface.defaultLanguage === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 游戏分类 -->
        <div class="bg-light-card dark:bg-dark-card rounded-xl shadow-md p-6 mb-6 transition-smooth">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                <span class="lang-zh">游戏分类</span>
                <span class="lang-en hidden">Game Categories</span>
            </h3>
            <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                        <span class="font-medium text-gray-800 dark:text-white">${escapeHtml(settings.categories.mihoyo.name || '米哈游')}</span>
                        <span class="text-sm text-gray-500 ml-2">ID: mihoyo</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="categoryMihoyo" class="sr-only peer" ${settings.categories.mihoyo.enabled ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                        <span class="font-medium text-gray-800 dark:text-white">${escapeHtml(settings.categories.other.name || '其他游戏')}</span>
                        <span class="text-sm text-gray-500 ml-2">ID: other</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="categoryOther" class="sr-only peer" ${settings.categories.other.enabled ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- 数据管理 -->
        <div class="bg-light-card dark:bg-dark-card rounded-xl shadow-md p-6 mb-6 transition-smooth">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                <span class="lang-zh">数据管理</span>
                <span class="lang-en hidden">Data Management</span>
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button id="clearFavoritesBtn" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-smooth text-sm">
                    <span class="lang-zh">清除所有收藏</span>
                    <span class="lang-en hidden">Clear All Favorites</span>
                </button>
                <button id="clearUsersBtn" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-smooth text-sm">
                    <span class="lang-zh">清除所有用户</span>
                    <span class="lang-en hidden">Clear All Users</span>
                </button>
                <button id="exportConfigBtn" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-smooth text-sm">
                    <span class="lang-zh">导出配置</span>
                    <span class="lang-en hidden">Export Config</span>
                </button>
                <label class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-smooth text-sm text-center cursor-pointer">
                    <span class="lang-zh">导入配置</span>
                    <span class="lang-en hidden">Import Config</span>
                    <input type="file" id="importConfigInput" accept=".json" class="hidden">
                </label>
            </div>
        </div>

        <!-- 系统信息 -->
        <div class="bg-light-card dark:bg-dark-card rounded-xl shadow-md p-6 transition-smooth">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                <span class="lang-zh">系统信息</span>
                <span class="lang-en hidden">System Information</span>
            </h3>
            <div id="systemInfo" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- 动态加载 -->
            </div>
        </div>

        <!-- 保存按钮 -->
        <div class="mt-6 flex justify-end">
            <button id="saveSettingsBtn" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth">
                <span class="lang-zh">保存设置</span>
                <span class="lang-en hidden">Save Settings</span>
            </button>
        </div>
    `;
}

// 收集表单数据
function collectFormData() {
    return {
        site: {
            name: document.getElementById('siteName').value,
            nameEn: document.getElementById('siteNameEn').value,
            description: document.getElementById('siteDescription').value,
            descriptionEn: document.getElementById('siteDescriptionEn').value,
            keywords: document.getElementById('siteKeywords').value,
            keywordsEn: document.getElementById('siteKeywords').value,
            author: 'Vers123',
            email: 'contact@vers123.com'
        },
        interface: {
            defaultTheme: document.getElementById('defaultTheme').value,
            defaultLanguage: document.getElementById('defaultLanguage').value
        },
        categories: {
            mihoyo: { enabled: document.getElementById('categoryMihoyo').checked, order: 1 },
            other: { enabled: document.getElementById('categoryOther').checked, order: 2 }
        }
    };
}

// 初始化设置页面
async function initSettingsPage() {
    const settings = loadSettings();
    const settingsContent = document.getElementById('settingsContent');
    if (!settingsContent) return;
    
    settingsContent.innerHTML = renderSettingsForm(settings);
    
    // 加载系统信息
    const sysInfo = await getSystemInfo();
    const sysInfoEl = document.getElementById('systemInfo');
    if (sysInfoEl) {
        sysInfoEl.innerHTML = `
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-sm text-gray-500"><span class="lang-zh">版本</span><span class="lang-en hidden">Version</span></p>
                <p class="font-medium text-gray-800 dark:text-white">v${sysInfo.version}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-sm text-gray-500"><span class="lang-zh">用户总数</span><span class="lang-en hidden">Total Users</span></p>
                <p class="font-medium text-gray-800 dark:text-white">${sysInfo.totalUsers}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-sm text-gray-500"><span class="lang-zh">游戏总数</span><span class="lang-en hidden">Total Games</span></p>
                <p class="font-medium text-gray-800 dark:text-white">${sysInfo.totalGames}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-sm text-gray-500"><span class="lang-zh">收藏总数</span><span class="lang-en hidden">Total Favorites</span></p>
                <p class="font-medium text-gray-800 dark:text-white">${sysInfo.totalFavorites}</p>
            </div>
        `;
    }
    
    // 绑定保存按钮事件
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const newSettings = collectFormData();
            newSettings.version = defaultSettings.version;
            saveSettings(newSettings);
            alert('设置已保存 / Settings saved');
            location.reload();
        });
    }
    
    // 绑定数据管理按钮事件
    const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', async function() {
            if (await clearAllFavorites()) {
                alert('所有收藏已清除 / All favorites cleared');
                location.reload();
            }
        });
    }
    
    const clearUsersBtn = document.getElementById('clearUsersBtn');
    if (clearUsersBtn) {
        clearUsersBtn.addEventListener('click', async function() {
            if (await clearAllUsers()) {
                alert('所有用户已清除 / All users cleared');
                location.reload();
            }
        });
    }
    
    const exportConfigBtn = document.getElementById('exportConfigBtn');
    if (exportConfigBtn) {
        exportConfigBtn.addEventListener('click', function() {
            if (exportConfig()) {
                alert('配置已导出 / Config exported');
            }
        });
    }
    
    const importConfigInput = document.getElementById('importConfigInput');
    if (importConfigInput) {
        importConfigInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                await importConfig(file);
                alert('配置已导入 / Config imported');
                location.reload();
            } catch (err) {
                alert('导入失败: ' + err.message);
            }
        });
    }
}

// 导出函数
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.getSystemInfo = getSystemInfo;
window.clearAllUsers = clearAllUsers;
window.clearAllFavorites = clearAllFavorites;
window.exportConfig = exportConfig;
window.importConfig = importConfig;
window.initSettingsPage = initSettingsPage;
window.renderSettingsForm = renderSettingsForm;
window.collectFormData = collectFormData;