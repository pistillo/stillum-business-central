import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as reviewsApi from '@/api/reviews'

export function useReview(versionId: string | undefined) {
  return useQuery({
    queryKey: ['review', versionId],
    queryFn: () => (versionId ? reviewsApi.getReview(versionId) : Promise.reject()),
    enabled: !!versionId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof reviewsApi.createReview>[0]) =>
      reviewsApi.createReview(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['review', data.id] })
    },
  })
}

export function useApproveReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, comment }: { reviewId: string; comment?: string }) =>
      reviewsApi.approve(reviewId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] })
    },
  })
}

export function useRejectReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, comment }: { reviewId: string; comment: string }) =>
      reviewsApi.reject(reviewId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] })
    },
  })
}

export function useAddReviewComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      reviewsApi.addComment(reviewId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] })
    },
  })
}
