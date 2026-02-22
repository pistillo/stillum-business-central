import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as notificationsApi from '@/api/notifications'
import { useNotificationStore } from '@/stores/notificationStore'
import { NOTIFICATION_POLLING_INTERVAL } from '@/lib/constants'

export function useNotifications(page = 0, pageSize = 20) {
  const setNotifications = useNotificationStore((state) => state.setNotifications)

  return useQuery({
    queryKey: ['notifications', page, pageSize],
    queryFn: async () => {
      const data = await notificationsApi.getNotifications(page, pageSize)
      setNotifications(data.data)
      return data
    },
    refetchInterval: NOTIFICATION_POLLING_INTERVAL,
  })
}

export function useUnreadNotificationCount() {
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount)

  return useQuery({
    queryKey: ['unreadNotificationCount'],
    queryFn: async () => {
      const data = await notificationsApi.getUnreadCount()
      setUnreadCount(data.count)
      return data
    },
    refetchInterval: NOTIFICATION_POLLING_INTERVAL,
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  const decrementUnreadCount = useNotificationStore((state) => state.decrementUnreadCount)

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      decrementUnreadCount()
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
