/**
 * Header Component
 * Main navigation header with mobile menu
 */

'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Container } from './container'
import { ThemeToggle } from '../ui/theme-toggle'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Experience', href: '/projects' },
  { name: 'Resources', href: '/resources' },
  { name: 'About', href: '/about' },
  { name: 'Ethics', href: '/ethics' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)]/70 nf-glass">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Container>
        <nav className="flex items-center justify-between py-3.5" aria-label="Main navigation">
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="-m-1.5 p-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pine)]"
            >
              <span className="sr-only">Nat Ford Planning & Analysis</span>
              <div className="flex items-center gap-2">
                <Image
                  src="/logos/nf-wordmark-slate.svg"
                  alt="Nat Ford Planning & Analysis"
                  width={220}
                  height={48}
                  priority
                  className="h-10 w-auto block dark:hidden"
                />
                <Image
                  src="/logos/nf-wordmark-white.svg"
                  alt="Nat Ford Planning & Analysis"
                  width={220}
                  height={48}
                  priority
                  className="h-10 w-auto hidden dark:block"
                />
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex lg:gap-x-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-[0.95rem] transition-colors duration-300 rounded-md px-2 py-1',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pine)]',
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'text-[color:var(--pine)] font-semibold'
                    : 'text-[color:var(--foreground)]/80 hover:text-[color:var(--pine)]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-2 lg:items-center">
            <ThemeToggle />
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
            >
              Book Intro Call
            </Link>
          </div>

          <div className="flex lg:hidden gap-2 items-center">
            <ThemeToggle />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[color:var(--foreground)]/85"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-1 rounded-2xl border border-[color:var(--line)]/70 p-3 bg-[color:var(--background)]/95">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-base',
                    pathname === item.href || pathname?.startsWith(item.href + '/')
                      ? 'bg-[color:var(--sand)] text-[color:var(--pine)] font-semibold dark:bg-[#1a2632]'
                      : 'text-[color:var(--foreground)]/90 hover:bg-[color:var(--fog)] dark:hover:bg-[#17222d]'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--pine)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--pine-deep)]"
                >
                  Book Intro Call
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
