import apiClient from './client'
import { Notification, PaginatedResponse } from '@/lib/types'

export const getNotifications = async (
  page: number = 0,
  pageSize: number = 20
): Promise<PaginatedResponse<Notification>> => {
  const response = await apiClient.get(`/notifications?page=${page}&pageSize=${pageSize}`)
  return response.data
}

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await apiClient.put(`/notifications/${id}/read`)
  return response.data
}

export const markAllAsRead = async (): Promise<void> => {
  await apiClient.post('/notifications/read-all')
}

export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`/notifications/${id}`)
}

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get('/notifications/unread-count')
  return response.data
}
