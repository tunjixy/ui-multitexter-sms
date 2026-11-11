<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div>
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Before you go
        </p>
        <h2
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          A few things to know.
        </h2>

        <ul class="mt-10 space-y-6">
          <li v-for="note in notes" :key="note.title" class="flex gap-4">
            <span
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <component :is="note.icon" class="size-5" />
            </span>
            <div class="min-w-0">
              <h3 class="text-base font-semibold">{{ note.title }}</h3>
              <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                {{ note.description }}
              </p>
            </div>
          </li>
        </ul>

        <p
          class="border-border text-muted-foreground mt-10 border-t pt-6 text-sm"
        >
          Need help? Reach us at
          <a
            href="mailto:support@multitexter.com"
            class="text-primary font-semibold break-all hover:underline"
          >
            support@multitexter.com
          </a>
        </p>
      </div>

      <div class="bg-surface border-border rounded-3xl border p-6 sm:p-10">
        <div v-if="successMessage" class="flex flex-col items-start">
          <div class="relative">
            <span
              aria-hidden="true"
              class="absolute inset-0 rounded-2xl bg-emerald-500/25 blur-xl"
            />
            <span
              class="border-border bg-surface relative flex size-12 items-center justify-center rounded-2xl border text-emerald-600 dark:text-emerald-400"
            >
              <CircleCheck class="size-6" />
            </span>
          </div>
          <h2 class="mt-6 text-2xl font-semibold tracking-tight">
            You've been unsubscribed
          </h2>
          <p class="text-muted-foreground mt-2 leading-relaxed" role="status">
            {{ successMessage }}
          </p>
          <NuxtLink
            to="/"
            class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 mt-8 flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            <House class="size-4" />
            Back to home
          </NuxtLink>
        </div>

        <template v-else>
          <span
            class="bg-primary/10 text-primary border-primary/30 inline-block rounded-full border px-3 py-1 text-xs font-medium"
          >
            Opt out
          </span>
          <h2 class="mt-4 text-2xl font-semibold tracking-tight">
            Unsubscribe from SMS
          </h2>
          <p class="text-muted-foreground mt-2 text-sm">
            Use the phone number that received the message.
          </p>

          <form
            class="border-border mt-8 border-t pt-8"
            novalidate
            @submit.prevent="onSubmit"
          >
            <UiInput
              id="unsubscribe-phone"
              v-model="phoneNumber"
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              autocomplete="tel"
              inputmode="tel"
              placeholder="e.g. 08012345678"
              :error="errors.phoneNumber"
            >
              <template #leading>
                <Smartphone class="size-4" />
              </template>
            </UiInput>

            <UiFormError
              v-if="errorMessage"
              :message="errorMessage"
              class="mt-3"
            />

            <UiButton
              type="submit"
              size="lg"
              block
              raised
              radius="lg"
              :loading="loading"
              :disabled="disabled"
              class="mt-8"
            >
              Unsubscribe
            </UiButton>
          </form>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { CircleCheck, House, Link, Smartphone, Zap } from '@lucide/vue'
import { apiClient } from '@/repository/api'

const { ref: userRef } = useRoute().query

const notes = [
  {
    icon: Smartphone,
    title: 'Use the right number',
    description:
      'Enter the phone number that received the message, so we can find it on the sender’s list.',
  },
  {
    icon: Link,
    title: 'It applies to this sender',
    description:
      'This link belongs to the business that messaged you, so you’ll stop receiving SMS from them.',
  },
  {
    icon: Zap,
    title: 'No account needed',
    description:
      'There’s nothing to sign up for. Just enter your number and submit the form.',
  },
]

const schema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required()
    .label('Phone Number')
    .trim()
    .test(
      'phone',
      'Enter a valid phone number',
      (value) => !value || /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, '')),
    ),
})
const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    phoneNumber: '',
  },
})
const { value: phoneNumber } = useField<string>('phoneNumber')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const disabled = computed(() => loading.value || !meta.value.valid)

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.misc.unsubscribe({
      userid: typeof userRef === 'string' ? userRef : '',
      mobile_number: values.phoneNumber.replace(/[\s-]/g, ''),
    })
    if (response.status === 1) {
      successMessage.value =
        response.msg || 'Your number has been removed from this sender’s list.'
    } else {
      errorMessage.value = response.msg
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
