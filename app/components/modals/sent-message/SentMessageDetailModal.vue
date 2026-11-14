<template>
  <UiModal v-model:open="open" title="Message details">
    <template v-if="message">
      <ReportStatusBadge :status="message.status" />

      <div class="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div v-for="item in details" :key="item.label">
          <div class="text-muted-foreground text-xs">{{ item.label }}</div>
          <div class="mt-1 font-medium wrap-break-word">{{ item.value }}</div>
        </div>

        <div class="sm:col-span-2">
          <div class="text-muted-foreground text-xs">
            Recipients
            <template v-if="recipients.length">
              ({{ formatNumberWithComma(recipients.length) }})
            </template>
          </div>
          <ul
            v-if="recipients.length"
            class="mt-1.5 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto"
          >
            <li
              v-for="(recipient, index) in recipients"
              :key="index"
              class="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium tabular-nums"
            >
              {{ recipient }}
            </li>
          </ul>
          <div v-else class="mt-1 font-medium">—</div>
        </div>

        <div class="sm:col-span-2">
          <div class="text-muted-foreground text-xs">Message</div>
          <div
            class="border-border bg-background mt-1.5 rounded-lg border p-4 wrap-break-word whitespace-pre-line"
          >
            {{ message.content || '—' }}
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UiButton variant="outline" radius="lg" @click="close">Close</UiButton>
      <UiButton radius="lg" @click="emit('resend')">
        <template #leading>
          <ForwardIcon class="size-4" />
        </template>
        Edit &amp; resend
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ForwardIcon } from '@lucide/vue'
import type { SentMessage } from '@/types/message'

const props = defineProps<{
  message: SentMessage | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  resend: []
}>()

const recipients = computed(() => splitRecipients(props.message?.recipient))

const details = computed(() => {
  if (!props.message) return []
  const { sender_name, disptachtime, unit_charge, volume, priority } =
    props.message

  return [
    { label: 'Sender name', value: sender_name || '—' },
    {
      label: 'Sent on',
      value:
        !disptachtime || disptachtime.startsWith('0000')
          ? '—'
          : useDateFormat(disptachtime, 'Do MMMM YYYY, h:mm A').value,
    },
    {
      label: 'Unit charge',
      value: `${formatNumberWithComma(unit_charge)} ${Number(unit_charge) === 1 ? 'unit' : 'units'}`,
    },
    { label: 'Volume', value: formatNumberWithComma(volume) },
    { label: 'Priority', value: priority === 1 ? 'Yes' : 'No' },
  ]
})
</script>
