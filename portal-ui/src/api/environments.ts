import apiClient from './client'
import { Environment } from '@/lib/types'

export const getEnvironments = async (): Promise<Environment[]> => {
  const response = await apiClient.get('/environments')
  return response.data
}

export const getEnvironment = async (id: string): Promise<Environment> => {
  const response = await apiClient.get(`/environments/${id}`)
  return response.data
}

export const createEnvironment = async (data: Partial<Environment>): Promise<Environment> => {
  const response = await apiClient.post('/environments', data)
  return response.data
}

export const updateEnvironment = async (id: string, data: Partial<Environment>): Promise<Environment> => {
  const response = await apiClient.put(`/environments/${id}`, data)
  return response.data
}

export const deleteEnvironment = async (id: string): Promise<void> => {
  await apiClient.delete(`/environments/${id}`)
}
