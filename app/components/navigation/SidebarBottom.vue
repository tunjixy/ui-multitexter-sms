<template>
  <div class="border-border shrink-0 border-t p-3">
    <UiDropdownMenu
      :items="accountItems"
      placement="top-start"
      class="w-54!"
      @select="onAccountSelect"
    >
      <button
        type="button"
        class="border-border bg-surface hover:border-foreground/20 aria-expanded:border-foreground/20 focus-visible:outline-primary flex w-full cursor-pointer items-center gap-3 rounded-lg border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span
          class="bg-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-black"
        >
          <template v-if="initials">{{ initials }}</template>
          <User v-else :size="16" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-medium">
            {{ name }}
          </span>
          <span
            v-if="email"
            class="text-muted-foreground block truncate text-xs"
          >
            {{ email }}
          </span>
        </span>
        <ChevronsUpDown :size="16" class="text-muted-foreground shrink-0" />
      </button>
    </UiDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { ChevronsUpDown, LogOut, User } from '@lucide/vue'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const emit = defineEmits(['close'])

const { user } = storeToRefs(useUserStore())

const name = computed(() => user.value?.firstname)
const email = computed(() => user.value?.email)
const initials = computed(() => name.value?.charAt(0))

const accountItems: DropdownMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { type: 'divider' },
  { id: 'logout', label: 'Log out', icon: LogOut, danger: true },
]

const onAccountSelect = ({ id }: DropdownMenuAction) => {
  navigateTo(id === 'logout' ? '/logout' : '/dashboard/profile')
  emit('close')
}
</script>
