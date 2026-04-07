const StepClientDetails = ({ form }) => {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Details</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tell us about the client and their business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('clientName')}
            placeholder="John Smith"
            className="input-field"
          />
          {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register('clientEmail')}
            type="email"
            placeholder="john@company.com"
            className="input-field"
          />
          {errors.clientEmail && <p className="mt-1 text-sm text-red-600">{errors.clientEmail.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('companyName')}
          placeholder="Acme Corporation"
          className="input-field"
        />
        {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          {...register('industry')}
          className="input-field"
        >
          <option value="">Select industry</option>
          <option value="technology">Technology</option>
          <option value="ecommerce">E-Commerce</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="realestate">Real Estate</option>
          <option value="hospitality">Hospitality</option>
          <option value="automotive">Automotive</option>
          <option value="fashion">Fashion & Apparel</option>
          <option value="food">Food & Beverage</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Target Audience <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('targetAudience')}
          placeholder="Describe your ideal customer (age, interests, behaviors, pain points)..."
          className="input-field resize-none"
          rows={4}
        />
        {errors.targetAudience && <p className="mt-1 text-sm text-red-600">{errors.targetAudience.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Total Budget (USD) <span className="text-red-500">*</span>
        </label>
        <input
          {...register('budget', { valueAsNumber: true })}
          type="number"
          placeholder="10000"
          className="input-field"
          min={100}
        />
        {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
      </div>
    </div>
  )
}

export default StepClientDetails
