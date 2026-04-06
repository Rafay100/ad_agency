import PerformanceChart from '@/components/charts/PerformanceChart'
import ChannelChart from '@/components/charts/ChannelChart'
import mockData from '@/data/mockData.json'

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Deep dive into your campaign metrics</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <PerformanceChart data={mockData.dailyPerformance} className="lg:col-span-2" />
        <ChannelChart data={mockData.channelPerformance} />
      </div>
    </div>
  )
}

export default Analytics
