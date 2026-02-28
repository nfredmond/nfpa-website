/**
 * Footer Component
 * Site footer with links and contact information
 */

import * as React from 'react'
import Link from 'next/link'
import { Mail, Linkedin } from 'lucide-react'
import { Container } from './container'
import Image from 'next/image'

const footerLinks = {
  services: [
    { name: 'Urban & Transportation Planning', href: '/services/planning' },
    { name: 'GIS & Spatial Analysis', href: '/services/gis' },
    { name: 'Aerial Mapping', href: '/services/aerial' },
    { name: 'Grant Services', href: '/services/grants' },
    { name: 'AI Documentation', href: '/services/ai' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resources', href: '/resources' },
    { name: 'Our Process', href: '/process' },
    { name: 'Ethics & AI Disclosure', href: '/ethics' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:var(--fog)] text-[color:var(--ink)] dark:bg-[#0f1720] dark:text-white">
      <Container>
        <div className="py-14 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Image
                  src="/logos/nf-wordmark-slate.svg"
                  alt="Nat Ford Planning & Analysis"
                  width={692}
                  height={130}
                  className="block h-10 w-auto drop-shadow-[0_1px_0_rgba(255,255,255,0.35)] dark:hidden"
                />
                <Image
                  src="/logos/nf-wordmark-white.svg"
                  alt="Nat Ford Planning & Analysis"
                  width={712}
                  height={134}
                  className="hidden h-10 w-auto drop-shadow-[0_1px_0_rgba(0,0,0,0.35)] dark:block"
                />
              </div>

              <p className="mb-4 max-w-md text-sm leading-relaxed text-[color:var(--foreground)]/72 dark:text-white/70">
                Strategy-level planning, GIS, and software for communities that need clear decisions, fundable projects,
                and delivery confidence.
              </p>

              <div className="flex gap-4">
                <a
                  href="mailto:nathaniel@natfordplanning.com"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--foreground)]/80 transition hover:border-[color:var(--copper)] hover:text-[color:var(--copper)] dark:border-white/20 dark:text-white/80"
                  aria-label="Email Nat Ford"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/in/nfredmond"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--foreground)]/80 transition hover:border-[color:var(--copper)] hover:text-[color:var(--copper)] dark:border-white/20 dark:text-white/80"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold tracking-wide text-[color:var(--ink)] dark:text-white">Services</h3>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--foreground)]/72 transition-colors duration-300 hover:text-[color:var(--pine)] dark:text-white/70 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold tracking-wide text-[color:var(--ink)] dark:text-white">Company</h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--foreground)]/72 transition-colors duration-300 hover:text-[color:var(--pine)] dark:text-white/70 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--line)]/80 pt-7 dark:border-white/15 md:flex-row">
            <p className="text-sm text-[color:var(--foreground)]/68 dark:text-white/65">© {currentYear} Nat Ford LLC. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[color:var(--foreground)]/68 transition-colors duration-300 hover:text-[color:var(--pine)] dark:text-white/65 dark:hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[color:var(--foreground)]/68 transition-colors duration-300 hover:text-[color:var(--pine)] dark:text-white/65 dark:hover:text-white"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
