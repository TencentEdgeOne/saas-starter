import { cookies } from 'next/headers'
import { createServerClient } from './supabase'
import { User } from './auth'

export async function getServerUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient()

    const accessToken = cookieStore.get('sb-access-token')?.value
    const refreshToken = cookieStore.get('sb-refresh-token')?.value

    if (!accessToken) {
      return { user: null, error: null }
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)

    if (error) {
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        })

        if (refreshError || !refreshData.session) {
          return { user: null, error: 'Session expired' }
        }

        return { user: refreshData.session.user as User, error: null }
      }
      return { user: null, error: 'Invalid token' }
    }

    return { user: user as User, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}
