import { create } from 'zustand'
import { Notification } from '@/lib/types'

interface NotificationStoreState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  setUnreadCount: (count: number) => void
  incrementUnreadCount: () => void
  decrementUnreadCount: () => void
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications: Notification[]) => {
    const unreadCount = notifications.filter((n) => !n.read).length
    set({ notifications, unreadCount })
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    }))
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count })
  },

  incrementUnreadCount: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }))
  },

  decrementUnreadCount: () => {
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }))
  },
}))
