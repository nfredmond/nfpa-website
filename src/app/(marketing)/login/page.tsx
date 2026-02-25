import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <Section spacing="xl">
      <Container>
        <div className="max-w-2xl mx-auto rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 text-center">
          <h1 className="section-title text-4xl text-[color:var(--ink)]">Client Portal Coming Soon</h1>
          <p className="mt-4 text-[color:var(--foreground)]/80">
            Secure account access is currently being configured. For files and updates, please contact us directly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href="mailto:nathaniel@natfordplanning.com">Email Support</a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Page</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
