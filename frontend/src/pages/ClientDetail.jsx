import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { clientAPI, campaignAPI } from '@/services/api'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FiArrowLeft, FiMail, FiPhone } from 'react-icons/fi'

const ClientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: clientData } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientAPI.getById(id),
  })

  const { data: campaignsData } = useQuery({
    queryKey: ['client-campaigns', id],
    queryFn: () => campaignAPI.getAll({ clientId: id }),
  })

  const client = clientData?.data || {}
  const campaigns = campaignsData?.data?.campaigns || []

  const columns = [
    { key: 'name', header: 'Campaign', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'budget', header: 'Budget', render: (row) => formatCurrency(row.budget) },
    { key: 'spent', header: 'Spent', render: (row) => formatCurrency(row.spent || 0) },
    { key: 'startDate', header: 'Start Date', render: (row) => formatDate(row.startDate) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/clients')} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">{client.company}</p>
          </div>
        </div>
        <Button>Edit Client</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMail className="w-4 h-4" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span>{client.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{client.activeCampaigns || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(client.totalSpend || 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table columns={columns} data={campaigns} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientDetail
