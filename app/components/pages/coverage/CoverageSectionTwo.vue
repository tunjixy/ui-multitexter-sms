<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <div
        class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p
            class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
          >
            Destinations
          </p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Find your destination
          </h2>
        </div>

        <UiInput
          v-if="coverages.length"
          v-model="query"
          type="search"
          placeholder="Search countries…"
          aria-label="Search countries"
          class="sm:w-72"
        >
          <template #leading>
            <Search class="size-4" />
          </template>
        </UiInput>
      </div>

      <EmptyState
        v-if="!coverages.length"
        :icon="Globe"
        title="No coverage available yet"
        description="We couldn't find any coverage data right now. Please check back soon."
        class="mt-8"
      />

      <template v-else>
        <p class="text-muted-foreground mt-8 text-sm" aria-live="polite">
          {{ summary }}
        </p>

        <EmptyState
          v-if="!filtered.length"
          :icon="SearchX"
          title="No matching countries"
          class="mt-4"
        >
          No countries match “{{ query.trim() }}”. Check the spelling or try
          another name.
          <template #actions>
            <UiButton variant="outline" radius="lg" @click="query = ''">
              Clear search
            </UiButton>
          </template>
        </EmptyState>

        <ul
          v-else
          class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <li
            v-for="coverage in filtered"
            :key="coverage.country"
            class="bg-surface border-border hover:border-primary/40 flex items-center gap-4 rounded-2xl border p-4 transition-colors ease-in"
          >
            <span
              aria-hidden="true"
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
            >
              {{ coverage.country.charAt(0) }}
            </span>
            <div class="min-w-0">
              <h3 class="truncate text-sm font-semibold">
                {{ coverage.country }}
              </h3>
              <p class="text-muted-foreground mt-0.5 text-xs">
                {{ coverage.networkcount }}
                {{ coverage.networkcount === 1 ? 'network' : 'networks' }}
              </p>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Globe, Search, SearchX } from '@lucide/vue'
import type { Coverage } from '@/types/coverage'

const { coverages } = defineProps<{
  coverages: Coverage[]
}>()

const query = ref('')

const sorted = computed(() =>
  [...coverages].sort((a, b) => a.country.localeCompare(b.country)),
)

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return sorted.value
  return sorted.value.filter(({ country }) =>
    country.toLowerCase().includes(term),
  )
})

const summary = computed(() =>
  query.value.trim()
    ? `Showing ${filtered.value.length} of ${coverages.length} countries`
    : `${coverages.length} countries`,
)
</script>
