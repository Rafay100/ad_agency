import { InputField, SelectField, TextareaField, MultiSelect } from '../FormFields'

const objectives = [
  { value: '', label: 'Select objective' },
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'traffic', label: 'Website Traffic' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'leads', label: 'Lead Generation' },
  { value: 'conversions', label: 'Conversions' },
  { value: 'sales', label: 'Direct Sales' },
]

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

const durations = [
  { value: '', label: 'Select duration' },
  { value: '2weeks', label: '2 Weeks' },
  { value: '1month', label: '1 Month' },
  { value: '3months', label: '3 Months' },
  { value: '6months', label: '6 Months' },
  { value: 'ongoing', label: 'Ongoing' },
]

const StepCampaignObjective = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form
  const targetRegions = watch('targetRegions') || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Campaign Objective</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Define what this campaign should achieve.</p>
      </div>

      <InputField
        label="Campaign Name"
        placeholder="Summer Product Launch 2025"
        required
        {...register('campaignName')}
        error={errors.campaignName?.message}
      />

      <SelectField
        label="Primary Objective"
        required
        {...register('objective')}
        error={errors.objective?.message}
      >
        {objectives.map(obj => (
          <option key={obj.value} value={obj.value}>{obj.label}</option>
        ))}
      </SelectField>

      <TextareaField
        label="Key Message"
        placeholder="What's the single most important thing your audience should remember?"
        required
        {...register('keyMessage')}
        error={errors.keyMessage?.message}
      />

      <TextareaField
        label="Unique Selling Proposition"
        placeholder="What makes your product/service different from competitors?"
        required
        {...register('uniqueSellingPoint')}
        error={errors.uniqueSellingPoint?.message}
      />

      <MultiSelect
        label="Target Regions"
        options={regions}
        value={targetRegions}
        onChange={(val) => setValue('targetRegions', val, { shouldValidate: true })}
        error={errors.targetRegions?.message}
      />

      <SelectField
        label="Campaign Duration"
        required
        {...register('campaignDuration')}
        error={errors.campaignDuration?.message}
      >
        {durations.map(d => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </SelectField>
    </div>
  )
}

export default StepCampaignObjective
