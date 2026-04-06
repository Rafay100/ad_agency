import { cn, formatCurrency, formatCompactNumber, formatPercentage, formatDecimal } from '@/lib/utils'
import * as Icons from '@/components/icons'

const formatValue = (key, value) => {
  switch (key) {
    case 'impressions':
      return formatCompactNumber(value)
    case 'clicks':
      return formatCompactNumber(value)
    case 'ctr':
      return `${formatDecimal(value)}%`
    case 'conversions':
      return formatCompactNumber(value)
    case 'spend':
      return formatCurrency(value)
    case 'roas':
      return `${formatDecimal(value)}x`
    default:
      return value
  }
}

const StatCard = ({ title, value, trend, icon: Icon, accentColor = 'primary' }) => {
  const isPositive = trend >= 0

  const colorMap = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  }

  return (
    <div className="card p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white truncate">
            {formatValue(title.toLowerCase(), value)}
          </p>
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorMap[accentColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )}>
          {isPositive ? <Icons.TrendingUp className="w-4 h-4" /> : <Icons.TrendingDown className="w-4 h-4" />}
          {formatPercentage(Math.abs(trend))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">vs previous period</span>
      </div>
    </div>
  )
}

export default StatCard
