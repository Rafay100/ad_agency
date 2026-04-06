import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import * as Icons from '@/components/icons'

const ranges = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 60 days', value: '60d' },
  { label: 'Last 90 days', value: '90d' },
]

const DateRangePicker = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('30d')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value) => {
    setSelected(value)
    setIsOpen(false)
  }

  const currentRange = ranges.find(r => r.value === selected)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Icons.ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        {currentRange?.label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleSelect(range.value)}
              className={cn(
                'w-full px-4 py-2 text-left text-sm transition-colors',
                selected === range.value
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
