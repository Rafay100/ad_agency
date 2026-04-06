import { create } from 'zustand'
import { notificationAPI } from '@/services/notificationApi'
import { getSocket } from '@/lib/socket'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  isLoading: false,

  fetchNotifications: async (params = { limit: 10 }) => {
    set({ isLoading: true })
    try {
      const { data } = await notificationAPI.getAll(params)
      set({ notifications: data.notifications, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await notificationAPI.getUnreadCount()
      set({ unreadCount: data.unreadCount })
    } catch {}
  },

  markAsRead: async (ids) => {
    try {
      await notificationAPI.markAsRead(ids)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          ids.includes(n.id) ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - ids.length),
      }))
    } catch {}
  },

  markAllAsRead: async () => {
    try {
      await notificationAPI.markAllAsRead()
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
        unreadCount: 0,
      }))
    } catch {}
  },

  deleteNotification: async (id) => {
    try {
      await notificationAPI.delete(id)
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    } catch {}
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  toggleDropdown: () => set((state) => ({ isOpen: !state.isOpen })),
  closeDropdown: () => set({ isOpen: false }),

  initSocketListener: () => {
    try {
      const socket = getSocket()
      socket.on('notification:received', (notification) => {
        get().addNotification(notification)
      })
    } catch {}
  },

  pollUnreadCount: () => {
    const interval = setInterval(() => {
      get().fetchUnreadCount()
    }, 30000)
    return () => clearInterval(interval)
  },
}))
