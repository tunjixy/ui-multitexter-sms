<template>
  <UiModal
    v-model:open="open"
    :title="copy.title"
    description="We'll text them on their birthday every year, at the time you choose."
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <form
      :id="formId"
      novalidate
      class="grid gap-4 sm:grid-cols-2"
      @submit="onSubmit"
    >
      <UiInput
        v-model="recipientName"
        name="recipientName"
        label="Recipient name"
        placeholder="Ada Obi"
        :error="errors.recipientName"
      />
      <UiInput
        v-model="phoneNumber"
        type="tel"
        name="phoneNumber"
        label="Phone number"
        inputmode="tel"
        placeholder="08012345678"
        :error="errors.phoneNumber"
      />
      <UiDatePicker
        v-model="birthDate"
        name="birthDate"
        label="Birth date"
        type="date"
        format="D MMM YYYY"
        value-type="YYYY-MM-DD"
        placeholder="Pick a date"
        :disabled-date="isFuture"
        :error="errors.birthDate"
      />
      <UiDatePicker
        v-model="sendTime"
        name="sendTime"
        label="Send at"
        type="time"
        format="h:mm"
        value-type="HH:mm:ss"
        placeholder="Pick a time"
        :error="errors.sendTime"
      />
      <UiInput
        v-model="senderName"
        name="senderName"
        label="Sender name"
        maxlength="11"
        placeholder="MyBrand"
        hint="Up to 11 characters."
        :error="errors.senderName"
        class="sm:col-span-2"
      />
      <UiTextarea
        v-model="message"
        name="message"
        label="Message"
        :rows="4"
        placeholder="Happy birthday! Wishing you a wonderful year ahead."
        :hint="messageHint"
        :error="errors.message"
        class="sm:col-span-2"
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
        {{ loading ? '' : copy.submit }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'
import type { Birthday, BirthdayCreateReq } from '@/types/birthday'

const props = defineProps<{
  birthday?: Birthday | null
  entry?: BirthdayCreateReq | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  saved: []
  submit: [entry: BirthdayCreateReq]
}>()

const { $toast } = useNuxtApp()
const formId = useId()

const schema = Yup.object({
  recipientName: Yup.string().trim().required("Enter the recipient's name"),
  phoneNumber: Yup.string()
    .trim()
    .required('Enter a phone number')
    .test(
      'phone',
      'Enter a valid phone number',
      (value) => !value || /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, '')),
    ),
  birthDate: Yup.string().required('Pick their birth date'),
  sendTime: Yup.string().required('Pick a time to send'),
  senderName: Yup.string()
    .trim()
    .required('Enter a sender name')
    .max(11, 'Use 11 characters or fewer'),
  message: Yup.string().trim().required('Write a message'),
})

const toDate = (value?: string) =>
  value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value || ''

const toTime = (value?: string) =>
  value && /^\d{1,2}:\d{2}$/.test(value) ? `${value}:00` : value || ''

const toValues = () => {
  if (props.birthday) {
    const { sender, username, destination, birthday, send_time, content } =
      props.birthday
    return {
      recipientName: username ?? '',
      phoneNumber: destination ?? '',
      birthDate: toDate(birthday),
      sendTime: toTime(send_time),
      senderName: sender ?? '',
      message: content ?? '',
    }
  }

  const entry = { ...props.entry }
  return {
    recipientName: entry.contact_name ?? '',
    phoneNumber: entry.mobile_number ?? '',
    birthDate: toDate(entry.birthday),
    sendTime: toTime(entry.send_time),
    senderName: entry.displayname ?? '',
    message: entry.message ?? '',
  }
}

const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: toValues(),
})
const { value: recipientName } = useField<string>('recipientName')
const { value: phoneNumber } = useField<string>('phoneNumber')
const { value: birthDate } = useField<string>('birthDate')
const { value: sendTime } = useField<string>('sendTime')
const { value: senderName } = useField<string>('senderName')
const { value: message } = useField<string>('message')
const loading = ref(false)
const errorMessage = ref('')

const editing = computed(() => !!(props.birthday || props.entry))

const copy = computed(() => {
  if (props.birthday) return { title: 'Edit birthday', submit: 'Save changes' }
  if (props.entry) return { title: 'Edit entry', submit: 'Update entry' }
  return { title: 'Add a birthday', submit: 'Add entry' }
})

const disabled = computed(
  () => loading.value || (editing.value && !meta.value.dirty),
)

const messageHint = computed(() => {
  const length = message.value?.length ?? 0
  const pages = length <= 160 ? 1 : Math.ceil(length / 153)
  return `${length} characters · ${pages} SMS ${pages === 1 ? 'page' : 'pages'}`
})

const isFuture = (date: Date) => date > new Date()

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: toValues() })
})

const onSubmit = handleSubmit(async (values) => {
  const body: BirthdayCreateReq = {
    displayname: values.senderName.trim(),
    contact_name: values.recipientName.trim(),
    mobile_number: values.phoneNumber.replace(/[\s-]/g, ''),
    birthday: values.birthDate,
    send_time: values.sendTime,
    message: values.message.trim(),
  }

  if (!props.birthday) {
    emit('submit', body)
    open.value = false
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.birthday.editBirthday({
      id: props.birthday.id,
      ...body,
    })
    if (response.status === 1) {
      emit('saved')
      $toast.success(response.msg || 'Birthday updated.')
      open.value = false
    } else {
      errorMessage.value =
        response.msg || "We couldn't save this birthday. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
