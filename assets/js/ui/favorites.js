// 收藏功能模块

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

    const favoritesHTML = user.favorites.map(favorite => `
        <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth">
            <div>
                <h3 class="font-medium text-gray-800 dark:text-white">${favorite.gameName}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">${favorite.category}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">${new Date(favorite.addedAt).toLocaleString()}</p>
            </div>
            <button type="button" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-smooth" data-action="remove-favorite" data-game-id="${favorite.gameId}">
                <svg aria-hidden="true" class="icon w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        </div>
    `).join('');

    favoritesList.innerHTML = favoritesHTML;
    bindFavoritesListEvents();
}

function bindFavoritesListEvents() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList || favoritesList.dataset.bound === 'true') return;

    favoritesList.addEventListener('click', async function(event) {
        const button = event.target.closest('button[data-action="remove-favorite"]');
        if (!button) return;

        const gameId = button.dataset.gameId;
        await removeFavorite(gameId);
    });

    favoritesList.dataset.bound = 'true';
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

function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const gameId = this.getAttribute('data-game-id');
            const gameName = this.getAttribute('data-game-name');
            const category = this.getAttribute('data-category');
            
            if (this.classList.contains('active')) {
                await removeFavorite(gameId);
                this.classList.remove('active');
            } else {
                await addFavorite(gameId, gameName, category);
                this.classList.add('active');
            }
        });
    });
}

window.loadUserInfo = loadUserInfo;
window.loadFavorites = loadFavorites;
window.removeFavorite = removeFavorite;
window.addFavorite = addFavorite;
window.initFavorites = initFavorites;