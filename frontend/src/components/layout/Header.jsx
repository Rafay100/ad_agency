import { useState } from 'react'
import { useDarkMode } from '@/context/DarkModeContext'
import NotificationDropdown from '@/components/notifications/NotificationDropdown'
import * as Icons from '@/components/icons'
import DateRangePicker from '@/components/ui/DateRangePicker'

const Header = ({ onMenuClick }) => {
  const { isDark, toggle } = useDarkMode()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icons.Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker />

          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Icons.Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Icons.Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header
