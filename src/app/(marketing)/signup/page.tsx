import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata = {
  title: 'Sign Up',
}

type SignupPageProps = {
  searchParams?: {
    redirect?: string
  }
}

function normalizeRedirectPath(input?: string) {
  if (!input || !input.startsWith('/')) return '/portal'
  return input
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const redirectPath = normalizeRedirectPath(searchParams?.redirect)

  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 text-center">
          <h1 className="section-title text-4xl text-[color:var(--ink)]">Create Customer Account</h1>
          <p className="mt-4 text-[color:var(--foreground)]/80">
            Set up your login now so you can access secure project updates and future account features.
          </p>
          <SignupForm redirectPath={redirectPath} />
        </div>
      </Container>
    </Section>
  )
}
