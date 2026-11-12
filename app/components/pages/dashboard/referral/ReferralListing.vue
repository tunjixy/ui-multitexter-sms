<template>
  <section>
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-semibold">Your referrals</h2>
      <span
        v-if="referrals?.length"
        class="bg-primary/10 text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
      >
        {{ referrals.length }}
      </span>
    </div>
    <p class="text-muted-foreground mt-1 text-sm">
      People who signed up with your referral link.
    </p>

    <div class="mt-4">
      <div v-if="loading" class="space-y-3">
        <UiSkeleton v-for="n in 4" :key="n" class="h-12 w-full rounded-lg" />
      </div>

      <UiErrorState v-else-if="error" @try-again="fetchReferrals" />

      <EmptyState
        v-else-if="!referrals?.length"
        :icon="Users"
        title="No referrals yet"
        description="Share your link. Everyone who signs up with it will show up here."
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
            <TableRow v-for="(referral, index) in referrals" :key="index">
              <TableCell class="text-muted-foreground w-12">
                {{ index + 1 }}.
              </TableCell>
              <TableCell>{{ referral.email }}</TableCell>
              <TableCell>{{ referral.name }}</TableCell>
            </TableRow>
          </TableBody>
        </UiTable>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Users } from '@lucide/vue'
import type { Referral } from '@/types/referral'
import { apiClient } from '@/repository/api'

const headings = ['', 'Referred', 'Name']
const referrals = ref<Referral[] | null>(null)
const loading = ref(true)
const error = ref(false)

const fetchReferrals = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.referral.fetchReferrals()
    if (response.status === 1) {
      referrals.value = response.data
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchReferrals)
</script>
