import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.isAdmin || false
  },
  actions: {
    async init() {
      if (this.token) {
        try {
          const res = await api.get('/auth/me')
          this.user = res.data
        } catch {
          this.logout()
        }
      }
    },
    async login(email, password, remember = false) {
      const res = await api.post('/auth/login', { email, password, remember })
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('token', this.token)
      return res.data
    },
    async register(username, email, password) {
      const res = await api.post('/auth/register', { username, email, password })
      return res.data
    },
    async verifyEmail(token) {
      const res = await api.post('/auth/verify-email', { token })
      return res.data
    },
    async forgotPassword(email) {
      const res = await api.post('/auth/forgot-password', { email })
      return res.data
    },
    async resetPassword(token, password) {
      const res = await api.post('/auth/reset-password', { token, password })
      return res.data
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      api.post('/auth/logout').catch(() => {})
    }
  }
})
