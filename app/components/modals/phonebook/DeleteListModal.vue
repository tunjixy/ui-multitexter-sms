<template>
  <UiModal
    v-model:open="open"
    size="sm"
    title="Delete this list?"
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
        Delete list
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'
import type { ContactList } from '@/types/phonebook'

const props = defineProps<{
  list: ContactList | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  deleted: []
}>()

const { $toast } = useNuxtApp()
const loading = ref(false)

const description = computed(() => {
  const name = props.list?.contactist_name || 'This list'
  const count = Number(props.list?.contactCount) || 0
  const numbers = count
    ? ` and its ${formatNumberWithComma(count)} ${count === 1 ? 'number' : 'numbers'}`
    : ''
  return `${name}${numbers} will be removed from your phonebook. This can't be undone.`
})

const onDelete = async () => {
  if (!props.list) return
  try {
    loading.value = true
    const response = await apiClient.phonebook.deleteContactList(
      props.list.contactlistid,
    )
    if (response.status === 1) {
      emit('deleted')
      $toast.success(response.msg || 'List deleted.')
      open.value = false
    } else {
      $toast.error(
        response.msg || "We couldn't delete this list. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    loading.value = false
  }
}
</script>
