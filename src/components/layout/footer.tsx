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
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-[#0F172A] dark:bg-gray-950 text-white border-t border-gray-800">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Image
                  src="/logos/nf-wordmark-slate.svg"
                  alt="Nat Ford Planning & Analysis"
                  width={220}
                  height={48}
                  className="h-10 w-auto block dark:hidden"
                />
                <Image
                  src="/logos/nf-wordmark-white.svg"
                  alt="Nat Ford Planning & Analysis"
                  width={220}
                  height={48}
                  className="h-10 w-auto hidden dark:block"
                />
              </div>
              <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed max-w-md mb-4">
                Data-driven urban planning, GIS, and aerial insights for Northern California communities.
              </p>
              <div className="flex gap-4">
                <a
                  href="mailto:nfredmond@gmail.com"
                  className="text-gray-300 dark:text-gray-400 hover:text-[#D4A63F] transition-colors duration-300"
                  aria-label="Email Nat Ford"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/nfredmond"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 dark:text-gray-400 hover:text-[#D4A63F] transition-colors duration-300"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Services Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-300 dark:text-gray-400">
                © {currentYear} Nat Ford Planning & Analysis. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/privacy"
                  className="text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

