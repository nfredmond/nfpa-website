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
  { name: 'Open Source', href: '/open-source' },
  { name: 'Projects', href: '/products' },
  { name: 'Services', href: '/services' },
  { name: 'Planning Work', href: '/projects' },
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
              <div className="flex items-center gap-3">
                <div className="nf-brand-plaque hidden sm:flex">
                  <Image
                    src="/logos/nf-monogram-square-light.png"
                    alt="Nat Ford monogram"
                    width={512}
                    height={512}
                    priority
                    className="block h-10 w-10 dark:hidden"
                  />
                  <Image
                    src="/logos/nf-monogram-square-dark.png"
                    alt=""
                    aria-hidden="true"
                    width={512}
                    height={512}
                    className="hidden h-10 w-10 dark:block"
                  />
                </div>

                <div className="flex flex-col">
                  <Image
                    src="/logos/nf-wordmark-light.png"
                    alt="Nat Ford Planning & Analysis"
                    width={2048}
                    height={683}
                    priority
                    className="block h-12 w-auto dark:hidden md:h-14"
                  />
                  <Image
                    src="/logos/nf-wordmark-dark.png"
                    alt=""
                    aria-hidden="true"
                    width={2048}
                    height={683}
                    className="hidden h-12 w-auto dark:block md:h-14"
                  />
                  <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground)]/62 md:block">
                    Open-source planning, GIS, AI, and delivery systems
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex lg:gap-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pine)]',
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'bg-[color:var(--sand)] text-[color:var(--pine)] dark:bg-[#18232d]'
                    : 'text-[color:var(--foreground)]/76 hover:text-[color:var(--pine)]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-2 lg:items-center">
            <ThemeToggle />
            <Link
              href="/contact?topic=open-source-support"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--copper)]/55 bg-[color:var(--copper)]/12 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:border-[color:var(--copper)] hover:bg-[color:var(--copper)]/18 hover:text-[color:var(--ink)] dark:text-white"
            >
              Get Support
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
                  href="/contact?topic=open-source-support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--pine)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--pine-deep)]"
                >
                  Get Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
