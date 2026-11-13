<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Profile</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Your account details, how the dashboard looks and your password.
      </p>

      <UiTabs
        v-model="activeTab"
        :items="tabs"
        variant="segmented"
        class="mt-6"
      />

      <div role="tabpanel" class="mt-6 overflow-x-clip">
        <Transition name="slide-tab" mode="out-in">
          <KeepAlive>
            <ProfileSummary v-if="activeTab === 'bio'" />
            <ProfileSetting v-else-if="activeTab === 'settings'" />
          </KeepAlive>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Profile')

const activeTab = ref('bio')
const tabs = [
  {
    value: 'bio',
    label: 'Bio',
  },
  {
    value: 'settings',
    label: 'Settings',
  },
]

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Profile',
})
</script>
