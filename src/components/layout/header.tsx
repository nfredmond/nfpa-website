/**
 * Header Component
 * Main navigation header with mobile menu
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Container } from './container'
import { Button } from '../ui/button'
import { ThemeToggle } from '../ui/theme-toggle'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'Resources', href: '/resources' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      
      <Container>
        <nav className="flex items-center justify-between py-4" aria-label="Main navigation">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4E2E] dark:focus-visible:ring-green-400 rounded-md">
              <span className="sr-only">Nat Ford Planning & Design</span>
              <div className="flex items-center gap-2">
                <Image
                  src="/logos/nf-wordmark-slate.svg"
                  alt="Nat Ford Planning & Design"
                  width={220}
                  height={48}
                  priority
                  className="h-10 w-auto block dark:hidden"
                />
                <Image
                  src="/logos/nf-wordmark-white.svg"
                  alt="Nat Ford Planning & Design"
                  width={220}
                  height={48}
                  priority
                  className="h-10 w-auto hidden dark:block"
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4E2E] dark:focus-visible:ring-green-400 rounded-md px-2 py-1',
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'text-[#1F4E2E] dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#1F4E2E] dark:hover:text-green-400'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Theme Toggle & CTA Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-2 lg:items-center">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile menu button & theme toggle */}
          <div className="flex lg:hidden gap-2 items-center">
            <ThemeToggle />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-base font-semibold',
                    'transition-colors duration-300',
                    pathname === item.href
                      ? 'bg-[#F1F5F9] dark:bg-gray-800 text-[#1F4E2E] dark:text-green-400'
                      : 'text-gray-900 dark:text-gray-200 hover:bg-[#F1F5F9] dark:hover:bg-gray-800'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

