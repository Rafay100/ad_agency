import { useQuery } from '@tanstack/react-query'
import { billingAPI } from '@/services/api'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FiDownload, FiPlus } from 'react-icons/fi'

const Billing = () => {
  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: billingAPI.getInvoices,
  })

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: billingAPI.getPaymentMethods,
  })

  const columns = [
    { key: 'number', header: 'Invoice #', render: (row) => <span className="font-medium">{row.number}</span> },
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <FiDownload className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <Button>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{paymentMethods?.data?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table columns={columns} data={invoices?.data || []} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Billing
