import apiClient from './client'
import { ArtifactVersion, PaginatedResponse } from '@/lib/types'

export const getVersions = async (
  artifactId: string,
  page: number = 0,
  pageSize: number = 10
): Promise<PaginatedResponse<ArtifactVersion>> => {
  const response = await apiClient.get(
    `/artifacts/${artifactId}/versions?page=${page}&pageSize=${pageSize}`
  )
  return response.data
}

export const getVersion = async (
  artifactId: string,
  versionId: string
): Promise<ArtifactVersion> => {
  const response = await apiClient.get(`/artifacts/${artifactId}/versions/${versionId}`)
  return response.data
}

export const createVersion = async (
  artifactId: string,
  data: {
    content: string
    changeDescription?: string
    metadata?: Record<string, any>
  }
): Promise<ArtifactVersion> => {
  const response = await apiClient.post(`/artifacts/${artifactId}/versions`, data)
  return response.data
}

export const updateVersion = async (
  artifactId: string,
  versionId: string,
  data: {
    content: string
    changeDescription?: string
    metadata?: Record<string, any>
  }
): Promise<ArtifactVersion> => {
  const response = await apiClient.put(
    `/artifacts/${artifactId}/versions/${versionId}`,
    data
  )
  return response.data
}

export const deleteVersion = async (
  artifactId: string,
  versionId: string
): Promise<void> => {
  await apiClient.delete(`/artifacts/${artifactId}/versions/${versionId}`)
}

export const transitionVersion = async (
  artifactId: string,
  versionId: string,
  targetStatus: string
): Promise<ArtifactVersion> => {
  const response = await apiClient.post(
    `/artifacts/${artifactId}/versions/${versionId}/transition`,
    { targetStatus }
  )
  return response.data
}

export const compareVersions = async (
  artifactId: string,
  versionId1: string,
  versionId2: string
): Promise<Record<string, any>> => {
  const response = await apiClient.get(
    `/artifacts/${artifactId}/versions/${versionId1}/compare/${versionId2}`
  )
  return response.data
}
