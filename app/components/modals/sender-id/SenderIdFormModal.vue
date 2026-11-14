<template>
  <UiModal
    v-model:open="open"
    size="lg"
    :title="copy.title"
    :description="copy.description"
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
        v-model="senderName"
        name="senderName"
        label="Sender ID"
        maxlength="11"
        placeholder="MyBrand"
        hint="Up to 11 characters, usually your brand name."
        :error="errors.senderName"
      />
      <UiInput
        v-model="companyName"
        name="companyName"
        label="Company name"
        placeholder="MyBrand Limited"
        :error="errors.companyName"
      />
      <UiInput
        v-model="cacNumber"
        name="cacNumber"
        label="CAC number"
        placeholder="RC1234567"
        :error="errors.cacNumber"
      />
      <UiInput
        v-model="businessNature"
        name="businessNature"
        label="Nature of business"
        placeholder="Retail"
        :error="errors.businessNature"
      />
      <UiTextarea
        v-model="serviceDescription"
        name="serviceDescription"
        label="Description of service"
        :rows="3"
        placeholder="What your business offers, and what you'll text customers about."
        :error="errors.serviceDescription"
        class="sm:col-span-2"
      />
      <UiTextarea
        v-model="sampleMessage"
        name="sampleMessage"
        label="Sample message"
        :rows="3"
        placeholder="Hi Ada, your order #1024 has shipped and should arrive by Friday."
        hint="An example of a message you'll send with this ID."
        :error="errors.sampleMessage"
        class="sm:col-span-2"
      />
      <UiFileUpload
        v-model="cacDoc"
        name="cacDoc"
        label="CAC document"
        :accept="DOCUMENT_ACCEPT"
        :description="DOCUMENT_DESCRIPTION"
        :hint="
          senderId ? 'Leave empty to keep the one you sent before.' : undefined
        "
        :disabled="loading"
        :error="errors.cacDoc"
      />
      <UiFileUpload
        v-model="licenceDoc"
        name="licenceDoc"
        label="Licence (optional)"
        :accept="DOCUMENT_ACCEPT"
        :description="DOCUMENT_DESCRIPTION"
        hint="If your business needs a licence to operate, like banking or lending."
        :disabled="loading"
        :error="errors.licenceDoc"
      />
    </form>

    <p
      class="bg-primary/5 text-muted-foreground mt-4 flex gap-3 rounded-xl p-4 text-sm leading-relaxed"
    >
      <InfoIcon class="text-primary mt-0.5 size-4 shrink-0" />
      We review sender IDs on weekdays only. To send at the weekend before yours
      is approved, use one of our default sender IDs.
    </p>

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
        {{ copy.submit }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { InfoIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { SenderId } from '@/types/sender-id'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png'
const DOCUMENT_DESCRIPTION = 'PDF, JPG or PNG, up to 5MB'

const props = defineProps<{
  senderId?: SenderId | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  saved: []
}>()

const { $toast } = useNuxtApp()
const formId = useId()

const documentSchema = () =>
  Yup.mixed<File>()
    .nullable()
    .test(
      'type',
      'Choose a PDF, JPG or PNG file',
      (value) => !value || /\.(pdf|jpe?g|png)$/i.test(value.name),
    )
    .test(
      'size',
      'Choose a file smaller than 5MB',
      (value) => !value || value.size <= MAX_FILE_SIZE,
    )

const schema = Yup.object({
  senderName: Yup.string()
    .trim()
    .required('Enter a sender ID')
    .max(11, 'Use 11 characters or fewer'),
  companyName: Yup.string().trim().required('Enter your company name'),
  cacNumber: Yup.string().trim().required('Enter your CAC number'),
  businessNature: Yup.string()
    .trim()
    .required('Tell us what your business does'),
  serviceDescription: Yup.string()
    .trim()
    .required('Describe the service you offer'),
  sampleMessage: Yup.string().trim().required('Write a sample message'),
  cacDoc: documentSchema().test(
    'required',
    'Upload your CAC document',
    (value) => !!value || !!props.senderId,
  ),
  licenceDoc: documentSchema(),
})

const toValues = () => ({
  senderName: props.senderId?.sender ?? '',
  companyName: props.senderId?.company_name ?? '',
  cacNumber: props.senderId?.cac_number ?? '',
  businessNature: props.senderId?.business_nature ?? '',
  serviceDescription: props.senderId?.service_description ?? '',
  sampleMessage: props.senderId?.sample_message ?? '',
  cacDoc: null as File | null,
  licenceDoc: null as File | null,
})

const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: toValues(),
})
const { value: senderName } = useField<string>('senderName')
const { value: companyName } = useField<string>('companyName')
const { value: cacNumber } = useField<string>('cacNumber')
const { value: businessNature } = useField<string>('businessNature')
const { value: serviceDescription } = useField<string>('serviceDescription')
const { value: sampleMessage } = useField<string>('sampleMessage')
const { value: cacDoc } = useField<File | null>('cacDoc')
const { value: licenceDoc } = useField<File | null>('licenceDoc')
const loading = ref(false)
const errorMessage = ref('')

const copy = computed(() =>
  props.senderId
    ? {
        title: `Edit ${props.senderId.sender}`,
        description: 'Update the details we have for this sender ID.',
        submit: 'Save changes',
      }
    : {
        title: 'Request a sender ID',
        description:
          "Tell us about your business and the messages you'll send.",
        submit: 'Submit request',
      },
)

const disabled = computed(
  () => loading.value || (!!props.senderId && !meta.value.dirty),
)

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: toValues() })
})

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('sender_name', values.senderName.trim())
  formData.append('company_name', values.companyName.trim())
  formData.append('cac_number', values.cacNumber.trim())
  if (values.cacDoc) formData.append('cac_doc', values.cacDoc)
  formData.append('business_nature', values.businessNature.trim())
  formData.append('service_description', values.serviceDescription.trim())
  formData.append('sample_message', values.sampleMessage.trim())
  if (values.licenceDoc) formData.append('licence_doc', values.licenceDoc)

  try {
    loading.value = true
    errorMessage.value = ''
    const response = props.senderId
      ? await apiClient.senderId.updateSenderId(formData, props.senderId.id)
      : await apiClient.senderId.createSenderId(formData)
    if (response.status === 1) {
      emit('saved')
      $toast.success(
        response.msg ||
          (props.senderId
            ? 'Sender ID updated.'
            : "Request sent. We'll review your sender ID shortly."),
      )
      open.value = false
    } else {
      errorMessage.value =
        response.msg || "We couldn't submit your request. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
