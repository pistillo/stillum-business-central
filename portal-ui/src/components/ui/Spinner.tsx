import React from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    }

    return (
      <div
        ref={ref}
        className={cn('border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin', sizes[size], className)}
        {...props}
      />
    )
  }
)

Spinner.displayName = 'Spinner'

export default Spinner
