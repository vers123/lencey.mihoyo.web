import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    dark: false
  }),
  actions: {
    init() {
      const saved = localStorage.getItem('theme')
      if (saved) {
        this.dark = saved === 'dark'
      } else {
        this.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      this.apply()
    },
    toggle() {
      this.dark = !this.dark
      localStorage.setItem('theme', this.dark ? 'dark' : 'light')
      this.apply()
    },
    apply() {
      if (this.dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
})
