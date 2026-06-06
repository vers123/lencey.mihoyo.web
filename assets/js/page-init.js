// 页面初始化模块，按页面类型触发统一逻辑
function bindLogout() {
  const logoutButton = document.getElementById('logoutButton');
  if (!logoutButton || typeof logout !== 'function') {
    return;
  }

  logoutButton.addEventListener('click', function () {
    logout();
  });
}

function applySiteBasePath() {
  const siteBase = (window.siteConfig && window.siteConfig.basePath) ? String(window.siteConfig.basePath).replace(/\/$/, '') : '';
  if (!siteBase) return;

  document.querySelectorAll('a[href^="/"]').forEach(a => {
    const h = a.getAttribute('href');
    a.setAttribute('href', siteBase + h);
  });
  document.querySelectorAll('img[src^="/"]').forEach(img => {
    const s = img.getAttribute('src');
    img.setAttribute('src', siteBase + s);
  });
}

function initPage({ enableFavorites = false, enableSearch = false, category = null } = {}) {
  applySiteBasePath();
  if (typeof initCommonFeatures === 'function') {
    initCommonFeatures();
  }

  if (category && typeof renderCategoryPage === 'function') {
    renderCategoryPage(category);
  }

  if (enableFavorites && typeof initFavorites === 'function') {
    initFavorites();
  }

  if (enableSearch && typeof initSearch === 'function') {
    initSearch();
  }

  bindLogout();
}

function initCategoryPage(category) {
  initPage({ category, enableFavorites: true, enableSearch: true });
}

function init404Page() {
  initPage();

  const refreshButton = document.getElementById('refreshPageButton');
  if (refreshButton) {
    refreshButton.addEventListener('click', function () {
      window.location.reload();
    });
  }
}

window.initPage = initPage;
window.initCategoryPage = initCategoryPage;
window.init404Page = init404Page;
window.bindLogout = bindLogout;
