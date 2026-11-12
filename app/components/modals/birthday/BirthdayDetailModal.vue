<template>
  <UiModal v-model:open="open" title="Birthday details">
    <template v-if="birthday">
      <div class="flex flex-wrap items-center gap-2">
        <BirthdayStatusBadge :status="birthday.status" />
        <span class="text-muted-foreground text-xs">
          Sent {{ formatNumberWithComma(birthday.total_sent) }}
          {{ birthday.total_sent === 1 ? 'time' : 'times' }}
        </span>
      </div>

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
            {{ birthday.content }}
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UiButton variant="outline" radius="lg" @click="close">Close</UiButton>
      <UiButton radius="lg" @click="emit('edit')">
        <template #leading>
          <PencilIcon class="size-4" />
        </template>
        Edit
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { PencilIcon } from '@lucide/vue'
import type { Birthday } from '@/types/birthday'

const props = defineProps<{
  birthday: Birthday | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  edit: []
}>()

const formatDate = (value: string | null | undefined, pattern: string) =>
  !value || value.startsWith('0000') ? '' : useDateFormat(value, pattern).value

const details = computed(() => {
  if (!props.birthday) return []
  const {
    username,
    destination,
    birthday,
    send_time,
    sender,
    last_sent,
    next_sent,
  } = props.birthday

  return [
    { label: 'Recipient', value: username || '—' },
    { label: 'Phone number', value: destination || '—' },
    { label: 'Birthday', value: formatDate(birthday, 'Do MMMM YYYY') || '—' },
    {
      label: 'Sends at',
      value: send_time ? formatDate(`2000-01-01 ${send_time}`, 'h:mm A') : '—',
    },
    { label: 'Sender name', value: sender || '—' },
    {
      label: 'Last sent',
      value: formatDate(last_sent, 'Do MMM YYYY, h:mm A') || 'Not sent yet',
    },
    {
      label: 'Next send',
      value: formatDate(next_sent, 'Do MMM YYYY, h:mm A') || '—',
    },
  ]
})
</script>
