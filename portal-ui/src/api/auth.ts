import apiClient from './client'
import { User } from '@/lib/types'

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get('/auth/profile')
  return response.data
}

export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await apiClient.post('/auth/refresh')
  return response.data
}
