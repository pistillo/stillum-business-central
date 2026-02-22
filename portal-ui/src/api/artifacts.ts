import apiClient from './client'
import { Artifact, ArtifactVersion, PaginatedResponse } from '@/lib/types'

export const getArtifacts = async (
  page: number = 0,
  pageSize: number = 20,
  filters?: Record<string, any>
): Promise<PaginatedResponse<Artifact>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...Object.entries(filters || {}).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
  })
  const response = await apiClient.get(`/artifacts?${params}`)
  return response.data
}

export const getArtifact = async (id: string): Promise<Artifact> => {
  const response = await apiClient.get(`/artifacts/${id}`)
  return response.data
}

export const createArtifact = async (data: {
  name: string
  type: string
  description?: string
  tags?: string[]
}): Promise<Artifact> => {
  const response = await apiClient.post('/artifacts', data)
  return response.data
}

export const updateArtifact = async (
  id: string,
  data: Partial<Artifact>
): Promise<Artifact> => {
  const response = await apiClient.put(`/artifacts/${id}`, data)
  return response.data
}

export const deleteArtifact = async (id: string): Promise<void> => {
  await apiClient.delete(`/artifacts/${id}`)
}

export const archiveArtifact = async (id: string): Promise<Artifact> => {
  const response = await apiClient.post(`/artifacts/${id}/archive`)
  return response.data
}
