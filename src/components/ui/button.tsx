/**
 * Button Component
 * Accessible button with variants + optional asChild rendering
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-[color:var(--pine)] text-white hover:bg-[color:var(--pine-deep)] focus-visible:ring-[color:var(--pine)]',
      secondary:
        'bg-[color:var(--copper)] text-[#1f2428] hover:brightness-105 focus-visible:ring-[color:var(--copper)]',
      outline:
        'border border-[color:var(--line)] text-[color:var(--foreground)] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)] focus-visible:ring-[color:var(--pine)]',
      ghost:
        'text-[color:var(--foreground)] hover:bg-[color:var(--fog)] dark:hover:bg-[#15222d] focus-visible:ring-[color:var(--pine)]',
    }

    const sizes = {
      sm: 'h-9 px-3.5 text-sm rounded-full',
      md: 'h-10 px-4.5 text-sm rounded-full',
      lg: 'h-12 px-6 text-base rounded-full',
    }

    const mergedClassName = cn(baseStyles, variants[variant], sizes[size], className)

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        className: cn(mergedClassName, child.props.className),
      })
    }

    return (
      <button className={mergedClassName} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
