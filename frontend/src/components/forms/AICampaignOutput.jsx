import { Card, CardContent } from '@/components/ui/Card'
import { exportToPDF } from '@/utils/exportPDF'
import { cn } from '@/lib/utils'
import { FiDownload, FiCheckCircle, FiLoader } from 'react-icons/fi'

const channelLabels = {
  google: 'Google Ads', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn',
  tiktok: 'TikTok', youtube: 'YouTube', twitter: 'X (Twitter)', email: 'Email',
}

const channelColors = {
  google: '#4285f4', facebook: '#1877f2', instagram: '#e4405f', linkedin: '#0a66c2',
  tiktok: '#000000', youtube: '#ff0000', twitter: '#1da1f2', email: '#ea4335',
}

const AICampaignOutput = ({ output, brief, isGenerating, onExport }) => {
  if (isGenerating) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FiLoader className="w-10 h-10 text-primary-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generating Campaign...</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">AI is crafting your campaign strategy</p>
        </CardContent>
      </Card>
    )
  }

  if (!output) return null

  const totalBudget = Number(brief?.budget || 0)

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Campaign Ready</h3>
        </div>
        <button onClick={() => exportToPDF(brief, output)} className="btn-primary text-sm">
          <FiDownload className="w-4 h-4 mr-1.5" />
          Export PDF
        </button>
      </div>

      {/* Title */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Campaign Title</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{output.title}</h2>
        </CardContent>
      </Card>

      {/* Headlines */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4">Ad Headlines</p>
          <div className="space-y-3">
            {output.headlines?.map((headline, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white pt-0.5">{headline}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tone Guide */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Tone Guide</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{output.toneGuide}</p>
        </CardContent>
      </Card>

      {/* Channel Budget */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4">Channel Budget Allocation</p>
          <div className="space-y-4">
            {output.channelBudget?.map((ch, i) => {
              const amount = (ch.percentage / 100) * totalBudget
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: channelColors[ch.channel] || '#6366f1' }} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{channelLabels[ch.channel] || ch.channel}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{ch.percentage}%</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({formatCurrency(amount)})</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${ch.percentage}%`, backgroundColor: channelColors[ch.channel] || '#6366f1' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Visual Direction */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">Visual Direction</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{output.visualDirection}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

export default AICampaignOutput
