import { skipHydrate } from 'pinia'
import { StorageSerializers } from '@vueuse/core'
import type { User, UserDetail } from '@/types/user'
import { COOKIE_NAMES } from '@/repository/constant'

export const useUserStore = defineStore('user', () => {
  const token = useCookie<string | null>(COOKIE_NAMES.AUTH_TOKEN)
  // const lastVisit = useCookie<string | null>(COOKIE_NAMES.LAST_VISIT)
  const user = useLocalStorage<User | null>('user', null, {
    serializer: StorageSerializers.object,
  })
  const userDetail = ref<UserDetail | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const clearSession = () => {
    user.value = null
    token.value = null
    // lastVisit.value = null
  }

  return { user: skipHydrate(user), userDetail, isLoggedIn, clearSession }
})
