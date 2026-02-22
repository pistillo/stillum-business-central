import apiClient from './client'
import { UserTask, PaginatedResponse } from '@/lib/types'

export const getTasks = async (
  page: number = 0,
  pageSize: number = 20,
  filters?: Record<string, any>
): Promise<PaginatedResponse<UserTask>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...Object.entries(filters || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
  })
  const response = await apiClient.get(`/tasks?${params}`)
  return response.data
}

export const getTask = async (id: string): Promise<UserTask> => {
  const response = await apiClient.get(`/tasks/${id}`)
  return response.data
}

export const completeTask = async (id: string, variables?: Record<string, any>): Promise<UserTask> => {
  const response = await apiClient.post(`/tasks/${id}/complete`, { variables })
  return response.data
}

export const reassignTask = async (id: string, assigneeId: string): Promise<UserTask> => {
  const response = await apiClient.post(`/tasks/${id}/reassign`, { assigneeId })
  return response.data
}

export const claimTask = async (id: string): Promise<UserTask> => {
  const response = await apiClient.post(`/tasks/${id}/claim`)
  return response.data
}

export const unclaimTask = async (id: string): Promise<UserTask> => {
  const response = await apiClient.post(`/tasks/${id}/unclaim`)
  return response.data
}
