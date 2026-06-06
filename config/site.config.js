// 网站配置
const siteConfig = {
    name: 'Vers123 游戏导航',
    nameEn: 'Vers123 Game Navigation',
    description: '专注于游戏资源整合的导航网站',
    descriptionEn: 'A game navigation website focused on integrating game resources',
    version: '1.0.0',
    author: 'Vers123',
    email: 'contact@vers123.com',
    copyright: '2025',
    // 部署基路径（例如 GitHub Pages：'/repo-name'），发布到根域时留空
    basePath: '',
    
    // 主题配置
    theme: {
        default: 'light',
        colors: {
            primary: '#4A90E2',
            secondary: '#50E3C2',
            dark: {
                DEFAULT: '#1A1A2E',
                card: '#2d2d44'
            },
            light: {
                DEFAULT: '#F7F7F9',
                card: '#FFFFFF'
            }
        }
    },
    
    // 语言配置
    languages: [
        { code: 'zh', name: '中文', nameEn: 'Chinese' },
        { code: 'en', name: 'English', nameEn: 'English' }
    ],
    defaultLanguage: 'zh',
    
    // 游戏分类
    categories: {
        mihoyo: {
            name: '米哈游',
            nameEn: 'miHoYo',
            description: '米哈游旗下游戏',
            descriptionEn: 'miHoYo Games'
        },
        other: {
            name: '其他游戏',
            nameEn: 'Other Games',
            description: '其他热门游戏',
            descriptionEn: 'Other Popular Games'
        }
    },
    
    // 路由配置
    routes: {
        home: '/',
        mihoyo: '/pages/mihoyo/index.html',
        otherGames: '/pages/other-games/index.html',
        account: '/pages/account/index.html',
        login: '/pages/auth/login.html',
        register: '/pages/auth/register.html',
        forgotPassword: '/pages/auth/forgot-password.html',
        admin: '/pages/admin/index.html',
        adminLogin: '/pages/admin/login.html',
        notFound: '/pages/404.html'
    }
};

// 导出配置
window.siteConfig = siteConfig;