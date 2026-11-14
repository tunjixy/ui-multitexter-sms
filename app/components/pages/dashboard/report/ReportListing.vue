<template>
  <section>
    <UiErrorState v-if="error" @try-again="fetchReports()" />

    <div v-else-if="!reports" class="space-y-3">
      <UiSkeleton v-for="n in 6" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <EmptyState
      v-else-if="!rows.length && filters"
      :icon="SearchXIcon"
      title="No matching reports"
      description="No reports match these filters. Try a wider date range or fewer filters."
    >
      <template #actions>
        <UiButton
          variant="outline"
          radius="lg"
          :loading="loading"
          :disabled="loading"
          @click="applyFilters(null)"
        >
          Clear filters
        </UiButton>
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="!rows.length"
      :icon="MailCheckIcon"
      title="No delivery reports yet"
      description="Once you send messages, you'll see here whether each one reached its recipient."
    >
      <template #actions>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <SendIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </template>
    </EmptyState>

    <template v-else>
      <div
        :class="[
          'border-border overflow-hidden rounded-lg border transition-opacity',
          loading && 'pointer-events-none opacity-60',
        ]"
      >
        <UiTable>
          <TableHeader>
            <TableRow>
              <TableHead v-for="(heading, index) in headings" :key="index">
                {{ heading }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="row in rows"
              :key="row.number"
              class="cursor-pointer"
              @click="viewReport(row.report)"
            >
              <TableCell class="text-muted-foreground w-12">
                {{ row.number }}.
              </TableCell>
              <TableCell>
                <ReportStatusBadge :status="row.report.status" />
              </TableCell>
              <TableCell class="font-medium">
                {{ row.report.sender_name || '—' }}
              </TableCell>
              <TableCell class="tabular-nums">
                {{ row.report.recipient || '—' }}
              </TableCell>
              <TableCell>
                <span class="block max-w-64 truncate">
                  {{ row.report.content || '—' }}
                </span>
              </TableCell>
              <TableCell>
                <template v-if="row.sentOn">
                  {{ row.sentOn.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.sentOn.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="w-14">
                <button
                  type="button"
                  class="text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-3"
                  @click.stop="viewReport(row.report)"
                >
                  <ChevronRightIcon class="size-4" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </UiTable>

        <UiPagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @previous="fetchReports(currentPage - 1)"
          @next="fetchReports(currentPage + 1)"
          @goto="fetchReports"
        />
      </div>
    </template>

    <ReportDetailModal v-model:open="viewing" :report="selected" />
  </section>
</template>

<script setup lang="ts">
import {
  ChevronRightIcon,
  MailCheckIcon,
  SearchXIcon,
  SendIcon,
} from '@lucide/vue'
import type { DeliveryReport } from '@/types/report'

const {
  reports,
  filters,
  currentPage,
  perPage,
  totalPages,
  loading,
  error,
  fetchReports,
  applyFilters,
} = useDeliveryReports()

const headings = ['', 'Status', 'Sender', 'Recipient', 'Message', 'Sent on', '']

const selected = ref<DeliveryReport | null>(null)
const viewing = ref(false)

const sentOn = (value: string | null | undefined) =>
  !value || value.startsWith('0000')
    ? null
    : {
        date: useDateFormat(value, 'Do MMM YYYY').value,
        time: useDateFormat(value, 'h:mm a').value,
      }

const rows = computed(() =>
  (reports.value ?? []).map((report, index) => ({
    report,
    number: incrementPageNumber(index, perPage.value, currentPage.value),
    sentOn: sentOn(report.disptachtime),
  })),
)

const viewReport = (report: DeliveryReport) => {
  selected.value = report
  viewing.value = true
}

onMounted(() => fetchReports(1))
</script>
