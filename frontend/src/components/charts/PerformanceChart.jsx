import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Legend,
} from 'recharts'
import { cn, formatCompactNumber, formatShortDate } from '@/lib/utils'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const chartColors = {
  impressions: '#818cf8',
  clicks: '#34d399',
  conversions: '#fbbf24',
  spend: '#f87171',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {formatShortDate(label)}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 dark:text-gray-400 capitalize">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {entry.name === 'spend' ? `$${entry.value.toLocaleString()}` : formatCompactNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const metrics = [
  { key: 'impressions', label: 'Impressions' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'conversions', label: 'Conversions' },
  { key: 'spend', label: 'Spend' },
]

const PerformanceChart = ({ data, className }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['impressions', 'clicks'])

  const toggleMetric = (key) => {
    setSelectedMetrics(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  return (
    <Card className={cn('col-span-full', className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Performance Trend</CardTitle>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Daily campaign performance over time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                selectedMetrics.includes(metric.key)
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: selectedMetrics.includes(metric.key)
                    ? chartColors[metric.key]
                    : '#9ca3af'
                }}
              />
              {metric.label}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              className="text-xs"
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              stroke="currentColor"
            />
            <YAxis
              tickFormatter={formatCompactNumber}
              className="text-xs"
              tick={{ fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {selectedMetrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.label}
                stroke={chartColors[metric.key]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default PerformanceChart
