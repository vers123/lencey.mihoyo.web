/** @type {import('tailwindcss').Config} */
module.exports = {
  // 暗黑模式：基于 class 切换（配合你的主题切换逻辑）
  darkMode: 'class',

  // 要应用 Tailwind 的文件路径（确保覆盖所有页面）
  content: [
    './index.html',
    './pages/**/*.html',
    './assets/js/**/*.js'
  ],

  // 自定义主题配置（适配游戏导航站风格）
  theme: {
    extend: {
      // 颜色：适配游戏风格的主色+暗黑模式配色
      colors: {
        // 主色：选用科技感/游戏风的蓝色系
        primary: {
          DEFAULT: '#165DFF',
          light: '#4080FF',
          dark: '#0E42D2'
        },
        // 游戏分类辅助色（米哈游/其他游戏区分）
        mihoyo: '#FF6B8A',    // 米哈游主题粉
        minecraft: '#5AC8FA', // Minecraft 主题蓝
        // 暗黑模式基础色
        dark: {
          bg: '#121212',      // 暗黑模式背景
          card: '#1E1E1E',    // 暗黑模式卡片背景
          text: '#E0E0E0'     // 暗黑模式文本
        },
        // 浅色模式基础色
        light: {
          bg: '#F8F9FA',      // 浅色模式背景
          card: '#FFFFFF',    // 浅色模式卡片背景
          text: '#333333'     // 浅色模式文本
        }
      },

      // 字体：适配中英双语显示
      fontFamily: {
        sans: [
          'Inter',
          'PingFang SC',
          'Microsoft YaHei',
          'Helvetica Neue',
          'sans-serif'
        ]
      },

      // 响应式断点：优化移动端游戏卡片显示
      screens: {
        'xs': '360px',       // 小屏手机（适配更多移动端）
        'sm': '640px',       // 标准手机
        'md': '768px',       // 平板
        'lg': '1024px',      // 笔记本
        'xl': '1280px'       // 桌面端
      },

      // 圆角：游戏卡片用圆润风格
      borderRadius: {
        'game-card': '12px', // 游戏卡片专属圆角
        'btn': '6px'         // 按钮专属圆角
      },

      // 阴影：游戏卡片 hover 动效
      boxShadow: {
        'game-card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'game-card-hover': '0 8px 20px rgba(0, 0, 0, 0.12)'
      },

      // 过渡动画：适配 UI 交互
      transitionProperty: {
        'card': 'box-shadow, transform',
        'theme': 'background-color, color, border-color'
      },
      transitionDuration: {
        'default': '300ms'
      },
      transitionTimingFunction: {
        'default': 'ease-in-out'
      }
    }
  },

  // 插件：保留默认插件，可按需扩展
  plugins: [
    // 可选：添加官方插件（如排版/表单）
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms')
  ]
}