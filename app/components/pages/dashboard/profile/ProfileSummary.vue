<template>
  <div>
    <div v-if="loading" class="space-y-6">
      <UiSkeleton class="h-32 w-full rounded-2xl" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UiSkeleton v-for="n in 4" :key="n" class="h-28 w-full rounded-2xl" />
      </div>
      <UiSkeleton class="h-72 w-full rounded-2xl" />
    </div>

    <UiErrorState
      v-else-if="error || !profile || !summary"
      @try-again="fetchProfile"
    />

    <div v-else class="space-y-6">
      <section
        class="border-border bg-surface flex flex-wrap items-center gap-5 rounded-2xl border p-6"
      >
        <span
          class="bg-primary/10 text-primary flex size-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold uppercase"
        >
          <template v-if="initials">{{ initials }}</template>
          <UserIcon v-else class="size-7" />
        </span>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-xl font-bold tracking-tight wrap-break-word">
              {{ fullName || summary.displayname || 'Your account' }}
            </h2>
            <span
              v-if="summary.account_type"
              class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize"
            >
              {{ summary.account_type }}
            </span>
          </div>
          <p class="text-muted-foreground mt-0.5 text-sm break-all">
            {{ profile.email }}
          </p>

          <ul
            class="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs"
          >
            <li>
              Customer ID
              <span class="text-foreground font-medium">
                {{ summary.userid }}
              </span>
            </li>
            <li v-if="memberSince">
              Member since
              <time
                :datetime="summary.created"
                class="text-foreground font-medium"
              >
                {{ memberSince }}
              </time>
            </li>
            <li v-if="lastMessage">
              Last message sent
              <time
                :datetime="summary.lastmessage"
                class="text-foreground font-medium"
              >
                {{ lastMessage }}
              </time>
            </li>
          </ul>
        </div>
      </section>

      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="stat in stats"
          :key="stat.label"
          class="border-border bg-surface rounded-2xl border p-5"
        >
          <p class="text-muted-foreground flex items-center gap-2 text-sm">
            <component :is="stat.icon" class="text-primary size-4 shrink-0" />
            {{ stat.label }}
          </p>
          <p class="mt-3 text-2xl font-bold tracking-tight">
            {{ stat.value }}
          </p>
        </li>
      </ul>

      <section class="border-border bg-surface rounded-2xl border p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="font-semibold">Personal details</h2>
            <p class="text-muted-foreground mt-1 text-sm">
              How we address you and where we can reach you.
            </p>
          </div>
          <UiButton variant="outline" radius="lg" @click="editing = true">
            <template #leading>
              <PencilIcon class="size-4" />
            </template>
            Edit profile
          </UiButton>
        </div>

        <div class="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="detail in details" :key="detail.label" class="min-w-0">
            <div class="text-muted-foreground text-sm">{{ detail.label }}</div>
            <div
              :class="[
                'mt-1 text-sm wrap-break-word',
                detail.value ? 'font-medium' : 'text-muted-foreground',
              ]"
            >
              {{ detail.value || 'Not set' }}
            </div>
          </div>
        </div>
      </section>

      <section class="border-border bg-surface rounded-2xl border p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="font-semibold">Referrals</h2>
            <p class="text-muted-foreground mt-1 text-sm">
              People you've invited and the commission you've earned.
            </p>
          </div>
          <NuxtLink
            to="/dashboard/refer"
            class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
          >
            View referrals
            <ArrowRightIcon class="size-4" />
          </NuxtLink>
        </div>

        <div class="mt-6 grid gap-5 sm:grid-cols-3">
          <div v-for="item in referrals" :key="item.label">
            <div class="text-muted-foreground text-sm">{{ item.label }}</div>
            <div class="mt-1 text-xl font-bold tracking-tight">
              {{ item.value }}
            </div>
          </div>
        </div>
      </section>

      <EditProfileModal
        v-model:open="editing"
        :profile="profile"
        @updated="onUpdated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  BookUserIcon,
  CoinsIcon,
  GiftIcon,
  PencilIcon,
  SendIcon,
  UserIcon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { Profile, ProfileSummary } from '@/types/profile'

const { user } = storeToRefs(useUserStore())
const { fetchUserDetails } = useAuth()

const profile = ref<Profile | null>(null)
const summary = ref<ProfileSummary | null>(null)
const loading = ref(true)
const error = ref(false)
const editing = ref(false)

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''

const fullName = computed(() =>
  [profile.value?.firstname, profile.value?.othername, profile.value?.surname]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(' '),
)

const initials = computed(() =>
  [profile.value?.firstname, profile.value?.surname]
    .map((name) => name?.trim().charAt(0))
    .filter(Boolean)
    .join(''),
)

const memberSince = computed(() =>
  useDateFormat(summary.value?.created, 'Do MMM YYYY'),
)
const lastMessage = computed(() =>
  useDateFormat(summary.value?.lastmessage, 'Do MMM YYYY'),
)

const stats = computed(() => {
  if (!summary.value) return []
  const { balance, freesms, total_message, total_contacts } = summary.value
  return [
    {
      icon: CoinsIcon,
      label: 'Unit balance',
      value: formatNumberWithComma(balance || 0),
    },
    {
      icon: GiftIcon,
      label: 'Free SMS',
      value: formatNumberWithComma(freesms || 0),
    },
    {
      icon: SendIcon,
      label: 'Messages sent',
      value: formatNumberWithComma(total_message || 0),
    },
    {
      icon: BookUserIcon,
      label: 'Contacts',
      value: formatNumberWithComma(total_contacts || 0),
    },
  ]
})

const details = computed(() => {
  if (!profile.value) return []
  const {
    firstname,
    surname,
    othername,
    email,
    alternate_email,
    displayname,
    mobilenumber,
    other_number,
    gender,
  } = profile.value
  return [
    { label: 'First name', value: firstname },
    { label: 'Surname', value: surname },
    { label: 'Other name', value: othername },
    { label: 'Email address', value: email },
    { label: 'Alternate email', value: alternate_email },
    { label: 'Sender name', value: displayname },
    { label: 'Phone number', value: mobilenumber },
    { label: 'Other number', value: other_number },
    { label: 'Gender', value: capitalize(gender) },
  ]
})

const referrals = computed(() => {
  if (!summary.value) return []
  const { no_referer, total_commission, total_paid_commission } = summary.value
  return [
    {
      label: 'People referred',
      value: formatNumberWithComma(no_referer || 0),
    },
    {
      label: 'Commission earned',
      value: formatNaira(Number(total_commission) || 0),
    },
    {
      label: 'Commission paid',
      value: formatNaira(Number(total_paid_commission) || 0),
    },
  ]
})

const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = false
    const [profileRes, summaryRes] = await Promise.all([
      apiClient.profile.fetchProfile(),
      apiClient.profile.fetchProfileSummary(),
    ])
    profile.value = profileRes.success
    summary.value = summaryRes.success
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const onUpdated = (updated: Profile) => {
  profile.value = updated
  if (user.value) {
    user.value = {
      ...user.value,
      firstname: updated.firstname,
      lastname: updated.surname,
      othernames: updated.othername,
      displayname: updated.displayname,
      altemail: updated.alternate_email,
      mobilenumber: updated.mobilenumber,
      othernumbers: updated.other_number,
      gender: updated.gender,
    }
  }
  fetchUserDetails()
}

onMounted(fetchProfile)
</script>
