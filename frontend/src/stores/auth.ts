import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_NEST_API_URL || 'http://localhost:3000',
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as null | { id: number; username: string; email: string; colorText: string, colorBg: string },
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async register(payload: { username: string; email: string; password: string }) {
      const res = await api.post('/auth/register', payload)
      return res.data
    },

    async login(payload: { username: string; password: string }) {
      const res = await api.post('/auth/login', payload)
      this.token = res.data.access_token
      localStorage.setItem('token', this.token)
      // Charge les infos utilisateur
      await this.fetchUser()
    },

    async fetchUser() {
      const res = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      this.user = res.data
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
