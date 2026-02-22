import apiClient from './client'
import { Publication } from '@/lib/types'

export const publishArtifact = async (data: {
  versionId: string
  targetEnvironment: string
  changeDescription: string
  approvers?: string[]
  scheduledAt?: string
}): Promise<Publication> => {
  const response = await apiClient.post('/publish', data)
  return response.data
}

export const getPublication = async (id: string): Promise<Publication> => {
  const response = await apiClient.get(`/publish/${id}`)
  return response.data
}

export const getPublications = async (versionId: string) => {
  const response = await apiClient.get(`/publish?versionId=${versionId}`)
  return response.data
}

export const retryPublish = async (id: string): Promise<Publication> => {
  const response = await apiClient.post(`/publish/${id}/retry`)
  return response.data
}

export const rollbackPublish = async (id: string): Promise<Publication> => {
  const response = await apiClient.post(`/publish/${id}/rollback`)
  return response.data
}
