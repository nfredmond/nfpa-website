import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { UpdatePasswordForm } from '@/components/auth/update-password-form'

export const metadata = {
  title: 'Set New Password',
}

export default function UpdatePasswordPage() {
  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 text-center">
          <h1 className="section-title text-4xl text-[color:var(--ink)]">Set New Password</h1>
          <p className="mt-4 text-[color:var(--foreground)]/80">
            After opening your email reset link, choose a new secure password below.
          </p>
          <UpdatePasswordForm />
        </div>
      </Container>
    </Section>
  )
}
