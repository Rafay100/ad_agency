import { useEffect, useRef, useState } from 'react'
import { useNotificationStore } from '@/store/notificationStore'
import { cn, formatShortDate } from '@/lib/utils'
import * as Icons from '@/components/icons'

const severityConfig = {
  info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
}

const typeLabels = {
  ctr_low: 'Low CTR',
  budget_high: 'Budget Alert',
  campaign_ended: 'Campaign Ended',
  milestone: 'Milestone',
  custom: 'Notification',
  spend_rate: 'Spend Rate',
  impressions_drop: 'Impressions Drop',
}

const NotificationDropdown = () => {
  const {
    notifications, unreadCount, isOpen, isLoading,
    fetchNotifications, markAsRead, markAllAsRead, deleteNotification,
    toggleDropdown, closeDropdown, initSocketListener, pollUnreadCount,
  } = useNotificationStore()

  const [selectedIds, setSelectedIds] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    initSocketListener()
    const cleanup = pollUnreadCount()
    return cleanup
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleMarkRead = async (ids) => {
    const idsToMark = ids.length > 0 ? ids : [notifications.find(n => !n.isRead)?.id].filter(Boolean)
    if (idsToMark.length > 0) {
      await markAsRead(idsToMark)
      setSelectedIds([])
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Icons.Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => handleMarkRead(selectedIds)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  Mark read ({selectedIds.length})
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1 scrollbar-thin">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <Icons.Bell className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => {
                  const sev = severityConfig[notification.severity] || severityConfig.info
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer',
                        !notification.isRead && 'bg-blue-50/50 dark:bg-blue-900/10'
                      )}
                      onClick={() => handleSelect(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => {}}
                          className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', sev.dot)} />
                            <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', sev.bg, sev.text)}>
                              {typeLabels[notification.type] || notification.type}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatShortDate(notification.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id) }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseEnter={(e) => e.currentTarget.classList.add('opacity-100')}
                          onMouseLeave={(e) => e.currentTarget.classList.remove('opacity-100')}
                        >
                          <Icons.X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
