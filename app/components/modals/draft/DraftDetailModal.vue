<template>
  <UiModal v-model:open="open" title="Draft details">
    <template v-if="draft">
      <div class="grid gap-x-6 gap-y-5 sm:grid-cols-2">
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
            {{ draft.message || '—' }}
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
        Edit &amp; send
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { PencilIcon } from '@lucide/vue'
import type { DraftMessage } from '@/types/message'

const props = defineProps<{
  draft: DraftMessage | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  edit: []
}>()

const recipients = computed(() => splitRecipients(props.draft?.recipient))

const details = computed(() => {
  if (!props.draft) return []
  const { displayname, created } = props.draft

  return [
    { label: 'Sender name', value: displayname || '—' },
    {
      label: 'Saved on',
      value:
        !created || created.startsWith('0000')
          ? '—'
          : useDateFormat(created, 'Do MMMM YYYY, h:mm A').value,
    },
  ]
})
</script>
