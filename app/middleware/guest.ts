import { COOKIE_NAMES } from '@/repository/constant'

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie(COOKIE_NAMES.AUTH_TOKEN)

  if (token.value) {
    return navigateTo('/dashboard')
  }
})
