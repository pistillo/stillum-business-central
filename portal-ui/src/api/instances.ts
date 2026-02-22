import apiClient from './client'
import { ProcessInstance, InstanceHistory, PaginatedResponse } from '@/lib/types'

export const getInstances = async (
  page: number = 0,
  pageSize: number = 20,
  filters?: Record<string, any>
): Promise<PaginatedResponse<ProcessInstance>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...Object.entries(filters || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
  })
  const response = await apiClient.get(`/instances?${params}`)
  return response.data
}

export const getInstance = async (id: string): Promise<ProcessInstance> => {
  const response = await apiClient.get(`/instances/${id}`)
  return response.data
}

export const getInstanceHistory = async (
  instanceId: string,
  page: number = 0,
  pageSize: number = 50
): Promise<PaginatedResponse<InstanceHistory>> => {
  const response = await apiClient.get(
    `/instances/${instanceId}/history?page=${page}&pageSize=${pageSize}`
  )
  return response.data
}

export const startInstance = async (data: {
  artifactId: string
  versionId: string
  variables?: Record<string, any>
  businessKey?: string
}): Promise<ProcessInstance> => {
  const response = await apiClient.post('/instances', data)
  return response.data
}

export const cancelInstance = async (id: string): Promise<ProcessInstance> => {
  const response = await apiClient.post(`/instances/${id}/cancel`)
  return response.data
}

export const suspendInstance = async (id: string): Promise<ProcessInstance> => {
  const response = await apiClient.post(`/instances/${id}/suspend`)
  return response.data
}

export const resumeInstance = async (id: string): Promise<ProcessInstance> => {
  const response = await apiClient.post(`/instances/${id}/resume`)
  return response.data
}
