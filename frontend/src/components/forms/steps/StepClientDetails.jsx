import { InputField, SelectField, TextareaField } from '../FormFields'

const industries = [
  { value: '', label: 'Select industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other', label: 'Other' },
]

const StepClientDetails = ({ form }) => {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Details</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tell us about the client and their business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Client Name"
          placeholder="John Smith"
          required
          {...register('clientName')}
          error={errors.clientName?.message}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="john@company.com"
          required
          {...register('clientEmail')}
          error={errors.clientEmail?.message}
        />
      </div>

      <InputField
        label="Company Name"
        placeholder="Acme Corporation"
        required
        {...register('companyName')}
        error={errors.companyName?.message}
      />

      <SelectField
        label="Industry"
        required
        {...register('industry')}
        error={errors.industry?.message}
      >
        {industries.map(ind => (
          <option key={ind.value} value={ind.value}>{ind.label}</option>
        ))}
      </SelectField>

      <TextareaField
        label="Target Audience"
        placeholder="Describe your ideal customer (age, interests, behaviors, pain points)..."
        required
        {...register('targetAudience')}
        error={errors.targetAudience?.message}
      />

      <InputField
        label="Total Budget (USD)"
        type="number"
        placeholder="10000"
        required
        min={100}
        {...register('budget')}
        error={errors.budget?.message}
      />
    </div>
  )
}

export default StepClientDetails
