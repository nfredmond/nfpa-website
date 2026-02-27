import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login',
}

type LoginPageProps = {
  searchParams?: {
    redirect?: string
    message?: string
  }
}

function normalizeRedirectPath(input?: string) {
  if (!input || !input.startsWith('/')) return '/portal'
  return input
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectPath = normalizeRedirectPath(searchParams?.redirect)
  const infoMessage = searchParams?.message

  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 text-center">
          <h1 className="section-title text-4xl text-[color:var(--ink)]">Customer Login</h1>
          <p className="mt-4 text-[color:var(--foreground)]/80">
            Sign in to access your portal, project updates, and account tools.
          </p>
          <LoginForm redirectPath={redirectPath} infoMessage={infoMessage} />
        </div>
      </Container>
    </Section>
  )
}
