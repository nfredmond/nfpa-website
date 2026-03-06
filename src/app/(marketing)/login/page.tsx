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
  const isAdminRedirect = redirectPath.startsWith('/admin')

  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 text-center">
          <h1 className="section-title text-4xl text-[color:var(--ink)]">Customer Login</h1>
          <p className="mt-4 text-[color:var(--foreground)]/80">
            Sign in to access your portal, project updates, and account tools.
          </p>

          {isAdminRedirect && (
            <div className="mt-4 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
              <p className="font-semibold">Admin access checklist</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Use <strong>Continue with Google</strong> for the allowlisted operations account.</li>
                <li>Complete MFA so your session reaches AAL2.</li>
                <li>After login, you will return to the admin control center automatically.</li>
              </ul>
            </div>
          )}

          <LoginForm redirectPath={redirectPath} infoMessage={infoMessage} />
        </div>
      </Container>
    </Section>
  )
}
