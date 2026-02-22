import React from 'react'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, name = '', src, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-full font-semibold bg-blue-600 text-white',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" /> : getInitials(name)}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
