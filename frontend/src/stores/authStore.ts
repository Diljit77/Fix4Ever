import { create } from 'zustand'

interface AuthState {
  token: string | null
  user: any | null
  setAuth: (token: string, user: any) => void
  setUser: (user: any) => void
  clearAuth: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('fix4ever_token'),
  user: JSON.parse(localStorage.getItem('fix4ever_user') || 'null'),
  
  // Sets both token and user
  setAuth: (token, user) => {
    localStorage.setItem('fix4ever_token', token)
    localStorage.setItem('fix4ever_user', JSON.stringify(user))
    set({ token, user })
  },

  // Sets only user (useful in profile update)
  setUser: (user) => {
    localStorage.setItem('fix4ever_user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('fix4ever_token')
    localStorage.removeItem('fix4ever_user')
    set({ token: null, user: null })
  },

  clearAuth: () => {
    localStorage.removeItem('fix4ever_token')
    localStorage.removeItem('fix4ever_user')
    set({ token: null, user: null })
  }
}))
