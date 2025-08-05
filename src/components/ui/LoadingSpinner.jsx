/**
 * Loading Spinner Component
 */
import { Loader2 } from 'lucide-react'
import { cn } from '@utils/cn'

export default function LoadingSpinner({ 
  className, 
  size = 'default',
  text = 'Loading...' 
}) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-6 w-6',
    large: 'h-8 w-8',
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 
        className={cn(
          'animate-spin text-blue-600',
          sizeClasses[size],
          className
        )} 
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}