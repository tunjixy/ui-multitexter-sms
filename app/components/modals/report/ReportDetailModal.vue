<template>
  <UiModal v-model:open="open" title="Report details">
    <template v-if="report">
      <ReportStatusBadge :status="report.status" />

      <div class="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div v-for="item in details" :key="item.label">
          <div class="text-muted-foreground text-xs">{{ item.label }}</div>
          <div class="mt-1 font-medium wrap-break-word">{{ item.value }}</div>
        </div>
        <div class="sm:col-span-2">
          <div class="text-muted-foreground text-xs">Message</div>
          <div
            class="border-border bg-background mt-1.5 rounded-lg border p-4 wrap-break-word whitespace-pre-line"
          >
            {{ report.content || '—' }}
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UiButton variant="outline" radius="lg" @click="close">Close</UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import type { DeliveryReport } from '@/types/report'

const props = defineProps<{
  report: DeliveryReport | null
}>()

const open = defineModel<boolean>('open', { default: false })

const details = computed(() => {
  if (!props.report) return []
  const { sender_name, recipient, disptachtime, messageid } = props.report

  return [
    { label: 'Sender name', value: sender_name || '—' },
    { label: 'Recipient', value: recipient || '—' },
    { label: 'Message ID', value: messageid || '—' },
    {
      label: 'Sent on',
      value:
        !disptachtime || disptachtime.startsWith('0000')
          ? '—'
          : useDateFormat(disptachtime, 'Do MMMM YYYY, h:mm A').value,
    },
  ]
})
</script>
