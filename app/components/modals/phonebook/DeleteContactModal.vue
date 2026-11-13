<template>
  <UiModal
    v-model:open="open"
    size="sm"
    title="Remove this contact?"
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
        Remove
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'
import type { Contact } from '@/types/phonebook'

const props = defineProps<{
  contact: Contact | null
  listName?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  deleted: []
}>()

const { $toast } = useNuxtApp()
const loading = ref(false)

const description = computed(
  () =>
    `${props.contact?.mobilenumber || 'This number'} will be removed from ${props.listName || 'this list'}. This can't be undone.`,
)

const onDelete = async () => {
  if (!props.contact) return
  try {
    loading.value = true
    const response = await apiClient.phonebook.deleteContact(
      props.contact.contactid,
    )
    if (response.status === 1) {
      emit('deleted')
      $toast.success(response.msg || 'Contact removed.')
      open.value = false
    } else {
      $toast.error(
        response.msg || "We couldn't remove this contact. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    loading.value = false
  }
}
</script>
