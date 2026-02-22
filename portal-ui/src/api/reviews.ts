import apiClient from './client'
import { Review, ReviewComment } from '@/lib/types'

export const getReview = async (versionId: string): Promise<Review> => {
  const response = await apiClient.get(`/reviews?versionId=${versionId}`)
  return response.data
}

export const createReview = async (data: {
  versionId: string
  reviewerIds: string[]
  dueDate?: string
}): Promise<Review> => {
  const response = await apiClient.post('/reviews', data)
  return response.data
}

export const assignReviewer = async (reviewId: string, reviewerId: string): Promise<Review> => {
  const response = await apiClient.post(`/reviews/${reviewId}/assign`, { reviewerId })
  return response.data
}

export const approve = async (reviewId: string, comment?: string): Promise<ReviewComment> => {
  const response = await apiClient.post(`/reviews/${reviewId}/approve`, { comment })
  return response.data
}

export const reject = async (reviewId: string, comment: string): Promise<ReviewComment> => {
  const response = await apiClient.post(`/reviews/${reviewId}/reject`, { comment })
  return response.data
}

export const addComment = async (reviewId: string, content: string): Promise<ReviewComment> => {
  const response = await apiClient.post(`/reviews/${reviewId}/comments`, { content })
  return response.data
}
