// 搜索功能模块：使用 config/games.config.js 作为唯一游戏数据源
function getAllGames() {
    if (!window.gamesConfig) {
        console.warn('gamesConfig not found on window');
        return [];
    }

    return [
        ...(Array.isArray(window.gamesConfig.mihoyo) ? window.gamesConfig.mihoyo : []),
        ...(Array.isArray(window.gamesConfig.other) ? window.gamesConfig.other : [])
    ];
}

function searchGames(keyword) {
    const query = (keyword || '').trim().toLowerCase();
    if (!query) return [];

    return getAllGames().filter(game => {
        const text = [
            game.name,
            game.nameEn,
            game.category,
            game.description,
            game.descriptionEn,
            ...(Array.isArray(game.tags) ? game.tags : [])
        ].join(' ').toLowerCase();

        return text.includes(query);
    });
}

function renderSearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="text-gray-500 dark:text-gray-400 text-center py-8">
                <span class="lang-zh">未找到匹配的游戏</span>
                <span class="lang-en hidden">No games found</span>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = results.map(game => `
        <a href="${game.link}" target="_blank" class="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="text-xl">🎮</span>
            </div>
            <div>
                <h3 class="font-medium text-gray-800 dark:text-white">${game.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">${game.category}</p>
            </div>
        </a>
    `).join('');
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchInputEn = document.getElementById('searchInputEn');
    const searchResults = document.getElementById('searchResults');
    const gameCards = document.querySelectorAll('.game-card');

    const update = (value) => {
        if (searchResults) {
            renderSearchResults(searchGames(value));
        } else {
            const keyword = value.trim().toLowerCase();
            gameCards.forEach(card => {
                const text = (card.dataset.gameName || '').toLowerCase();
                card.style.display = !keyword || text.includes(keyword) ? 'block' : 'none';
            });
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (event) => update(event.target.value));
    }

    if (searchInputEn) {
        searchInputEn.addEventListener('input', (event) => update(event.target.value));
    }
}

window.searchGames = searchGames;
window.renderSearchResults = renderSearchResults;
window.initSearch = initSearch;