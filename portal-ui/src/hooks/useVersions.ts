import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as versionsApi from '@/api/versions'

export function useVersions(artifactId: string, page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ['versions', artifactId, page, pageSize],
    queryFn: () => versionsApi.getVersions(artifactId, page, pageSize),
    enabled: !!artifactId,
  })
}

export function useVersion(artifactId: string, versionId: string | undefined) {
  return useQuery({
    queryKey: ['version', artifactId, versionId],
    queryFn: () => (versionId ? versionsApi.getVersion(artifactId, versionId) : Promise.reject()),
    enabled: !!artifactId && !!versionId,
  })
}

export function useCreateVersion(artifactId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof versionsApi.createVersion>[1]) =>
      versionsApi.createVersion(artifactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', artifactId] })
      queryClient.invalidateQueries({ queryKey: ['artifact', artifactId] })
    },
  })
}

export function useUpdateVersion(artifactId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      versionId,
      data,
    }: {
      versionId: string
      data: Parameters<typeof versionsApi.updateVersion>[2]
    }) => versionsApi.updateVersion(artifactId, versionId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['versions', artifactId] })
      queryClient.invalidateQueries({ queryKey: ['version', artifactId, data.id] })
    },
  })
}

export function useCompareVersions(artifactId: string) {
  return useMutation({
    mutationFn: ({
      versionId1,
      versionId2,
    }: {
      versionId1: string
      versionId2: string
    }) => versionsApi.compareVersions(artifactId, versionId1, versionId2),
  })
}

export function useTransitionVersion(artifactId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      versionId,
      targetStatus,
    }: {
      versionId: string
      targetStatus: string
    }) => versionsApi.transitionVersion(artifactId, versionId, targetStatus),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['version', artifactId, data.id] })
      queryClient.invalidateQueries({ queryKey: ['versions', artifactId] })
    },
  })
}
