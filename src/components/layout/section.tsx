/**
 * Section Component
 * Semantic section with consistent spacing
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export function Section({ 
  className, 
  spacing = 'lg', 
  children, 
  ...props 
}: SectionProps) {
  const spacings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32',
  }
  
  return (
    <section 
      className={cn(
        spacings[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

