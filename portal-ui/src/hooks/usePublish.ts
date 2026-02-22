import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as publishApi from '@/api/publish'

export function usePublish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof publishApi.publishArtifact>[0]) =>
      publishApi.publishArtifact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] })
      queryClient.invalidateQueries({ queryKey: ['versions'] })
    },
  })
}

export function usePublication(id: string | undefined) {
  return useQuery({
    queryKey: ['publication', id],
    queryFn: () => (id ? publishApi.getPublication(id) : Promise.reject()),
    enabled: !!id,
  })
}

export function usePublications(versionId: string | undefined) {
  return useQuery({
    queryKey: ['publications', versionId],
    queryFn: () => (versionId ? publishApi.getPublications(versionId) : Promise.reject()),
    enabled: !!versionId,
  })
}

export function useRetryPublish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => publishApi.retryPublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] })
    },
  })
}

export function useRollbackPublish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => publishApi.rollbackPublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] })
    },
  })
}
