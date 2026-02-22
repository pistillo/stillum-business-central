import apiClient from './client'
import { SearchQuery, SearchResult } from '@/lib/types'

export const searchArtifacts = async (query: SearchQuery): Promise<SearchResult> => {
  const response = await apiClient.get('/search/artifacts', { params: query })
  return response.data
}

export const searchInstances = async (q: string, limit: number = 20) => {
  const response = await apiClient.get('/search/instances', {
    params: { q, limit },
  })
  return response.data
}

export const searchTasks = async (q: string, limit: number = 20) => {
  const response = await apiClient.get('/search/tasks', {
    params: { q, limit },
  })
  return response.data
}
