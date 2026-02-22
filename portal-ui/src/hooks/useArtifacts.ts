import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as artifactsApi from '@/api/artifacts'
import { Artifact } from '@/lib/types'

export function useArtifacts(page = 0, pageSize = 20, filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['artifacts', page, pageSize, filters],
    queryFn: () => artifactsApi.getArtifacts(page, pageSize, filters),
  })
}

export function useArtifact(id: string | undefined) {
  return useQuery({
    queryKey: ['artifact', id],
    queryFn: () => (id ? artifactsApi.getArtifact(id) : Promise.reject()),
    enabled: !!id,
  })
}

export function useCreateArtifact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof artifactsApi.createArtifact>[0]) =>
      artifactsApi.createArtifact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] })
    },
  })
}

export function useUpdateArtifact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Artifact> }) =>
      artifactsApi.updateArtifact(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] })
      queryClient.invalidateQueries({ queryKey: ['artifact', data.id] })
    },
  })
}

export function useDeleteArtifact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => artifactsApi.deleteArtifact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] })
    },
  })
}

export function useArchiveArtifact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => artifactsApi.archiveArtifact(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] })
      queryClient.invalidateQueries({ queryKey: ['artifact', data.id] })
    },
  })
}
