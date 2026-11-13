<template>
  <div class="space-y-6">
    <section class="border-border bg-surface rounded-2xl border p-6">
      <h2 class="font-semibold">Appearance</h2>
      <p class="text-muted-foreground mt-1 text-sm">
        Choose how Multitexter looks on this device.
      </p>

      <div class="mt-5">
        <div class="sr-only">Theme</div>
        <div class="grid gap-4 sm:grid-cols-3">
          <label
            v-for="theme in themes"
            :key="theme.value"
            class="border-border has-checked:border-primary has-checked:ring-primary/20 has-focus-visible:ring-primary/35 hover:not-has-checked:border-muted-foreground cursor-pointer rounded-xl border p-3 transition-[border-color,box-shadow] has-checked:ring-3 has-focus-visible:ring-3"
          >
            <input
              v-model="colorMode.preference"
              type="radio"
              name="theme"
              :value="theme.value"
              class="sr-only"
            />

            <span
              aria-hidden="true"
              :class="['border-border block h-16 rounded-lg border', theme.preview]"
            />

            <span class="mt-3 flex items-center gap-2">
              <component
                :is="theme.icon"
                class="text-muted-foreground size-4 shrink-0"
              />
              <span class="text-sm font-medium">{{ theme.label }}</span>
              <CircleCheckIcon
                v-if="colorMode.preference === theme.value"
                class="text-primary ml-auto size-4 shrink-0"
              />
            </span>
            <span class="text-muted-foreground mt-0.5 block text-xs">
              {{ theme.description }}
            </span>
          </label>
        </div>
      </div>
    </section>

    <section
      class="border-border bg-surface flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-6"
    >
      <div class="flex items-start gap-3">
        <span
          class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
        >
          <KeyRoundIcon class="size-5" />
        </span>
        <div>
          <h2 class="font-semibold">Password</h2>
          <p class="text-muted-foreground mt-1 max-w-md text-sm">
            Change the password you use to log in. You'll need your current
            password to do this.
          </p>
        </div>
      </div>
      <UiButton variant="outline" radius="lg" @click="changingPassword = true">
        Change password
      </UiButton>
    </section>

    <ChangePasswordModal v-model:open="changingPassword" />
  </div>
</template>

<script setup lang="ts">
import {
  CircleCheckIcon,
  KeyRoundIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from '@lucide/vue'

const colorMode = useColorMode()
const changingPassword = ref(false)

const themes = [
  {
    value: 'system',
    label: 'System',
    description: 'Match your device setting',
    icon: MonitorIcon,
    preview:
      'bg-linear-to-br from-[#f5f5f5] from-50% to-[#08090a] to-50%',
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Always use light mode',
    icon: SunIcon,
    preview: 'bg-[#f5f5f5]',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use dark mode',
    icon: MoonIcon,
    preview: 'bg-[#08090a]',
  },
]
</script>
