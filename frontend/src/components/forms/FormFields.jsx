import { cn } from '@/lib/utils'

export const InputField = ({ label, error, icon, className, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'input-field',
          icon && 'pl-10',
          error && 'border-red-500 focus:ring-red-500'
        )}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
  </div>
)

export const SelectField = ({ label, error, children, className, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      className={cn('input-field', error && 'border-red-500 focus:ring-red-500')}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
  </div>
)

export const TextareaField = ({ label, error, className, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      rows={4}
      className={cn('input-field resize-none', error && 'border-red-500 focus:ring-red-500')}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
  </div>
)

export const MultiSelect = ({ label, options, value, onChange, error, className }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (isSelected) {
                onChange(value.filter(v => v !== option.value))
              } else {
                onChange([...value, option.value])
              }
            }}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg border transition-colors',
              isSelected
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400 font-medium'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
    {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
  </div>
)
