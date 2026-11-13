<template>
  <NuxtLayout>
    <main>
      <NuxtLoadingIndicator :height="3" color="#00D492" />
      <NuxtRouteAnnouncer />
      <NuxtPage />

      <Teleport :to="toastHost">
        <Toaster
          position="top-right"
          :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
          rich-colors
        />
      </Teleport>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()
const site = useSiteConfig()
const { isLoggedIn } = storeToRefs(useUserStore())
const { fetchUserDetails } = useAuth()
const { top: topModal } = useModalStack()

const toastHost = computed(() =>
  topModal.value ? `dialog[data-ui-modal="${topModal.value}"]` : '#teleports',
)

const canonicalUrl = computed(
  () => `${site.url}${route.path.replace(/\/+$/, '') || '/'}`,
)

onMounted(() => {
  if (isLoggedIn.value) {
    fetchUserDetails()
  }
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

useSeoMeta({
  ogUrl: canonicalUrl,
  ogImage: `${site.url}/og-image.jpg`,
})
</script>
