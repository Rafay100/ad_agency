import CampaignTable from '@/components/dashboard/CampaignTable'
import mockData from '@/data/mockData.json'

const Campaigns = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and monitor all your campaigns</p>
      </div>
      <CampaignTable data={mockData.campaigns} />
    </div>
  )
}

export default Campaigns
