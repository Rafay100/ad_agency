import { useMemo } from 'react'
import mockData from '@/data/mockData.json'
import StatCard from '@/components/dashboard/StatCard'
import PerformanceChart from '@/components/charts/PerformanceChart'
import ChannelChart from '@/components/charts/ChannelChart'
import CampaignTable from '@/components/dashboard/CampaignTable'
import * as Icons from '@/components/icons'

const Dashboard = () => {
  const { kpis, kpiTrends, dailyPerformance, channelPerformance, campaigns } = mockData

  const statCards = useMemo(() => [
    { title: 'Impressions', value: kpis.impressions, trend: kpiTrends.impressions, icon: Icons.Eye, accentColor: 'primary' },
    { title: 'Clicks', value: kpis.clicks, trend: kpiTrends.clicks, icon: Icons.Target, accentColor: 'blue' },
    { title: 'CTR', value: kpis.ctr, trend: kpiTrends.ctr, icon: Icons.BarChart, accentColor: 'purple' },
    { title: 'Conversions', value: kpis.conversions, trend: kpiTrends.conversions, icon: Icons.TrendingUp, accentColor: 'green' },
    { title: 'Spend', value: kpis.spend, trend: kpiTrends.spend, icon: Icons.Download, accentColor: 'orange' },
    { title: 'ROAS', value: kpis.roas, trend: kpiTrends.roas, icon: Icons.TrendingUp, accentColor: 'pink' },
  ], [kpis, kpiTrends])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Overview of your campaign performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <PerformanceChart data={dailyPerformance} className="lg:col-span-2" />
        <ChannelChart data={channelPerformance} />
      </div>

      <CampaignTable data={campaigns} />
    </div>
  )
}

export default Dashboard
