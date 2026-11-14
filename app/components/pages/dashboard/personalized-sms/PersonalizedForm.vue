<template>
  <form
    novalidate
    class="border-border bg-surface rounded-2xl border p-6 sm:p-8"
    @submit="onSubmit"
  >
    <p class="text-primary text-xs font-semibold tracking-wider uppercase">
      Step 2
    </p>
    <h2 class="mt-1 font-semibold">Write and send</h2>
    <p class="text-muted-foreground mt-1 text-sm">
      We've filled in the message from your file. Edit it if you need to, then
      preview how it reads for your first recipient.
    </p>

    <div class="mt-6 space-y-5">
      <UiAutoComplete
        v-model="senderName"
        name="senderName"
        label="Sender name"
        maxlength="11"
        placeholder="MyBrand"
        :options="senderOptions"
        hint="Up to 11 characters. Don't use a bank's name."
        :error="errors.senderName"
      />

      <UiTextarea
        v-model="message"
        name="message"
        label="Message"
        :rows="5"
        autoresize
        :error="errors.message"
      />

      <div>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-muted-foreground text-sm">Preview</p>
          <UiButton
            variant="outline"
            size="sm"
            radius="lg"
            :loading="previewing"
            @click="onPreview"
          >
            <template #leading>
              <EyeIcon class="size-4" />
            </template>
            Preview first message
          </UiButton>
        </div>
        <div
          aria-live="polite"
          class="border-border bg-background mt-2 rounded-xl border p-4 text-sm"
        >
          <p
            v-if="preview"
            :class="[
              'wrap-break-word whitespace-pre-wrap transition-opacity',
              previewStale && 'opacity-60',
            ]"
          >
            {{ preview }}
          </p>
          <p v-else class="text-muted-foreground">
            See exactly what your first recipient will get.
          </p>
        </div>
        <p
          v-if="previewStale"
          class="mt-1 text-sm text-amber-700 dark:text-amber-400"
        >
          You've changed the message since this preview.
        </p>
        <UiFormError v-if="previewError" :message="previewError" />
      </div>

      <UiCheckbox
        v-model="priorityRoute"
        name="priorityRoute"
        label="Use the priority route"
        hint="Reaches MTN numbers on Do Not Disturb (DND). MTN messages cost 2 units per page."
      />
    </div>

    <div v-if="errorMessage">
      <UiFormError :message="errorMessage" />
      <NuxtLink
        v-if="lowBalance"
        to="/dashboard/buy-sms-online"
        class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
      >
        Buy units
        <ArrowRightIcon class="size-4" />
      </NuxtLink>
    </div>

    <div class="mt-6 flex justify-end">
      <UiButton type="submit" radius="lg" :loading="sending">
        <template #leading>
          <SendIcon class="size-4" />
        </template>
        Send messages
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { ArrowRightIcon, EyeIcon, SendIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { PersonalizedTemplate } from '@/types/personalized'

const INSUFFICIENT_UNITS = -7

const { template } = defineProps<{ template: PersonalizedTemplate }>()
const emit = defineEmits<{ sent: [] }>()

const { $toast } = useNuxtApp()
const { fetchUserDetails } = useAuth()
const { senderIds, fetchSenderIds } = useSenderIds()

const senderOptions = computed(
  () => senderIds.value?.map(({ sender }) => sender) ?? [],
)

const schema = Yup.object({
  senderName: Yup.string()
    .trim()
    .required('Enter a sender name')
    .max(11, 'Use 11 characters or fewer'),
  message: Yup.string().trim().required('Enter a message'),
})

const { errors, handleSubmit, validateField } = useForm({
  validationSchema: schema,
  initialValues: {
    senderName: '',
    message: template.message,
  },
})
const { value: senderName } = useField<string>('senderName')
const { value: message } = useField<string>('message')
const priorityRoute = ref(true)
const preview = ref('')
const previewedMessage = ref('')
const previewing = ref(false)
const previewError = ref('')
const sending = ref(false)
const errorMessage = ref('')
const lowBalance = ref(false)

const previewStale = computed(
  () => !!preview.value && message.value !== previewedMessage.value,
)

onMounted(() => {
  if (!senderIds.value) fetchSenderIds()
})

const onPreview = async () => {
  const { valid } = await validateField('message')
  if (!valid) return

  const text = message.value
  try {
    previewing.value = true
    previewError.value = ''
    const response = await apiClient.personalized.previewMessage({
      url: template.fileUrl,
      filename: template.filename,
      message: text,
    })
    if (response.status === 1) {
      preview.value = response.data
      previewedMessage.value = text
    } else {
      previewError.value =
        response.msg || "We couldn't preview this message. Please try again."
    }
  } catch (err) {
    previewError.value = formatErrorResponse(err)
  } finally {
    previewing.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    sending.value = true
    errorMessage.value = ''
    lowBalance.value = false
    const response = await apiClient.personalized.sendMessage({
      fileUrl: template.fileUrl,
      filename: template.filename,
      message: values.message,
      displayname: values.senderName.trim(),
      dnd: priorityRoute.value ? 1 : 0,
    })
    if (response.status === 1) {
      $toast.success(response.msg || 'Your messages are on their way.')
      fetchUserDetails()
      if (response.bulk_id) {
        await navigateTo(`/dashboard/sms-detail/${response.bulk_id}`)
      } else {
        emit('sent')
      }
    } else {
      lowBalance.value = response.status === INSUFFICIENT_UNITS
      errorMessage.value =
        response.msg || "We couldn't send your messages. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    sending.value = false
  }
})
</script>
