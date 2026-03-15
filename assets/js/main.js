// 全局通用逻辑：语言切换、暗黑模式、收藏、搜索
// 优化点：增强容错、统一命名规范、添加类型校验、优化性能

document.addEventListener('DOMContentLoaded', () => {
  // ======================== 通用工具函数 ========================
  /**
   * 安全获取本地存储数据（带默认值）
   * @param {string} key - 存储键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 解析后的数据
   */
  const getLocalStorage = (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`读取本地存储 ${key} 失败：`, error);
      return defaultValue;
    }
  };

  /**
   * 安全设置本地存储数据
   * @param {string} key - 存储键名
   * @param {any} value - 要存储的值
   */
  const setLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`设置本地存储 ${key} 失败：`, error);
    }
  };

  // ======================== 1. 语言切换逻辑 ========================
  const initLangToggle = () => {
    // 获取元素（增强容错）
    const langCnBtn = document.getElementById('lang-cn');
    const langEnBtn = document.getElementById('lang-en');
    const langToggleBtn = document.getElementById('langToggle');
    const cnElements = document.querySelectorAll('.lang-cn, .lang-zh');
    const enElements = document.querySelectorAll('.lang-en');

    // 元素不存在时直接返回
    if ((!langCnBtn && !langEnBtn && !langToggleBtn) || (!cnElements.length && !enElements.length)) {
      console.debug('语言切换元素未找到，跳过初始化');
      return;
    }

    // 读取本地存储的语言偏好（统一命名规范）
    const savedLang = getLocalStorage('preferred-lang', 'cn');

    // 初始化语言显示
    const toggleLang = (lang) => {
      // 校验语言类型
      if (!['cn', 'en', 'zh'].includes(lang)) lang = 'cn';

      // 切换文本显示
      const isCn = lang === 'cn' || lang === 'zh';
      cnElements.forEach(el => el.classList.toggle('hidden', !isCn));
      enElements.forEach(el => el.classList.toggle('hidden', isCn));

      // 更新按钮样式（优化样式切换逻辑）
      if (langCnBtn && langEnBtn) {
        // 中文按钮样式
        langCnBtn.classList.toggle('bg-primary', isCn);
        langCnBtn.classList.toggle('text-white', isCn);
        langCnBtn.classList.toggle('bg-gray-200', !isCn);
        langCnBtn.classList.toggle('dark:bg-gray-700', !isCn);

        // 英文按钮样式
        langEnBtn.classList.toggle('bg-primary', !isCn);
        langEnBtn.classList.toggle('text-white', !isCn);
        langEnBtn.classList.toggle('bg-gray-200', isCn);
        langEnBtn.classList.toggle('dark:bg-gray-700', isCn);
      }

      // 保存到本地存储
      setLocalStorage('preferred-lang', lang);
    };

    // 初始化语言
    toggleLang(savedLang);

    // 绑定切换事件（添加防抖）
    if (langCnBtn) langCnBtn.addEventListener('click', () => toggleLang('cn'));
    if (langEnBtn) langEnBtn.addEventListener('click', () => toggleLang('en'));
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        const currentLang = getLocalStorage('preferred-lang', 'cn');
        toggleLang(currentLang === 'cn' || currentLang === 'zh' ? 'en' : 'cn');
      });
    }
  };

  // ======================== 2. 暗黑模式切换逻辑 ========================
  const initThemeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle') || document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon') || document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.moon-icon') || document.querySelector('.icon-moon');

    // 元素不存在时直接返回
    if (!themeToggleBtn) {
      console.debug('暗黑模式切换元素未找到，跳过初始化');
      return;
    }

    // 读取本地存储的主题偏好
    const savedTheme = getLocalStorage('preferred-theme', 'light');
    const isDark = savedTheme === 'dark';

    // 初始化主题
    document.documentElement.classList.toggle('dark', isDark);
    if (sunIcon) sunIcon.classList.toggle('hidden', isDark);
    if (moonIcon) moonIcon.classList.toggle('hidden', !isDark);

    // 绑定切换事件
    themeToggleBtn.addEventListener('click', () => {
      const newIsDark = !document.documentElement.classList.contains('dark');

      // 更新DOM
      document.documentElement.classList.toggle('dark', newIsDark);
      if (sunIcon) sunIcon.classList.toggle('hidden', newIsDark);
      if (moonIcon) moonIcon.classList.toggle('hidden', !newIsDark);

      // 保存到本地存储
      setLocalStorage('preferred-theme', newIsDark ? 'dark' : 'light');
    });
  };

  // ======================== 3. 收藏功能逻辑 ========================
  const initFavorites = () => {
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    if (!favoriteBtns.length) {
      console.debug('收藏按钮未找到，跳过初始化');
      return;
    }

    // 读取本地存储的收藏列表（确保是数组）
    let favorites = getLocalStorage('favorites', []);
    if (!Array.isArray(favorites)) favorites = [];

    // 初始化收藏按钮状态
    favoriteBtns.forEach(btn => {
      const gameId = btn.dataset.gameId;
      // 校验gameId是否存在
      if (!gameId) {
        console.warn('收藏按钮缺少data-game-id属性');
        return;
      }

      // 设置初始状态
      if (favorites.includes(gameId)) {
        btn.classList.add('text-red-500'); // 已收藏样式
        btn.setAttribute('aria-label', '取消收藏'); // 无障碍属性
      } else {
        btn.setAttribute('aria-label', '添加收藏'); // 无障碍属性
      }

      // 绑定收藏事件（添加防抖）
      let isProcessing = false;
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        isProcessing = true;

        try {
          const index = favorites.indexOf(gameId);
          if (index > -1) {
            // 取消收藏
            favorites.splice(index, 1);
            btn.classList.remove('text-red-500');
            btn.setAttribute('aria-label', '添加收藏');
          } else {
            // 添加收藏
            favorites.push(gameId);
            btn.classList.add('text-red-500');
            btn.setAttribute('aria-label', '取消收藏');
          }
          // 保存到本地存储
          setLocalStorage('favorites', favorites);
        } catch (error) {
          console.error('切换收藏状态失败：', error);
        } finally {
          isProcessing = false;
        }
      });
    });
  };

  // ======================== 4. 搜索功能逻辑 ========================
  const initSearch = () => {
    const searchInput = document.getElementById('game-search') || document.getElementById('searchInput');
    const gameCards = document.querySelectorAll('.game-card');

    if (!searchInput || !gameCards.length) {
      console.debug('搜索功能元素未找到，跳过初始化');
      return;
    }

    // 防抖函数
    const debounce = (func, delay = 300) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    };

    // 搜索逻辑（添加防抖）
    const handleSearch = debounce((searchTerm) => {
      // 空搜索时显示所有卡片
      if (!searchTerm) {
        gameCards.forEach(card => card.classList.remove('hidden'));
        return;
      }

      // 过滤游戏卡片
      gameCards.forEach(card => {
        // 安全获取文本内容
        const cnName = (card.querySelector('.lang-cn, .lang-zh')?.textContent || '').toLowerCase().trim();
        const enName = (card.querySelector('.lang-en')?.textContent || '').toLowerCase().trim();
        const dataGame = card.getAttribute('data-game')?.toLowerCase() || '';

        const isMatch = cnName.includes(searchTerm) || enName.includes(searchTerm) || dataGame.includes(searchTerm);
        card.classList.toggle('hidden', !isMatch);
      });
    });

    // 绑定搜索事件
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      handleSearch(searchTerm);
    });

    // 支持回车清空搜索
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchInput.value = '';
        handleSearch('');
      }
    });
  };

  // ======================== 5. 侧边栏和内容切换逻辑 ========================
  const initSidebar = () => {
    const menuToggle = document.getElementById('menuToggle');
    const hamburgerContainer = document.getElementById('hamburgerContainer');
    const sidebar = document.getElementById('sidebar');

    if (!menuToggle || !sidebar) {
      return;
    }

    // 菜单切换功能
    menuToggle.addEventListener('click', () => {
      const isOpen = sidebar.style.width === '200px';
      sidebar.style.width = isOpen ? '0' : '200px';
      sidebar.style.padding = isOpen ? '0' : '16px';
    });
  };

  // ======================== 6. 内容显示切换逻辑 ========================
  const initContentSwitch = () => {
    window.showContent = (contentId) => {
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
      });
      const targetSection = document.getElementById(contentId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      }
    };
  };

  // ======================== 执行初始化 ========================
  try {
    // 按优先级初始化
    initLangToggle();      // 语言切换（优先）
    initThemeToggle();     // 暗黑模式
    initFavorites();       // 收藏功能
    initSearch();          // 搜索功能
    initSidebar();         // 侧边栏功能
    initContentSwitch();   // 内容切换功能

    console.log('全局通用功能初始化完成');
  } catch (error) {
    console.error('初始化通用功能失败：', error);
    // 不阻断页面其他功能
  }
});