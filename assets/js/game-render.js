// 统一游戏列表渲染模块
function getBasePath() {
  const segments = location.pathname.split('/').filter(Boolean);
  return segments.length <= 1 ? './' : '../'.repeat(segments.length - 1);
}

function getAllGames() {
  if (!window.gamesConfig) {
    console.warn('gamesConfig is not loaded. Please include config/games.config.js first.');
    return [];
  }

  return [
    ...(Array.isArray(window.gamesConfig.mihoyo) ? window.gamesConfig.mihoyo : []),
    ...(Array.isArray(window.gamesConfig.other) ? window.gamesConfig.other : [])
  ];
}

function getGamesByCategory(category) {
  if (!window.gamesConfig) return [];
  const normalized = (category || '').toLowerCase();
  if (normalized === 'mihoyo' || normalized === '米哈游') {
    return Array.isArray(window.gamesConfig.mihoyo) ? window.gamesConfig.mihoyo : [];
  }
  if (normalized === 'other' || normalized === '其他游戏') {
    return Array.isArray(window.gamesConfig.other) ? window.gamesConfig.other : [];
  }
  return getAllGames();
}

function escapeHtml(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function createGameCard(game) {
  const basePath = getBasePath();
  let imgSrc = game.image || '';
  if (/^https?:\/\//.test(imgSrc)) {
  } else if (/^\//.test(imgSrc)) {
    const siteBase = (window.siteConfig && window.siteConfig.basePath) ? String(window.siteConfig.basePath).replace(/\/$/, '') : '';
    imgSrc = `${siteBase}${imgSrc}`;
  } else {
    imgSrc = `${basePath}${imgSrc}`;
  }
  return `
    <div class="game-card bg-light-card dark:bg-dark-card rounded-xl shadow-lg hover:shadow-xl transition-smooth hover:hover-lift overflow-hidden relative" data-game-name="${escapeHtml(game.name)} ${escapeHtml(game.nameEn)}">
      <button class="favorite-btn text-gray-400 hover:text-red-500" data-game-id="${escapeHtml(game.id)}" data-game-name="${escapeHtml(game.name)}" data-category="${escapeHtml(game.category)}" aria-label="收藏 ${escapeHtml(game.name)}">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      <a href="${escapeHtml(game.link)}" target="_blank" rel="noopener noreferrer">
        <img alt="${escapeHtml(game.name)}" class="w-full h-48 object-cover rounded-t-xl" loading="lazy" src="${escapeHtml(imgSrc)}" />
        <div class="p-4">
          <h3 class="text-xl font-bold text-primary mb-2">${escapeHtml(game.name)}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span class="lang-zh">${escapeHtml(game.description)}</span>
            <span class="lang-en hidden">${escapeHtml(game.descriptionEn)}</span>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">${escapeHtml(game.category)}</p>
        </div>
      </a>
    </div>
  `;
}

function renderGameCards(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Container not found for game cards:', containerId);
    return;
  }

  const games = getGamesByCategory(category);
  if (games.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
        <span class="lang-zh">当前分类暂无游戏</span>
        <span class="lang-en hidden">No games available in this category</span>
      </div>
    `;
    return;
  }

  container.innerHTML = games.map(createGameCard).join('');
}

function renderCategoryPage(category) {
  renderGameCards(category, 'gamesGrid');
}

window.getBasePath = getBasePath;
window.getAllGames = getAllGames;
window.getGamesByCategory = getGamesByCategory;
window.renderGameCards = renderGameCards;
window.renderCategoryPage = renderCategoryPage;
