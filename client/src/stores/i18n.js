import { defineStore } from 'pinia'

const messages = {
  zh: {
    siteName: 'Vers123 游戏导航',
    home: '首页',
    mihoyo: '米哈游',
    otherGames: '其他游戏',
    login: '登录',
    register: '注册',
    logout: '退出',
    account: '个人中心',
    admin: '管理后台',
    search: '搜索游戏...',
    favorites: '我的收藏',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    submit: '提交',
    cancel: '取消',
    loginWithGithub: '使用 GitHub 登录',
    loginWithGoogle: '使用 Google 登录',
    forgotPassword: '忘记密码？',
    rememberMe: '记住我',
    noAccount: '没有账号？',
    haveAccount: '已有账号？',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    language: '语言',
    verifyEmail: '验证邮箱',
    resetPassword: '重置密码',
    copyright: '© 2026 Vers123. 保留所有权利。',
    tags: '标签',
    category: '分类',
    favorite: '收藏',
    unfavorite: '取消收藏',
    comments: '评论',
    rating: '评分',
    submitComment: '发表评论',
    allCategories: '全部分类'
  },
  en: {
    siteName: 'Vers123 Game Nav',
    home: 'Home',
    mihoyo: 'miHoYo',
    otherGames: 'Other Games',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    account: 'Account',
    admin: 'Admin',
    search: 'Search games...',
    favorites: 'My Favorites',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submit: 'Submit',
    cancel: 'Cancel',
    loginWithGithub: 'Login with GitHub',
    loginWithGoogle: 'Login with Google',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    verifyEmail: 'Verify Email',
    resetPassword: 'Reset Password',
    copyright: '© 2026 Vers123. All rights reserved.',
    tags: 'Tags',
    category: 'Category',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    comments: 'Comments',
    rating: 'Rating',
    submitComment: 'Post Comment',
    allCategories: 'All Categories'
  }
}

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: localStorage.getItem('locale') || 'zh'
  }),
  getters: {
    t: (state) => (key) => messages[state.locale]?.[key] || key
  },
  actions: {
    toggle() {
      this.locale = this.locale === 'zh' ? 'en' : 'zh'
      localStorage.setItem('locale', this.locale)
    },
    set(locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
    }
  }
})
