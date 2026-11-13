<template>
  <section>
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-semibold">Recent shares</h2>
      <span
        v-if="rows.length"
        class="bg-primary/10 text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
      >
        {{ rows.length }}
      </span>
    </div>
    <p class="text-muted-foreground mt-1 text-sm">
      Units you've sent to other Multitexter accounts.
    </p>

    <div class="mt-4">
      <UiErrorState v-if="error" @try-again="fetchSharedUnits" />

      <div v-else-if="!shares" class="space-y-3">
        <UiSkeleton v-for="n in 4" :key="n" class="h-12 w-full rounded-lg" />
      </div>

      <EmptyState
        v-else-if="!rows.length"
        :icon="Share2"
        title="No shares yet"
        description="Units you share with other accounts will show up here."
      />

      <div v-else class="border-border overflow-hidden rounded-lg border">
        <UiTable>
          <TableHeader>
            <TableRow>
              <TableHead v-for="heading in headings" :key="heading">
                {{ heading }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(share, index) in rows" :key="index">
              <TableCell class="text-muted-foreground w-12">
                {{ index + 1 }}.
              </TableCell>
              <TableCell>{{ share.recipient || '—' }}</TableCell>
              <TableCell class="font-medium">
                {{ formatNumberWithComma(share.amount) }}
              </TableCell>
              <TableCell>
                {{ share.sharedAt.date }}
                <span
                  v-if="share.sharedAt.time"
                  class="text-muted-foreground block text-xs"
                >
                  {{ share.sharedAt.time }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </UiTable>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Share2 } from '@lucide/vue'

const headings = ['', 'Recipient', 'Units', 'Date']

const { shares, error, fetchSharedUnits } = useSharedUnits()

const timeOf = (date: string) => new Date(date).getTime() || 0

const rows = computed(() =>
  [...(shares.value ?? [])]
    .sort((a, b) => timeOf(b.date_shared) - timeOf(a.date_shared))
    .slice(0, 20)
    .map((share) => ({
      ...share,
      sharedAt: {
        date: useDateFormat(share.date_shared, 'Do MMM YYYY').value,
        time: share.date_shared.includes(':')
          ? useDateFormat(share.date_shared, 'h:mm a').value
          : null,
      },
    })),
)

onMounted(fetchSharedUnits)
</script>
