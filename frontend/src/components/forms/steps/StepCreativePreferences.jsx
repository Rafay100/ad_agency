import { SelectField, TextareaField, MultiSelect, InputField } from '../FormFields'

const tones = [
  { value: '', label: 'Select tone' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'urgent', label: 'Urgent & Action-Oriented' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational', label: 'Educational' },
]

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

const visualStyles = [
  { value: '', label: 'Select visual style' },
  { value: 'minimal', label: 'Minimal & Clean' },
  { value: 'bold', label: 'Bold & Vibrant' },
  { value: 'corporate', label: 'Corporate & Trustworthy' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'luxury', label: 'Luxury & Premium' },
  { value: 'retro', label: 'Retro & Nostalgic' },
]

const StepCreativePreferences = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form
  const selectedChannels = watch('channels') || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Creative Preferences</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Guide the creative direction for your campaign.</p>
      </div>

      <SelectField
        label="Brand Tone"
        required
        {...register('tone')}
        error={errors.tone?.message}
      >
        {tones.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </SelectField>

      <MultiSelect
        label="Advertising Channels"
        options={channels}
        value={selectedChannels}
        onChange={(val) => setValue('channels', val, { shouldValidate: true })}
        error={errors.channels?.message}
      />

      <SelectField
        label="Visual Style"
        required
        {...register('visualStyle')}
        error={errors.visualStyle?.message}
      >
        {visualStyles.map(v => (
          <option key={v.value} value={v.value}>{v.label}</option>
        ))}
      </SelectField>

      <InputField
        label="Brand Colors (optional)"
        placeholder="#6366f1, #10b981, #f59e0b"
        {...register('brandColors')}
        error={errors.brandColors?.message}
      />

      <TextareaField
        label="Key Competitors (optional)"
        placeholder="List competitors we should differentiate from..."
        {...register('competitors')}
        error={errors.competitors?.message}
      />

      <TextareaField
        label="Additional Notes (optional)"
        placeholder="Any other requirements, brand guidelines, or specific requests..."
        {...register('additionalNotes')}
        error={errors.additionalNotes?.message}
      />
    </div>
  )
}

export default StepCreativePreferences
