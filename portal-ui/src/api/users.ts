import apiClient from './client'
import { User } from '@/lib/types'

export const getUsers = async (page: number = 0, pageSize: number = 20) => {
  const response = await apiClient.get(`/users?page=${page}&pageSize=${pageSize}`)
  return response.data
}

export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`)
  return response.data
}

export const inviteUser = async (data: {
  email: string
  roles: string[]
  sendInvitation?: boolean
}): Promise<User> => {
  const response = await apiClient.post('/users/invite', data)
  return response.data
}

export const updateUserRoles = async (userId: string, roleIds: string[]): Promise<User> => {
  const response = await apiClient.put(`/users/${userId}/roles`, { roleIds })
  return response.data
}

export const removeUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`)
}
