import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as tasksApi from '@/api/tasks'

export function useMyTasks(page = 0, pageSize = 20, filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['myTasks', page, pageSize, filters],
    queryFn: () => tasksApi.getTasks(page, pageSize, { assignee: 'me', ...filters }),
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => (id ? tasksApi.getTask(id) : Promise.reject()),
    enabled: !!id,
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, variables }: { id: string; variables?: Record<string, any> }) =>
      tasksApi.completeTask(id, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
      queryClient.invalidateQueries({ queryKey: ['instances'] })
    },
  })
}

export function useReassignTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
      tasksApi.reassignTask(id, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
    },
  })
}

export function useClaimTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksApi.claimTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
    },
  })
}

export function useUnclaimTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksApi.unclaimTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
    },
  })
}
