// 公共HTML结构和功能
function renderCommonHeader(title, description) {
    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="utf-8">
            <meta content="width=device-width, initial-scale=1.0" name="viewport">
            <meta content="${description}" name="description">
            <title>${title}</title>

            <!-- Tailwind CSS CDN -->
            <script src="https://cdn.tailwindcss.com"></script>

            <!-- 自定义样式 -->
            <style>
                @layer utilities {
                    .transition-smooth {
                        transition: all 0.3s ease-in-out;
                    }
                    .hover-lift {
                        transform: translateY(-2px);
                    }
                }

                .icon {
                    width: 1em;
                    height: 1em;
                    vertical-align: middle;
                    fill: currentColor;
                    display: inline-block;
                }

                body {
                    font-family: Inter, system-ui, sans-serif;
                    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
                }

                .favorite-btn.active {
                    color: #ef4444;
                }
            </style>

            <!-- Tailwind 配置 -->
            <script>
                tailwind.config = {
                    darkMode: 'class',
                    theme: {
                        extend: {
                            colors: {
                                primary: '#4A90E2',
                                secondary: '#50E3C2',
                                mihoyo: '#4A90E2',
                                dark: {
                                    DEFAULT: '#1A1A2E',
                                    card: '#2d2d44'
                                },
                                light: {
                                    DEFAULT: '#F7F7F9',
                                    card: '#FFFFFF'
                                },
                            },
                            fontFamily: {
                                sans: ['Inter', 'system-ui', 'sans-serif'],
                            },
                        }
                    }
                }
            </script>
        </head>

        <body class="bg-light min-h-screen dark:bg-dark transition-smooth">
        <!-- 主题切换按钮 -->
        <button class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-dark-card text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-smooth z-10"
                id="themeToggle">
            <svg aria-hidden="true" class="icon icon-moon w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg aria-hidden="true" class="icon icon-sun w-5 h-5 hidden" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.76 4.84l-1.8-1.79L3.17 5.84l1.79 1.79 1.8-2.79zM1 13h3v-2H1v2zm10 8h2v-3h-2v3zm9.83-11.17l-1.79-1.79-2.79 1.8 1.79 1.79 2.79-1.8zM17 13h6v-2h-6v2zM6.76 19.16l2.79-1.8-1.79-1.79-2.79 1.8 1.79 1.79z"></path>
            </svg>
        </button>

        <!-- 语言切换按钮 -->
        <button class="fixed top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-dark-card text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-smooth z-10"
                id="langToggle">
            <svg aria-hidden="true" class="icon w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z"></path>
            </svg>
        </button>
    `;
}

function renderBackButton() {
    return `
        <!-- 返回主页按钮 -->
        <a class="fixed top-4 left-16 p-2 rounded-full bg-gray-200 dark:bg-dark-card text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-smooth z-10"
           href="../../index.html">
            <svg aria-hidden="true" class="icon w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z"></path>
            </svg>
        </a>
    `;
}

function renderCommonFooter() {
    return `
        <!-- 页脚 -->
        <footer class="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
                <span class="lang-zh">© 2025 Vers123 游戏导航 | 仅用于学习交流</span>
                <span class="lang-en hidden">© 2025 Vers123 Game Navigation | For learning only</span>
            </p>
        </footer>

        <script src="../../assets/js/common.js"></script>
        <script>
            // 页面初始化
            document.addEventListener('DOMContentLoaded', function() {
                initCommonFeatures();
            });
        </script>
        </body>
        </html>
    `;
}

function initCommonFeatures() {
    // 1. 初始化暗黑模式
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.querySelector('.icon-moon').style.display = 'none';
        document.querySelector('.icon-sun').style.display = 'inline';
    }

    // 2. 初始化语言
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang === 'en') {
        toggleLanguage();
    }

    // 3. 绑定主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // 4. 绑定语言切换
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
}

// 切换暗黑模式
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // 切换图标
    const iconMoon = document.querySelector('.icon-moon');
    const iconSun = document.querySelector('.icon-sun');
    iconMoon.style.display = isDark ? 'none' : 'inline';
    iconSun.style.display = isDark ? 'inline' : 'none';
}

// 切换语言
function toggleLanguage() {
    const zhElements = document.querySelectorAll('.lang-zh');
    const enElements = document.querySelectorAll('.lang-en');
    const isZhVisible = zhElements[0].style.display !== 'none';

    // 切换显示状态
    zhElements.forEach(el => el.style.display = isZhVisible ? 'none' : 'inline');
    enElements.forEach(el => el.style.display = isZhVisible ? 'inline' : 'none');

    // 保存语言设置
    localStorage.setItem('preferredLang', isZhVisible ? 'en' : 'zh');
}

// 初始化收藏功能
function initFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const gameId = btn.dataset.gameId;
        if (favorites.includes(gameId)) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', function(e) {
            if (e) e.preventDefault();
            const index = favorites.indexOf(gameId);
            if (index > -1) {
                favorites.splice(index, 1);
                this.classList.remove('active');
            } else {
                favorites.push(gameId);
                this.classList.add('active');
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchInputEn = document.getElementById('searchInputEn');
    const gameCards = document.querySelectorAll('.game-card');

    function filterGames(query) {
        const lowerQuery = query.toLowerCase();
        gameCards.forEach(card => {
            const gameName = card.dataset.gameName.toLowerCase();
            if (gameName.includes(lowerQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => filterGames(e.target.value));
    }
    if (searchInputEn) {
        searchInputEn.addEventListener('input', (e) => filterGames(e.target.value));
    }
}
