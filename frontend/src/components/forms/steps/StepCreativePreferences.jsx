const StepCreativePreferences = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form
  const selectedChannels = watch('channels') || []

  const channels = [
    { value: 'google', label: 'Google Ads' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'X (Twitter)' },
    { value: 'email', label: 'Email' },
  ]

  const toggleChannel = (val) => {
    const newChannels = selectedChannels.includes(val)
      ? selectedChannels.filter(c => c !== val)
      : [...selectedChannels, val]
    setValue('channels', newChannels, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Creative Preferences</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Guide the creative direction for your campaign.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Brand Tone <span className="text-red-500">*</span>
        </label>
        <select
          {...register('tone')}
          className="input-field"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual & Friendly</option>
          <option value="humorous">Humorous</option>
          <option value="urgent">Urgent & Action-Oriented</option>
          <option value="inspirational">Inspirational</option>
          <option value="educational">Educational</option>
        </select>
        {errors.tone && <p className="mt-1 text-sm text-red-600">{errors.tone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Advertising Channels <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {channels.map(channel => (
            <button
              key={channel.value}
              type="button"
              onClick={() => toggleChannel(channel.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                selectedChannels.includes(channel.value)
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400 font-medium'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {channel.label}
            </button>
          ))}
        </div>
        {errors.channels && <p className="mt-1 text-sm text-red-600">{errors.channels.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Visual Style <span className="text-red-500">*</span>
        </label>
        <select
          {...register('visualStyle')}
          className="input-field"
        >
          <option value="minimal">Minimal & Clean</option>
          <option value="bold">Bold & Vibrant</option>
          <option value="corporate">Corporate & Trustworthy</option>
          <option value="playful">Playful & Fun</option>
          <option value="luxury">Luxury & Premium</option>
          <option value="retro">Retro & Nostalgic</option>
        </select>
        {errors.visualStyle && <p className="mt-1 text-sm text-red-600">{errors.visualStyle.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Brand Colors (optional)
        </label>
        <input
          {...register('brandColors')}
          placeholder="#6366f1, #10b981, #f59e0b"
          className="input-field"
        />
        {errors.brandColors && <p className="mt-1 text-sm text-red-600">{errors.brandColors.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Key Competitors (optional)
        </label>
        <textarea
          {...register('competitors')}
          placeholder="List competitors we should differentiate from..."
          className="input-field resize-none"
          rows={4}
        />
        {errors.competitors && <p className="mt-1 text-sm text-red-600">{errors.competitors.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Additional Notes (optional)
        </label>
        <textarea
          {...register('additionalNotes')}
          placeholder="Any other requirements, brand guidelines, or specific requests..."
          className="input-field resize-none"
          rows={4}
        />
        {errors.additionalNotes && <p className="mt-1 text-sm text-red-600">{errors.additionalNotes.message}</p>}
      </div>
    </div>
  )
}

export default StepCreativePreferences
