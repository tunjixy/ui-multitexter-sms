<template>
  <div
    class="border-border flex flex-col items-center justify-center gap-2 border-t px-5 py-4 sm:flex-row sm:justify-between"
  >
    <p class="text-muted-foreground text-xs">
      Page {{ currentPage }} of {{ totalPages }}
    </p>

    <div class="flex items-center gap-1 md:gap-2">
      <button
        type="button"
        aria-label="Previous page"
        class="hover:bg-grey dark:hover:bg-grey/10 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="emit('previous')"
      >
        <ChevronLeftIcon class="size-4.5" />
      </button>

      <template
        v-for="(page, index) in displayedPages"
        :key="page === '...' ? `ellipsis-${index}` : page"
      >
        <span v-if="page === '...'" class="px-2 text-sm"> ... </span>
        <button
          v-else
          type="button"
          :aria-label="`Page ${page}`"
          :aria-current="currentPage === page ? 'page' : undefined"
          :class="[
            'flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm font-bold transition-colors',
            currentPage === page
              ? 'bg-surface text-primary'
              : 'hover:bg-grey dark:hover:bg-grey/10 border-border border',
          ]"
          @click="emit('goto', page as number)"
        >
          {{ page }}
        </button>
      </template>

      <button
        type="button"
        aria-label="Next page"
        class="hover:bg-grey dark:hover:bg-grey/10 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="currentPage === totalPages"
        @click="emit('next')"
      >
        <ChevronRightIcon class="size-4.5" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5,
})

const emit = defineEmits<{
  previous: []
  next: []
  goto: [page: number]
}>()

const displayedPages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages
  const pages: (number | string)[] = []

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  const sideWidth = Math.floor((maxVisible - 3) / 2)
  const rightWidth = total - current

  if (current <= sideWidth + 2) {
    for (let i = 1; i <= sideWidth + 3; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  } else if (rightWidth <= sideWidth + 1) {
    pages.push(1)
    pages.push('...')
    for (let i = total - (sideWidth + 2); i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push('...')
    for (let i = current - sideWidth; i <= current + sideWidth; i++) {
      pages.push(i)
    }
    pages.push('...')
    pages.push(total)
  }

  return pages
})
</script>
