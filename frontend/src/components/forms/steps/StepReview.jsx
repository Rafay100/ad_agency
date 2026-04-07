import { cn } from '@/lib/utils'

const Section = ({ title, children }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
)

const Field = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-4">
    <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-40 flex-shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
)

const industries = {
  technology: 'Technology', ecommerce: 'E-Commerce', healthcare: 'Healthcare', finance: 'Finance',
  education: 'Education', realestate: 'Real Estate', hospitality: 'Hospitality', automotive: 'Automotive',
  fashion: 'Fashion & Apparel', food: 'Food & Beverage', entertainment: 'Entertainment', other: 'Other',
}

const objectives = {
  awareness: 'Brand Awareness', traffic: 'Website Traffic', engagement: 'Engagement',
  leads: 'Lead Generation', conversions: 'Conversions', sales: 'Direct Sales',
}

const tones = {
  professional: 'Professional', casual: 'Casual & Friendly', humorous: 'Humorous',
  urgent: 'Urgent & Action-Oriented', inspirational: 'Inspirational', educational: 'Educational',
}

const styles = {
  minimal: 'Minimal & Clean', bold: 'Bold & Vibrant', corporate: 'Corporate & Trustworthy',
  playful: 'Playful & Fun', luxury: 'Luxury & Premium', retro: 'Retro & Nostalgic',
}

const durations = {
  '2weeks': '2 Weeks', '1month': '1 Month', '3months': '3 Months',
  '6months': '6 Months', ongoing: 'Ongoing',
}

const channelLabels = {
  google: 'Google Ads', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn',
  tiktok: 'TikTok', youtube: 'YouTube', twitter: 'X (Twitter)', email: 'Email',
}

const StepReview = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review & Submit</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review your campaign brief before generating with AI.</p>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-5">
          <Section title="Client Details">
            <Field label="Client" value={data.clientName} />
            <Field label="Email" value={data.clientEmail} />
            <Field label="Company" value={data.companyName} />
            <Field label="Industry" value={industries[data.industry] || data.industry} />
            <Field label="Budget" value={data.budget ? `$${Number(data.budget).toLocaleString()}` : 'N/A'} />
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-40 flex-shrink-0">Target Audience</span>
              <span className="text-sm text-gray-900 dark:text-white">{data.targetAudience}</span>
            </div>
          </Section>
        </div>

        <div className="p-5">
          <Section title="Campaign Objective">
            <Field label="Campaign" value={data.campaignName} />
            <Field label="Objective" value={objectives[data.objective] || data.objective} />
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-40 flex-shrink-0">Key Message</span>
              <span className="text-sm text-gray-900 dark:text-white">{data.keyMessage}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-40 flex-shrink-0">USP</span>
              <span className="text-sm text-gray-900 dark:text-white">{data.uniqueSellingPoint}</span>
            </div>
            <Field label="Regions" value={data.targetRegions?.map(r => r.toUpperCase()).join(', ')} />
            <Field label="Duration" value={durations[data.campaignDuration] || data.campaignDuration} />
          </Section>
        </div>

        <div className="p-5">
          <Section title="Creative Preferences">
            <Field label="Tone" value={tones[data.tone] || data.tone} />
            <Field label="Channels" value={data.channels?.map(c => channelLabels[c] || c).join(', ')} />
            <Field label="Visual Style" value={styles[data.visualStyle] || data.visualStyle} />
            {data.brandColors && <Field label="Brand Colors" value={data.brandColors} />}
            {data.competitors && (
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-40 flex-shrink-0">Competitors</span>
                <span className="text-sm text-gray-900 dark:text-white">{data.competitors}</span>
              </div>
            )}
            {data.additionalNotes && (
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-40 flex-shrink-0">Notes</span>
                <span className="text-sm text-gray-900 dark:text-white">{data.additionalNotes}</span>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}

export default StepReview
