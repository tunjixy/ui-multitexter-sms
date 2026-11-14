<template>
  <UiModal
    v-model:open="open"
    size="sm"
    title="Delete this sender ID?"
    :description="description"
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <template #footer="{ close }">
      <UiButton
        variant="outline"
        radius="lg"
        :disabled="loading"
        @click="close"
      >
        Cancel
      </UiButton>
      <UiButton
        variant="danger"
        radius="lg"
        :loading="loading"
        @click="onDelete"
      >
        Delete sender ID
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'
import type { SenderId } from '@/types/sender-id'

const props = defineProps<{
  senderId: SenderId | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  deleted: []
}>()

const { $toast } = useNuxtApp()
const loading = ref(false)

const description = computed(
  () =>
    `${props.senderId?.sender || 'This sender ID'} will be removed from your account, and you won't be able to send messages with it. This can't be undone.`,
)

const onDelete = async () => {
  if (!props.senderId) return
  try {
    loading.value = true
    const response = await apiClient.senderId.deleteSenderId(
      props.senderId.sender,
    )
    if (response.status === 1) {
      emit('deleted')
      $toast.success(response.msg || 'Sender ID deleted.')
      open.value = false
    } else {
      $toast.error(
        response.msg || "We couldn't delete this sender ID. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    loading.value = false
  }
}
</script>
