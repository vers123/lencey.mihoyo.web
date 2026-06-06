// 管理员控制台模块

// 加载用户数据
async function loadUsersData() {
    try {
        const users = await getUsers();
        
        document.getElementById('totalUsers').textContent = users.length;
        
        const today = new Date().toDateString();
        const todayRegCount = users.filter(user => new Date(user.createdAt).toDateString() === today).length;
        document.getElementById('todayRegistrations').textContent = todayRegCount;
        
        const totalFavorites = users.reduce((sum, user) => sum + (user.favorites ? user.favorites.length : 0), 0);
        document.getElementById('totalFavorites').textContent = totalFavorites;
        
        renderUsersTable(users);
    } catch (error) {
        console.error('加载用户数据失败:', error);
        alert('加载用户数据失败');
    }
}

// 渲染用户表格
function renderUsersTable(users) {
    const tableBody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400">
                    <span class="lang-zh">暂无用户数据</span>
                    <span class="lang-en hidden">No user data</span>
                </td>
            </tr>
        `;
        return;
    }
    
    const usersHTML = users.map(user => `
        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth">
            <td class="py-3 px-4 text-gray-800 dark:text-white">${user.id.substring(0, 8)}...</td>
            <td class="py-3 px-4 text-gray-800 dark:text-white">${user.nickname}</td>
            <td class="py-3 px-4 text-gray-800 dark:text-white">${user.email}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">${new Date(user.createdAt).toLocaleString()}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">${user.favorites ? user.favorites.length : 0}</td>
            <td class="py-3 px-4">
                <div class="flex space-x-2">
                    <button type="button" class="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-smooth text-sm" data-action="view-user" data-user-id="${user.id}">
                        <span class="lang-zh">查看</span>
                        <span class="lang-en hidden">View</span>
                    </button>
                    <button type="button" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-smooth text-sm" data-action="delete-user" data-user-id="${user.id}">
                        <span class="lang-zh">删除</span>
                        <span class="lang-en hidden">Delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = usersHTML;
}

// 搜索用户
async function searchUsers(keyword) {
    const users = await getUsers();
    const filteredUsers = users.filter(user => 
        user.nickname.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase())
    );
    renderUsersTable(filteredUsers);
}

// 查看用户详情
async function viewUserDetails(userId) {
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
        alert('用户不存在');
        return;
    }
    
    const userDetails = `
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">用户详情</h3>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>昵称:</strong> ${user.nickname}</p>
            <p><strong>邮箱:</strong> ${user.email}</p>
            <p><strong>创建时间:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
            <p><strong>收藏数量:</strong> ${user.favorites ? user.favorites.length : 0}</p>
            ${user.favorites && user.favorites.length > 0 ? 
                `<p><strong>收藏的游戏:</strong></p><ul>${user.favorites.map(fav => `<li>${fav.gameName}</li>`).join('')}</ul>` : 
                ''
            }
        </div>
    `;
    
    alert(userDetails);
}

// 删除用户
async function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？')) {
        return;
    }
    
    try {
        const users = await getUsers();
        const updatedUsers = users.filter(u => u.id !== userId);
        await saveUsers(updatedUsers);
        
        loadUsersData();
        alert('用户删除成功');
    } catch (error) {
        console.error('删除用户失败:', error);
        alert('删除用户失败');
    }
}

// 导出所有用户
async function exportAllUsers() {
    try {
        const users = await getUsers();
        const exportData = {
            users: users,
            exportDate: new Date().toISOString(),
            totalUsers: users.length
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `admin-export-users-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        alert('用户数据导出成功');
    } catch (error) {
        console.error('导出用户数据失败:', error);
        alert('导出用户数据失败');
    }
}

// 管理员登出
function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

function initAdminDashboard() {
    initPage();

    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    loadUsersData();

    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchUsers(this.value);
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logoutAdmin();
        });
    }

    const exportAllUsersButton = document.getElementById('exportAllUsersButton');
    if (exportAllUsersButton) {
        exportAllUsersButton.addEventListener('click', function() {
            exportAllUsers();
        });
    }

    const userTableBody = document.getElementById('usersTableBody');
    if (userTableBody) {
        userTableBody.addEventListener('click', function(event) {
            const actionButton = event.target.closest('button[data-action]');
            if (!actionButton) return;

            const userId = actionButton.dataset.userId;
            const action = actionButton.dataset.action;
            if (action === 'view-user') {
                viewUserDetails(userId);
            } else if (action === 'delete-user') {
                deleteUser(userId);
            }
        });
    }
}

// 导出函数
window.loadUsersData = loadUsersData;
window.renderUsersTable = renderUsersTable;
window.searchUsers = searchUsers;
window.viewUserDetails = viewUserDetails;
window.deleteUser = deleteUser;
window.exportAllUsers = exportAllUsers;
window.logoutAdmin = logoutAdmin;
window.initAdminDashboard = initAdminDashboard;