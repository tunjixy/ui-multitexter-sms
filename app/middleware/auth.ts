import { COOKIE_NAMES } from '@/repository/constant'

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie(COOKIE_NAMES.AUTH_TOKEN)
  const lastVisit = useCookie(COOKIE_NAMES.LAST_VISIT)
  lastVisit.value = to.fullPath

  if (!token.value) {
    return navigateTo('/login')
  }
})
