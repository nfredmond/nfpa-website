/**
 * Grid Component
 * Responsive grid following 12/8/4 column pattern
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export function Grid({ 
  className, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 }, 
  gap = 'md',
  children, 
  ...props 
}: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    8: 'grid-cols-8',
    12: 'grid-cols-12',
  }
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }
  
  const responsiveClasses = [
    cols.default && colClasses[cols.default as keyof typeof colClasses],
    cols.sm && `sm:${colClasses[cols.sm as keyof typeof colClasses]}`,
    cols.md && `md:${colClasses[cols.md as keyof typeof colClasses]}`,
    cols.lg && `lg:${colClasses[cols.lg as keyof typeof colClasses]}`,
    cols.xl && `xl:${colClasses[cols.xl as keyof typeof colClasses]}`,
  ].filter(Boolean).join(' ')
  
  return (
    <div 
      className={cn(
        'grid',
        responsiveClasses,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

