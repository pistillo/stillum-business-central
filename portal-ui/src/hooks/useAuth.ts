import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const auth = useAuthStore()

  return {
    token: auth.token,
    user: auth.user,
    tenantId: auth.tenantId,
    isAuthenticated: auth.isAuthenticated,
    setAuth: auth.setAuth,
    setUser: auth.setUser,
    setTenant: auth.setTenant,
    logout: auth.logout,
  }
}
