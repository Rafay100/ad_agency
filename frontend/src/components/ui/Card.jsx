import { cn } from '@/lib/utils'

export const Card = ({ children, className, ...props }) => (
  <div className={cn('card', className)} {...props}>{children}</div>
)

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('px-5 py-4 border-b border-gray-200 dark:border-gray-800', className)} {...props}>{children}</div>
)

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-base font-semibold text-gray-900 dark:text-white', className)} {...props}>{children}</h3>
)

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('mt-1 text-sm text-gray-500 dark:text-gray-400', className)} {...props}>{children}</p>
)

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('p-5', className)} {...props}>{children}</div>
)

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50', className)} {...props}>{children}</div>
)

export default Card
