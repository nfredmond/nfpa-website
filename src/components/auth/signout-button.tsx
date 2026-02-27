'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSignOut() {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login?message=Signed out successfully.')
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" onClick={onSignOut} disabled={isLoading}>
      {isLoading ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}
