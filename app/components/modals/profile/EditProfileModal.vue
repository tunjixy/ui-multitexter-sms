<template>
  <UiModal
    v-model:open="open"
    title="Edit profile"
    description="Keep your name and contact details up to date."
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <form
      :id="formId"
      novalidate
      class="divide-border divide-y"
      @submit="onSubmit"
    >
      <div class="py-5 first:pt-0">
        <p class="text-sm font-semibold">Name</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-2">
          <UiInput
            v-model="firstname"
            name="firstname"
            label="First name"
            :error="errors.firstname"
          />
          <UiInput
            v-model="surname"
            name="surname"
            label="Surname"
            :error="errors.surname"
          />
          <UiInput
            v-model="othername"
            name="othername"
            label="Other name"
            hint="Optional"
            :error="errors.othername"
          />
          <UiInput
            v-model="displayname"
            name="displayname"
            label="Sender name"
            hint="Optional"
            :error="errors.displayname"
          />
        </div>
      </div>

      <div class="py-5">
        <p class="text-sm font-semibold">Contact</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-2">
          <UiInput
            :model-value="profile.email"
            type="email"
            name="email"
            label="Email address"
            hint="The email you log in with."
            disabled
          />
          <UiInput
            v-model="altemail"
            type="email"
            name="altemail"
            label="Alternate email"
            placeholder="you@company.com"
            hint="Optional"
            :error="errors.altemail"
          />
          <UiInput
            v-model="mobileNumber"
            type="tel"
            name="mobileNumber"
            label="Phone number"
            placeholder="08012345678"
            :error="errors.mobileNumber"
          />
          <UiInput
            v-model="otherNumber"
            type="tel"
            name="otherNumber"
            label="Other number"
            placeholder="08012345678"
            hint="Optional"
            :error="errors.otherNumber"
          />
        </div>
      </div>

      <div class="py-5 last:pb-0">
        <div>
          <div class="text-sm font-semibold">Gender</div>
          <div class="mt-3 flex gap-6">
            <UiRadio
              v-for="option in genders"
              :key="option.value"
              v-model="gender"
              name="gender"
              :value="option.value"
              :label="option.label"
            />
          </div>
        </div>
      </div>
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
        {{ loading ? '' : 'Save changes' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'
import type { Profile } from '@/types/profile'

const props = defineProps<{
  profile: Profile
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: [profile: Profile]
}>()

const { $toast } = useNuxtApp()
const formId = useId()

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const isPhoneNumber = (value?: string) =>
  !value || /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, ''))

const schema = Yup.object({
  firstname: Yup.string().trim().required('Enter your first name'),
  surname: Yup.string().trim().required('Enter your surname'),
  othername: Yup.string().trim(),
  displayname: Yup.string().trim(),
  altemail: Yup.string().trim().email('Enter a valid email address'),
  mobileNumber: Yup.string()
    .trim()
    .required('Enter a phone number')
    .test('phone', 'Enter a valid phone number', isPhoneNumber),
  otherNumber: Yup.string()
    .trim()
    .test('phone', 'Enter a valid phone number', isPhoneNumber),
  gender: Yup.string(),
})

const toValues = (profile: Profile) => ({
  firstname: profile.firstname ?? '',
  surname: profile.surname ?? '',
  othername: profile.othername ?? '',
  displayname: profile.displayname ?? '',
  altemail: profile.alternate_email ?? '',
  mobileNumber: profile.mobilenumber ?? '',
  otherNumber: profile.other_number ?? '',
  gender: profile.gender?.toLowerCase() ?? '',
})

const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: toValues(props.profile),
})
const { value: firstname } = useField<string>('firstname')
const { value: surname } = useField<string>('surname')
const { value: othername } = useField<string>('othername')
const { value: displayname } = useField<string>('displayname')
const { value: altemail } = useField<string>('altemail')
const { value: mobileNumber } = useField<string>('mobileNumber')
const { value: otherNumber } = useField<string>('otherNumber')
const { value: gender } = useField<string>('gender')
const loading = ref(false)
const errorMessage = ref('')

const disabled = computed(
  () => loading.value || !meta.value.dirty || !meta.value.valid,
)

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: toValues(props.profile) })
})

const onSubmit = handleSubmit(async (values) => {
  const updated: Profile = {
    ...props.profile,
    firstname: values.firstname.trim(),
    surname: values.surname.trim(),
    othername: values.othername?.trim() ?? '',
    displayname: values.displayname?.trim() ?? '',
    alternate_email: values.altemail?.trim() ?? '',
    mobilenumber: values.mobileNumber.trim(),
    other_number: values.otherNumber?.trim() ?? '',
    gender: values.gender ?? '',
  }

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.profile.updateProfile({
      firstname: updated.firstname,
      surname: updated.surname,
      othername: updated.othername,
      email: updated.email,
      altemail: updated.alternate_email,
      mobile_number: updated.mobilenumber,
      other_number: updated.other_number,
      gender: updated.gender,
      displayname: updated.displayname,
      country: updated.country,
    })
    if (response.status === 1) {
      emit('updated', updated)
      $toast.success(response.msg || 'Your profile has been updated.')
      open.value = false
    } else {
      errorMessage.value =
        response.msg || "We couldn't update your profile. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
