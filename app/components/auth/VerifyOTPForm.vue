<template>
  <div class="mx-auto w-full py-4 sm:py-0 md:max-w-lg">
    <p class="text-2xl font-bold md:text-3xl">Enter verification code</p>
    <p class="text-muted-foreground mt-1">
      We sent a 6-digit code to your email
    </p>
    <div class="border-border bg-surface mt-6 rounded-lg border px-8 py-6">
      <form @submit.prevent>
        <UiOtpInput
          v-model="code"
          :length="6"
          :separator="3"
          name="otp"
          aria-label="Verification code"
          class="items-center"
        />

        <UiButton
          type="submit"
          raised
          block
          radius="md"
          :disabled="code.length < 6"
          class="mt-6"
        >
          Verify
        </UiButton>

        <p class="text-muted-foreground mt-4 text-center text-sm">
          Didn't get a code?
          <span v-if="countdown > 0" class="font-semibold tabular-nums">
            Resend in {{ formattedCountdown }}
          </span>
          <button
            v-else
            type="button"
            class="text-primary font-semibold"
            @click="startCountdown"
          >
            Resend code
          </button>
        </p>

        <p class="mt-3 text-center text-sm">
          <NuxtLink
            to="/login"
            class="text-primary inline-flex items-center gap-1.5 font-semibold"
          >
            <ArrowLeft class="size-4" />
            Back to login
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'

const RESEND_SECONDS = 60

const code = ref('')
const countdown = ref(RESEND_SECONDS)
let timer: ReturnType<typeof setInterval> | undefined

const formattedCountdown = computed(
  () => `0:${String(countdown.value).padStart(2, '0')}`,
)

const startCountdown = () => {
  clearInterval(timer)
  countdown.value = RESEND_SECONDS
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

onMounted(startCountdown)
onBeforeUnmount(() => clearInterval(timer))
</script>
