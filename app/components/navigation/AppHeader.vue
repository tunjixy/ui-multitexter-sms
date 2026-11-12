<template>
  <header class="sticky top-0 z-2147483647">
    <nav class="backdrop-blur-lg backdrop-saturate-180">
      <div
        class="bg-primary/50 text-dark-blue flex min-h-8 items-center dark:text-white"
      >
        <div class="wrapper flex items-center gap-3 py-2">
          <a
            href="tel:+2348148734028"
            class="flex items-center gap-2 text-xs font-medium"
          >
            <Phone :size="16" color="#5ebb46" class="shrink-0" />
            Mon - Fri (8am-6pm) 08148734028 Calls/WhatsApp Only
          </a>
          <a
            href="mailto:support@multitexter.com"
            class="flex items-center gap-2 text-xs"
          >
            <Mail :size="16" color="#5ebb46" />
            support@multitexter.com
          </a>
        </div>
      </div>

      <div class="bg-background/80 border-border border-b">
        <div class="wrapper flex h-15 items-center justify-between gap-2">
          <AppLogo />

          <ul class="hidden lg:flex lg:items-end lg:gap-8">
            <li v-for="menu in menus" :key="menu.id">
              <NuxtLink
                :to="menu.url"
                :target="menu.external ? '_blank' : undefined"
                class="text-muted-foreground text-sm font-medium transition-colors ease-in hover:text-black dark:hover:text-white"
              >
                {{ menu.title }}
              </NuxtLink>
            </li>
          </ul>

          <div class="flex items-center gap-3">
            <ColorScheme placeholder="..." tag="span">
              <button
                class="hover:bg-grey dark:hover:bg-grey/5 flex size-8 cursor-pointer items-center justify-center rounded transition-all ease-in"
                type="button"
                @click="
                  toggleTheme(colorMode.value === 'dark' ? 'light' : 'dark')
                "
              >
                <Moon v-if="colorMode.value === 'light'" :size="18" />
                <Sun v-else :size="18" />
              </button>
            </ColorScheme>

            <div class="hidden items-center gap-2 md:flex">
              <template v-if="!isLoggedIn">
                <NuxtLink
                  to="/login"
                  class="hover:text-primary hover:bg-primary/5 flex h-9 items-center rounded-lg px-4 text-sm font-semibold transition-all ease-in"
                >
                  Sign In
                </NuxtLink>
                <NuxtLink
                  to="/signup"
                  class="bg-primary hover:bg-primary/85 flex h-9 items-center rounded-lg px-4 text-sm font-semibold text-black transition-all ease-in"
                >
                  Sign Up
                </NuxtLink>
              </template>

              <NuxtLink
                v-else
                to="/dashboard"
                class="bg-primary hover:bg-primary/60 flex min-h-9 items-center rounded px-6 text-white transition-all ease-in"
              >
                Go To Dashboard
              </NuxtLink>
            </div>
            <button
              class="hover:bg-grey dark:hover:bg-grey/5 flex size-8 cursor-pointer items-center justify-center rounded transition-all ease-in lg:hidden"
              type="button"
              aria-controls="mobile-nav"
              :aria-expanded="isMobileNavToggled"
              :aria-label="isMobileNavToggled ? 'Close menu' : 'Open menu'"
              @click="isMobileNavToggled = !isMobileNavToggled"
            >
              <Menu v-show="!isMobileNavToggled" :size="20" />
              <X v-show="isMobileNavToggled" :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile navigation -->
      <Transition name="slide-down">
        <div
          v-if="isMobileNavToggled"
          id="mobile-nav"
          class="bg-background absolute inset-x-0 top-full flex h-[calc(100dvh-100%)] flex-col lg:hidden"
        >
          <ul class="wrapper flex-1 overflow-y-auto py-4">
            <li v-for="menu in menus" :key="menu.id">
              <NuxtLink
                :to="menu.url"
                :target="menu.external ? '_blank' : undefined"
                class="hover:bg-grey/40 dark:hover:bg-grey/5 flex items-center justify-between rounded px-2 py-3 text-sm font-medium transition-colors ease-in-out"
                @click="isMobileNavToggled = false"
              >
                {{ menu.title }}
                <ArrowUpRight
                  v-if="menu.external"
                  :size="16"
                  class="text-muted-foreground"
                />
              </NuxtLink>
            </li>
          </ul>

          <div
            class="wrapper border-border flex flex-col gap-2 border-t py-4 md:hidden"
          >
            <template v-if="!isLoggedIn">
              <NuxtLink
                to="/login"
                class="border-border bg-surface hover:text-primary hover:bg-primary/5 flex h-11 items-center justify-center rounded border text-sm font-semibold transition-all ease-in"
                @click="isMobileNavToggled = false"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/signup"
                class="bg-primary hover:bg-primary/60 flex h-11 items-center justify-center rounded text-sm font-semibold text-white transition-all ease-in"
                @click="isMobileNavToggled = false"
              >
                Sign Up
              </NuxtLink>
            </template>
            <NuxtLink
              v-else
              to="/dashboard"
              class="bg-primary hover:bg-primary/60 flex h-11 items-center justify-center rounded text-sm font-semibold text-white transition-all ease-in"
              @click="isMobileNavToggled = false"
            >
              Go to Dashboard
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Phone, Mail, Menu, X, Moon, Sun, ArrowUpRight } from '@lucide/vue'

interface Menu {
  id: string
  title: string
  url: string
  external?: boolean
}

const colorMode = useColorMode()
const { isLoggedIn } = storeToRefs(useUserStore())

const isMobileNavToggled = ref(false)
const menus: Menu[] = [
  {
    id: 'send-sms',
    title: 'Send SMS',
    url: '/dashboard/compose-sms',
  },
  {
    id: 'pricing',
    title: 'Pricing',
    url: '/pricing',
  },
  {
    id: 'developers',
    title: 'Developers',
    url: '/developers',
  },
  {
    id: 'contact-sales',
    title: 'Contact Sales',
    url: '/contact-sales',
  },
  {
    id: 'blog',
    title: 'Blog',
    url: '/blog',
  },
]

const toggleTheme = (theme: string) => {
  colorMode.preference = theme
}

onKeyStroke('Escape', () => {
  isMobileNavToggled.value = false
})
</script>
