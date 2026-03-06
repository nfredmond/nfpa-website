import { getSupabaseAdminClient } from '@/lib/supabase/admin'

type AdminActionStatus = 'success' | 'error' | 'denied' | 'started'

export async function logAdminAction(params: {
  actorUserId?: string | null
  actorEmail?: string | null
  action: string
  target?: string | null
  status: AdminActionStatus
  metadata?: Record<string, unknown>
}) {
  const admin = getSupabaseAdminClient()
  if (!admin) {
    return
  }

  const actorEmail = params.actorEmail?.trim().toLowerCase() ?? 'unknown'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase admin DB client uses generated table types not yet wired in this repo.
  const adminClient = admin as any

  const { error } = await adminClient.from('admin_action_log').insert({
    actor_user_id: params.actorUserId ?? null,
    actor_email: actorEmail,
    action: params.action,
    target: params.target ?? null,
    status: params.status,
    metadata: params.metadata ?? {},
  })

  if (error) {
    console.error('admin action log insert failed', {
      action: params.action,
      target: params.target,
      status: params.status,
      actorEmail,
      error: error.message,
    })
  }
}
