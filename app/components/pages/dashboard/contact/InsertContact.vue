<template>
  <form
    novalidate
    class="border-border bg-surface max-w-2xl rounded-2xl border p-6 sm:p-8"
    @submit="submit"
  >
    <UiTextarea
      v-model="recipients"
      name="recipients"
      label="Phone numbers"
      :rows="8"
      placeholder="08152425262, 2347047373872"
      autocomplete="off"
      spellcheck="false"
      hint="Separate numbers with commas, or paste a list. Duplicates and invalid numbers are removed."
      :error="errors.recipients"
      @keypress="isNumber"
      @blur="formatRecipients"
    />
    <p class="text-muted-foreground mt-2 text-xs">
      Numbers:
      <strong class="text-foreground font-semibold tabular-nums">
        {{ formatNumberWithComma(totalRecipients) }}
      </strong>
    </p>

    <ContactListPicker
      v-model:mode="mode"
      v-model:name="listName"
      v-model:list-id="listId"
      :name-error="errors.listName"
      :list-error="errors.listId"
      class="border-border mt-6 border-t pt-6"
    />

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <div class="mt-6 flex justify-end">
      <UiButton type="submit" radius="lg" :loading="loading">
        Save contacts
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'
import contactListFields from '@/composables/useContactLists'

const { $toast } = useNuxtApp()
const { fetchContactLists } = useContactLists()

const schema = Yup.object({
  recipients: Yup.string().trim().required('Enter at least one phone number'),
  ...contactListFields,
})

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    recipients: '',
    mode: 'create' as ContactListMode,
    listName: '',
    listId: null as number | null,
  },
})
const { value: recipients } = useField<string>('recipients')
const { value: mode } = useField<ContactListMode>('mode')
const { value: listName } = useField<string>('listName')
const { value: listId } = useField<number | null>('listId')
const loading = ref(false)
const errorMessage = ref('')

const { totalRecipients, formatRecipients } = useComposeMessage(recipients)

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.phonebook.createContact({
      mobilenumber: values.recipients,
      ...(values.mode === 'create'
        ? { contactlistname: values.listName.trim() }
        : { contactlistid: values.listId! }),
    })
    if (response.status === 1) {
      $toast.success(response.msg || 'Your contacts have been saved.')
      resetForm()
      fetchContactLists()
    } else {
      errorMessage.value =
        response.msg || "We couldn't save these contacts. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})

const submit = (event: Event) => {
  formatRecipients()
  onSubmit(event)
}
</script>
