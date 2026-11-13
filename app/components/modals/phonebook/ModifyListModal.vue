<template>
  <UiModal
    v-model:open="open"
    :title="list ? 'Edit list' : 'New contact list'"
    description="Group numbers you text together, like customers, staff or a church unit."
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <form :id="formId" novalidate class="grid gap-4" @submit="onSubmit">
      <UiInput
        v-model="name"
        name="name"
        label="List name"
        placeholder="Customers"
        :error="errors.name"
      />
      <UiTextarea
        v-model="description"
        name="description"
        label="Description (optional)"
        :rows="3"
        placeholder="Who's in this list?"
        :error="errors.description"
      />
    </form>

    <UiFormError v-if="errorMessage" :message="errorMessage" />

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
        type="submit"
        :form="formId"
        radius="lg"
        :loading="loading"
        :disabled="disabled"
      >
        {{ loading ? '' : list ? 'Save changes' : 'Create list' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'
import type { ContactList, CreateContactListReq } from '@/types/phonebook'

const props = defineProps<{
  list?: ContactList | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  saved: [values: CreateContactListReq]
}>()

const { $toast } = useNuxtApp()
const formId = useId()

const schema = Yup.object({
  name: Yup.string().trim().required('Give your list a name'),
  description: Yup.string().trim(),
})

const toValues = () => ({
  name: props.list?.contactist_name ?? '',
  description: props.list?.description ?? '',
})

const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: toValues(),
})
const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const loading = ref(false)
const errorMessage = ref('')

const disabled = computed(
  () => loading.value || (!!props.list && !meta.value.dirty),
)

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: toValues() })
})

const onSubmit = handleSubmit(async (values) => {
  const body: CreateContactListReq = {
    name: values.name.trim(),
    description: values.description?.trim() ?? '',
  }

  try {
    loading.value = true
    errorMessage.value = ''
    const response = props.list
      ? await apiClient.phonebook.updateContactList({
          ...body,
          listId: props.list.contactlistid,
        })
      : await apiClient.phonebook.createContactList(body)
    if (response.status === 1) {
      emit('saved', body)
      $toast.success(
        response.msg || (props.list ? 'List updated.' : 'List created.'),
      )
      open.value = false
    } else {
      errorMessage.value =
        response.msg || "We couldn't save this list. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
