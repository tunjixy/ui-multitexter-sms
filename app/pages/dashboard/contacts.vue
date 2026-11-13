<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Contacts</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Add numbers to your phonebook. Type or paste them in, or upload a CSV
        file.
      </p>

      <UiTabs
        v-model="activeTab"
        :items="tabs"
        variant="segmented"
        aria-label="How to add contacts"
        class="mt-6"
      />

      <div role="tabpanel" class="mt-6 overflow-x-clip">
        <Transition name="slide-tab" mode="out-in">
          <KeepAlive>
            <InsertContact v-if="activeTab === 'insert'" />
            <UploadContact v-else-if="activeTab === 'upload'" />
          </KeepAlive>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Contacts')

const activeTab = ref('insert')
const tabs = [
  {
    value: 'insert',
    label: 'Insert',
  },
  {
    value: 'upload',
    label: 'Upload',
  },
]

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Contacts',
})
</script>
