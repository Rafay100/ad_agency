import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { campaignAPI } from '@/services/api'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiArrowLeft, FiPause, FiPlay, FiEdit2 } from 'react-icons/fi'

const CampaignDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: campaignData, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignAPI.getById(id),
  })

  const { data: analyticsData } = useQuery({
    queryKey: ['campaign-analytics', id],
    queryFn: () => campaignAPI.getAnalytics(id),
  })

  const campaign = campaignData?.data || {}
  const analytics = analyticsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/campaigns')} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-gray-600">Campaign Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <FiEdit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="secondary">
            <FiPause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Status</p>
          <div className="mt-2"><StatusBadge status={campaign.status} /></div>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Budget</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(campaign.budget)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Spent</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(campaign.spent || 0)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Start Date</p>
          <p className="mt-2 text-lg font-medium">{formatDate(campaign.startDate)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="impressions" stroke="#3b82f6" name="Impressions" />
              <Line type="monotone" dataKey="clicks" stroke="#10b981" name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignDetail
