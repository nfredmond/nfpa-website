type DataDeletionStatusPageProps = {
  searchParams?: {
    code?: string
  }
}

export const metadata = {
  title: 'Facebook Data Deletion Request Status',
}

export default function DataDeletionStatusPage({ searchParams }: DataDeletionStatusPageProps) {
  const code = searchParams?.code || 'pending'

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--pine)]">Nat Ford</p>
        <h1 className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">Facebook Data Deletion Request</h1>
        <p className="mt-4 text-sm text-[color:var(--foreground)]/80">
          Your request has been received and logged. We process deletion requests promptly in accordance with Meta Platform Terms and applicable privacy requirements.
        </p>

        <div className="mt-6 rounded-xl border border-[color:var(--line)] bg-[color:var(--sand)]/25 p-4">
          <p className="text-xs uppercase tracking-[0.08em] text-[color:var(--foreground)]/65">Confirmation code</p>
          <p className="mt-1 break-all text-base font-semibold text-[color:var(--ink)]">{code}</p>
        </div>

        <div className="mt-6 space-y-2 text-sm text-[color:var(--foreground)]/78">
          <p>Status: <span className="font-medium text-[color:var(--ink)]">Received</span></p>
          <p>
            If we determine no Facebook user data is stored for your account context, the request is treated as completed with no further action required.
          </p>
          <p>
            Questions: <a className="font-medium text-[color:var(--pine)]" href="mailto:bartholomew@natfordplanning.com">bartholomew@natfordplanning.com</a>
          </p>
        </div>
      </div>
    </main>
  )
}
