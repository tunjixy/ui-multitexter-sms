<template>
  <UiModal
    v-model:open="open"
    size="sm"
    title="Delete this birthday?"
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
        {{ loading ? '' : 'Delete' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'
import type { Birthday } from '@/types/birthday'

const props = defineProps<{
  birthday: Birthday | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  deleted: []
}>()

const { $toast } = useNuxtApp()
const loading = ref(false)

const description = computed(
  () =>
    `${props.birthday?.username || 'This contact'} will stop getting your birthday message. This can't be undone.`,
)

const onDelete = async () => {
  if (!props.birthday) return
  try {
    loading.value = true
    const response = await apiClient.birthday.deleteBirthday(props.birthday.id)
    if (response.status === 1) {
      emit('deleted')
      $toast.success(response.msg || 'Birthday deleted.')
      open.value = false
    } else {
      $toast.error(
        response.msg || "We couldn't delete this birthday. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    loading.value = false
  }
}
</script>
