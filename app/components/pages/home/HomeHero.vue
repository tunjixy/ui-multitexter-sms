<template>
  <section class="relative overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
    />

    <div
      class="wrapper relative grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-24 xl:gap-20"
    >
      <div>
        <p
          v-motion-fade-visible-once
          class="border-border bg-surface/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur"
        >
          <span class="size-1.5 shrink-0 rounded-full bg-emerald-500" />
          Welcome to MultiTexter Bulk SMS
        </p>

        <h1
          v-motion-reveal
          :delay="100"
          class="mt-6 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
        >
          Send Bulk SMS.
          <span class="text-primary block">Save time, save money.</span>
        </h1>

        <p
          v-motion-fade-visible-once
          :delay="300"
          class="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
        >
          Reach thousands of people on any network in Nigeria with one click, at
          one unit per SMS, with instant delivery reports.
        </p>

        <div
          v-motion-fade-visible-once
          :delay="450"
          class="border-border mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t pt-8"
        >
          <div
            v-for="stat in stats"
            :key="stat.value"
            class="flex flex-col-reverse"
          >
            <dt class="text-muted-foreground mt-1 text-sm">
              {{ stat.label }}
            </dt>
            <dd class="text-2xl font-semibold tracking-tight sm:text-3xl">
              {{ stat.value }}
            </dd>
          </div>
        </div>
      </div>

      <div
        v-motion-slide-visible-once-right
        :delay="250"
        class="bg-surface/20 border-border rounded-xl border p-5 shadow-xl shadow-black/5 sm:p-8"
      >
        <h2 class="text-lg font-semibold">Quick compose</h2>
        <div class="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <div>
            <UiInput
              id="compose-sender"
              v-model="sender"
              label="From"
              name="sender"
              placeholder="Sender name"
              autocomplete="off"
              class="mt-2"
              @keypress="onlyAlphabets"
            />
            <p class="text-muted-foreground mt-2 text-xs">
              Note: Don't use bank names
            </p>
          </div>

          <div>
            <UiInput
              id="compose-recipients"
              v-model="recipients"
              label="Recipients"
              name="recipients"
              placeholder="Numbers (e.g. 08152425262,2347047373872)"
              autocomplete="off"
              class="mt-2"
              @keypress="isNumber"
              @blur="formatRecipients"
            />
            <p class="text-muted-foreground mt-2 text-xs">
              Recipients:
              <strong class="text-foreground font-semibold tabular-nums">
                {{ formatNumberWithComma(totalRecipients) }}
              </strong>
            </p>
          </div>
        </div>

        <div class="mt-5">
          <UiTextarea
            id="compose-message"
            v-model="message"
            label="Message"
            name="message"
            placeholder="Message"
            :rows="4"
            maxlength="1224"
            class="mt-2"
            @keypress="replaceKeyword"
          />
          <div
            class="text-muted-foreground mt-2 flex items-center justify-between gap-4 text-xs tabular-nums"
          >
            <p>
              Characters left:
              <strong class="text-foreground font-semibold">
                {{ charactersLeft }}</strong
              >/{{ maxCharacter }}
            </p>
            <p>
              Page(s):
              <strong class="text-foreground font-semibold">{{ page }}</strong>
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/signup"
            class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3 sm:flex-1"
          >
            Register to send
            <ArrowRight class="size-4" />
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-12 items-center justify-center rounded-lg border px-8 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

const stats = [
  { value: '1 unit', label: 'per SMS, any network' },
  { value: 'Tier 1', label: 'delivery routes' },
]

const sender = ref('')
const recipients = ref('')
const message = ref('')

const {
  count,
  maxCharacter,
  page,
  totalRecipients,
  formatRecipients,
  checkMessageLength,
  replaceKeyword,
  onlyAlphabets,
} = useComposeMessage(recipients, message)

const charactersLeft = computed(() => maxCharacter.value - count.value)

watch(message, checkMessageLength)
</script>
