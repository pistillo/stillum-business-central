import { create } from 'zustand'
import { User } from '@/lib/types'

interface AuthState {
  token: string | null
  user: User | null
  tenantId: string | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User, tenantId: string) => void
  setUser: (user: User) => void
  setTenant: (tenantId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('auth_token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  tenantId: localStorage.getItem('tenant_id'),
  isAuthenticated: !!localStorage.getItem('auth_token'),

  setAuth: (token: string, user: User, tenantId: string) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('tenant_id', tenantId)
    set({ token, user, tenantId, isAuthenticated: true })
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  setTenant: (tenantId: string) => {
    localStorage.setItem('tenant_id', tenantId)
    set({ tenantId })
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('tenant_id')
    set({ token: null, user: null, tenantId: null, isAuthenticated: false })
  },
}))
