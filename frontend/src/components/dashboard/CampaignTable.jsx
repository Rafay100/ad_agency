import { useState, useMemo } from 'react'
import { cn, formatCurrency, formatCompactNumber, formatShortDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import * as Icons from '@/components/icons'

const platforms = ['All Platforms', 'Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok']
const statuses = ['All Statuses', 'active', 'paused', 'draft', 'completed']

const CampaignTable = ({ data }) => {
  const [sortField, setSortField] = useState('impressions')
  const [sortDirection, setSortDirection] = useState('desc')
  const [platformFilter, setPlatformFilter] = useState('All Platforms')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const rowsPerPage = 8

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (platformFilter !== 'All Platforms') {
      filtered = filtered.filter(c => c.platform === platformFilter)
    }
    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q)
      )
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })

    return filtered
  }, [data, platformFilter, statusFilter, searchQuery, sortField, sortDirection])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icons.ChevronDown className="w-3 h-3 opacity-30" />
    return sortDirection === 'asc'
      ? <Icons.ChevronUp className="w-3 h-3" />
      : <Icons.ChevronDown className="w-3 h-3" />
  }

  const columns = [
    { key: 'name', label: 'Campaign', sortable: true },
    { key: 'client', label: 'Client', sortable: true },
    { key: 'platform', label: 'Platform', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'impressions', label: 'Impressions', sortable: true, format: formatCompactNumber },
    { key: 'clicks', label: 'Clicks', sortable: true, format: formatCompactNumber },
    { key: 'ctr', label: 'CTR', sortable: true, format: (v) => `${v}%` },
    { key: 'spent', label: 'Spent', sortable: true, format: formatCurrency },
    { key: 'roas', label: 'ROAS', sortable: true, format: (v) => `${v}x` },
  ]

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Campaigns</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredData.length} campaign{filteredData.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 w-full sm:w-48"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) => { setPlatformFilter(e.target.value); setCurrentPage(1) }}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All Statuses' ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    'px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none'
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((campaign) => (
              <tr
                key={campaign.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatShortDate(campaign.startDate)} - {formatShortDate(campaign.endDate)}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{campaign.client}</td>
                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{campaign.platform}</td>
                <td className="px-5 py-4"><StatusBadge status={campaign.status} /></td>
                <td className="px-5 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{campaign.impressions ? formatCompactNumber(campaign.impressions) : '-'}</td>
                <td className="px-5 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{campaign.clicks ? formatCompactNumber(campaign.clicks) : '-'}</td>
                <td className="px-5 py-4 text-sm text-gray-900 dark:text-gray-100">{campaign.ctr ? `${campaign.ctr}%` : '-'}</td>
                <td className="px-5 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{campaign.spent ? formatCurrency(campaign.spent) : '-'}</td>
                <td className="px-5 py-4 text-sm font-medium" style={{ color: campaign.roas >= 3 ? '#22c55e' : campaign.roas >= 2 ? '#f59e0b' : '#ef4444' }}>
                  {campaign.roas ? `${campaign.roas}x` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-8 h-8 text-sm font-medium rounded-lg transition-colors',
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignTable
