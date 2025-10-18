/**
 * Marketing Layout
 * Layout for public marketing pages with header and footer
 */

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}

