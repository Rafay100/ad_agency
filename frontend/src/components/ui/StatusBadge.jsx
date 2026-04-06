import { cn } from '@/lib/utils'

const StatusBadge = ({ status }) => {
  const variants = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20',
    paused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-yellow-600/20',
    completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20',
    draft: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 ring-gray-500/20',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md ring-1 ring-inset',
      variants[status] || variants.draft
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'active' && 'bg-green-600 dark:bg-green-400',
        status === 'paused' && 'bg-yellow-600 dark:bg-yellow-400',
        status === 'completed' && 'bg-blue-600 dark:bg-blue-400',
        status === 'draft' && 'bg-gray-500 dark:bg-gray-400',
        status === 'cancelled' && 'bg-red-600 dark:bg-red-400',
      )} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge
