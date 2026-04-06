import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { clientAPI } from '@/services/api'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi'

const Clients = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page],
    queryFn: () => clientAPI.getAll({ page, limit: 10 }),
  })

  const clients = data?.data?.clients || []
  const pagination = data?.data?.pagination || {}

  const columns = [
    { key: 'name', header: 'Client', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'company', header: 'Company', render: (row) => row.company },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'activeCampaigns', header: 'Active Campaigns', render: (row) => row.activeCampaigns || 0 },
    { key: 'totalSpend', header: 'Total Spend', render: (row) => formatCurrency(row.totalSpend || 0) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/clients/${row.id}`)} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiEye className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={() => navigate('/clients/new')}>
          <FiPlus className="w-4 h-4 mr-2" />
          New Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table columns={columns} data={clients} isLoading={isLoading} />
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination.total || 0)} of {pagination.total || 0} clients
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={page * 10 >= pagination.total} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Clients
