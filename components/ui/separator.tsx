import React from 'react'
import { cn } from '@/lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  const base = orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'
  return (
    <div
      role="separator"
      className={cn(base, 'bg-border', className)}
      {...props}
    />
  )
}

export default Separator