<template>
  <nav
    aria-label="Dashboard"
    class="scrollbar-thumb-border flex-1 scrollbar-thin scrollbar-track-transparent overflow-y-auto px-3 py-2"
  >
    <ul class="flex flex-col gap-4">
      <li v-for="menu in menus" :key="menu.title">
        <template v-if="isGroup(menu)">
          <button
            type="button"
            :aria-expanded="isOpen(menu.title)"
            :aria-controls="groupId(menu.title)"
            class="focus-visible:outline-primary flex w-full cursor-pointer items-center justify-between rounded px-3 py-1 text-[11px] font-medium tracking-wider uppercase transition-colors focus-visible:outline-2"
            @click="toggle(menu.title)"
          >
            {{ menu.title }}
            <ChevronDown
              :size="14"
              class="transition-transform duration-200"
              :class="{ '-rotate-90': !isOpen(menu.title) }"
            />
          </button>

          <div
            :id="groupId(menu.title)"
            class="grid transition-all duration-200 ease-out motion-reduce:transition-none"
            :class="
              isOpen(menu.title)
                ? 'visible grid-rows-[1fr]'
                : 'invisible grid-rows-[0fr]'
            "
          >
            <div class="overflow-hidden">
              <ul class="flex flex-col gap-0.5 pt-1">
                <li v-for="link in menu.subMenus" :key="link.url">
                  <NuxtLink
                    :to="link.url"
                    :class="linkClass"
                    :exact-active-class="activeClass"
                    @click="$emit('close')"
                  >
                    <component :is="link.icon" :size="18" class="shrink-0" />
                    <span class="truncate">{{ link.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </template>

        <NuxtLink
          v-else
          :to="menu.url"
          :class="linkClass"
          :exact-active-class="activeClass"
          @click="$emit('close')"
        >
          <component :is="menu.icon" :size="18" class="shrink-0" />
          <span class="truncate">{{ menu.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { Menu, MenuGroup } from '@/types/dashboard'

const props = defineProps<{ menus: Menu[] }>()

defineEmits(['close'])

const route = useRoute()

const linkClass =
  'flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors ' +
  'hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary'
const activeClass =
  'router-link-exact-active border-border! bg-surface shadow-xs'

const isGroup = (menu: Menu): menu is MenuGroup => 'subMenus' in menu
const groupId = (title: string) =>
  `sidebar-group-${title.toLowerCase().replace(/\s+/g, '-')}`

const openGroups = ref(
  new Set(
    props.menus
      .filter(isGroup)
      .filter(
        (group) =>
          group.showMenu ||
          group.subMenus.some((link) => link.url === route.path),
      )
      .map((group) => group.title),
  ),
)
const isOpen = (title: string) => openGroups.value.has(title)
const toggle = (title: string) => {
  if (!openGroups.value.delete(title)) openGroups.value.add(title)
}
</script>
