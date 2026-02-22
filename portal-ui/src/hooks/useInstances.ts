import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as instancesApi from '@/api/instances'

export function useInstances(page = 0, pageSize = 20, filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['instances', page, pageSize, filters],
    queryFn: () => instancesApi.getInstances(page, pageSize, filters),
  })
}

export function useInstance(id: string | undefined) {
  return useQuery({
    queryKey: ['instance', id],
    queryFn: () => (id ? instancesApi.getInstance(id) : Promise.reject()),
    enabled: !!id,
  })
}

export function useInstanceHistory(instanceId: string | undefined, page = 0, pageSize = 50) {
  return useQuery({
    queryKey: ['instanceHistory', instanceId, page, pageSize],
    queryFn: () => (instanceId ? instancesApi.getInstanceHistory(instanceId, page, pageSize) : Promise.reject()),
    enabled: !!instanceId,
  })
}

export function useStartInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof instancesApi.startInstance>[0]) =>
      instancesApi.startInstance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
    },
  })
}

export function useCancelInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => instancesApi.cancelInstance(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
      queryClient.invalidateQueries({ queryKey: ['instance', data.id] })
    },
  })
}

export function useSuspendInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => instancesApi.suspendInstance(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['instance', data.id] })
    },
  })
}

export function useResumeInstance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => instancesApi.resumeInstance(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['instance', data.id] })
    },
  })
}
