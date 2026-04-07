const StepCampaignObjective = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form
  const targetRegions = watch('targetRegions') || []

  const regions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'eu', label: 'Europe' },
    { value: 'apac', label: 'Asia Pacific' },
    { value: 'latam', label: 'Latin America' },
    { value: 'me', label: 'Middle East' },
    { value: 'global', label: 'Global' },
  ]

  const toggleRegion = (val) => {
    const newRegions = targetRegions.includes(val)
      ? targetRegions.filter(r => r !== val)
      : [...targetRegions, val]
    setValue('targetRegions', newRegions, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Campaign Objective</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Define what this campaign should achieve.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Campaign Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('campaignName')}
          placeholder="Summer Product Launch 2025"
          className="input-field"
        />
        {errors.campaignName && <p className="mt-1 text-sm text-red-600">{errors.campaignName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Primary Objective <span className="text-red-500">*</span>
        </label>
        <select
          {...register('objective')}
          className="input-field"
        >
          <option value="awareness">Brand Awareness</option>
          <option value="traffic">Website Traffic</option>
          <option value="engagement">Engagement</option>
          <option value="leads">Lead Generation</option>
          <option value="conversions">Conversions</option>
          <option value="sales">Direct Sales</option>
        </select>
        {errors.objective && <p className="mt-1 text-sm text-red-600">{errors.objective.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Key Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('keyMessage')}
          placeholder="What's the single most important thing your audience should remember?"
          className="input-field resize-none"
          rows={4}
        />
        {errors.keyMessage && <p className="mt-1 text-sm text-red-600">{errors.keyMessage.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Unique Selling Proposition <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('uniqueSellingPoint')}
          placeholder="What makes your product/service different from competitors?"
          className="input-field resize-none"
          rows={4}
        />
        {errors.uniqueSellingPoint && <p className="mt-1 text-sm text-red-600">{errors.uniqueSellingPoint.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Target Regions <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <button
              key={region.value}
              type="button"
              onClick={() => toggleRegion(region.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                targetRegions.includes(region.value)
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400 font-medium'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
        {errors.targetRegions && <p className="mt-1 text-sm text-red-600">{errors.targetRegions.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Campaign Duration <span className="text-red-500">*</span>
        </label>
        <select
          {...register('campaignDuration')}
          className="input-field"
        >
          <option value="2weeks">2 Weeks</option>
          <option value="1month">1 Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
          <option value="ongoing">Ongoing</option>
        </select>
        {errors.campaignDuration && <p className="mt-1 text-sm text-red-600">{errors.campaignDuration.message}</p>}
      </div>
    </div>
  )
}

export default StepCampaignObjective
