<template>
  <div>
    <div
      v-if="show"
      class="fixed top-0 right-0 z-2147483647 h-full w-full bg-black/70 backdrop-blur-sm"
      @click="$emit('close')"
    />

    <transition name="slide-nav" mode="out-in">
      <div
        v-if="show"
        class="bg-background border-border fixed top-0 left-0 z-2147483647 flex h-full w-64 border-r"
      >
        <div class="flex w-full flex-col">
          <SidebarTop closable @close="$emit('close')" />
          <SidebarMenu :menus="menus" @close="$emit('close')" />
          <SidebarBottom @close="$emit('close')" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from '@/types/dashboard'

const props = defineProps<{
  show: boolean
  menus: Menu[]
}>()

defineEmits(['close'])

const { show } = toRefs(props)

onUnmounted(() => {
  if (show.value) {
    document.body.style.removeProperty('overflow')
  }
})

watch(show, (value) => {
  if (value) {
    document.body.style.setProperty('overflow', 'hidden')
  } else {
    document.body.style.removeProperty('overflow')
  }
})
</script>
