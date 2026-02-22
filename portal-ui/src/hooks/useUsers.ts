import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as usersApi from '@/api/users'

export function useUsers(page = 0, pageSize = 20) {
  return useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => usersApi.getUsers(page, pageSize),
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? usersApi.getUser(id) : Promise.reject()),
    enabled: !!id,
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof usersApi.inviteUser>[0]) =>
      usersApi.inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      usersApi.updateUserRoles(userId, roleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useRemoveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.removeUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
