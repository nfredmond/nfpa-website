/**
 * Button Component
 * Accessible button with multiple variants
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      primary: 'bg-[#1F4E2E] text-white hover:bg-[#163d23] focus-visible:ring-[#1F4E2E]',
      secondary: 'bg-[#D4A63F] text-[#0F172A] hover:bg-[#c5973a] focus-visible:ring-[#D4A63F]',
      outline: 'border-2 border-[#1F4E2E] dark:border-green-400 text-[#1F4E2E] dark:text-green-400 hover:bg-[#1F4E2E] dark:hover:bg-green-400 hover:text-white dark:hover:text-gray-900 focus-visible:ring-[#1F4E2E]',
      ghost: 'text-[#0F172A] dark:text-gray-300 hover:bg-[#F1F5F9] dark:hover:bg-gray-800 focus-visible:ring-[#4C84F7]',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg',
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

