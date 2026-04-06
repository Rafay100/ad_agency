import { cn } from '@/lib/utils'

const steps = [
  { id: 1, label: 'Client Details' },
  { id: 2, label: 'Campaign Objective' },
  { id: 3, label: 'Creative Preferences' },
  { id: 4, label: 'Review & Submit' },
]

const StepIndicator = ({ currentStep }) => {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = currentStep > step.id
          const isCurrent = currentStep === step.id

          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-2 transition-colors',
                    isComplete ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                )}

                <div className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  isComplete && 'bg-primary-600 border-primary-600',
                  isCurrent && 'border-primary-600 bg-white dark:bg-gray-900',
                  !isComplete && !isCurrent && 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                )}>
                  {isComplete ? (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {step.id}
                    </span>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-2 transition-colors',
                    currentStep > step.id + 0.5 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                )}
              </div>

              <span className={cn(
                'mt-2 text-xs font-medium text-center hidden sm:block',
                isCurrent ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
              )}>
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default StepIndicator
