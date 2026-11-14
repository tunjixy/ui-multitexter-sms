<template>
  <UiModal
    v-model:open="open"
    size="sm"
    title="Delete this draft?"
    description="The saved message will be removed for good. This can't be undone."
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
        Delete draft
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'
import type { DraftMessage } from '@/types/message'

const props = defineProps<{
  draft: DraftMessage | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  deleted: []
}>()

const { $toast } = useNuxtApp()
const loading = ref(false)

const onDelete = async () => {
  if (!props.draft) return
  try {
    loading.value = true
    const response = await apiClient.message.deleteDraft(props.draft.id)
    if (response.status === 1) {
      emit('deleted')
      $toast.success(response.msg || 'Draft deleted.')
      open.value = false
    } else {
      $toast.error(
        response.msg || "We couldn't delete this draft. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    loading.value = false
  }
}
</script>
