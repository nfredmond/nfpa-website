import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata = {
  title: 'Reset Password',
}

export default function ResetPasswordPage() {
  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 text-center">
          <h1 className="section-title text-4xl text-[color:var(--ink)]">Reset Password</h1>
          <p className="mt-4 text-[color:var(--foreground)]/80">
            Enter your account email and we’ll send a secure link to set a new password.
          </p>
          <ResetPasswordForm />
        </div>
      </Container>
    </Section>
  )
}
