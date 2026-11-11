import { apiClient } from '@/repository/api'
import type { LoginRes } from '@/types/auth'
import { COOKIE_NAMES } from '@/repository/constant'

export default function useAuth() {
  const { user, userDetail } = storeToRefs(useUserStore())

  const persistSession = (response: LoginRes) => {
    // Check for last visit, capture it, then clear the cookie
    const lastVisit = useCookie(COOKIE_NAMES.LAST_VISIT)
    const redirectTo = lastVisit.value
    lastVisit.value = null

    const token = useCookie(COOKIE_NAMES.AUTH_TOKEN)
    token.value = response.token
    user.value = response.data

    fetchUserDetails(response.token)

    if (redirectTo) {
      return navigateTo(redirectTo)
    }
    return navigateTo('/dashboard/compose-sms')
  }

  const fetchUserDetails = async (token?: string) => {
    try {
      const response = await apiClient.user.detail(
        token ? { authorization: `Bearer ${token}` } : undefined,
      )
      if (response) {
        userDetail.value = response.success
      }
    } catch {
      //
    }
  }

  return {
    persistSession,
    fetchUserDetails,
  }
}
