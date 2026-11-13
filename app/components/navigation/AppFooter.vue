<template>
  <footer class="border-border relative isolate overflow-hidden border-t">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,var(--grid-dot)_1px,transparent_1.5px)] bg-size-[20px_20px] [--grid-dot:rgb(0_0_0/0.22)] dark:[--grid-dot:rgb(255_255_255/0.18)]"
    />

    <div class="wrapper pt-16 pb-14">
      <div
        class="grid grid-cols-1 gap-x-10 gap-y-12 pb-12 sm:grid-cols-2 lg:grid-cols-[3fr_2fr_2fr_3fr]"
      >
        <div>
          <AppLogo class="inline-block" />
          <p
            class="text-muted-foreground mt-2 max-w-68 text-sm leading-relaxed"
          >
            Smartest, fastest and most reliable bulk text messaging platform
            across Nigeria and Africa.
          </p>
          <h6 class="mt-5 max-w-68 text-xs font-bold tracking-wide uppercase">
            How does MultiTexter works? Register now to find out how
          </h6>
          <p
            class="text-muted-foreground mt-2 max-w-68 text-xs leading-relaxed"
          >
            First of all, you need to
            <NuxtLink
              to="/signup"
              class="text-primary font-medium hover:text-sky-300"
            >
              register here
            </NuxtLink>
            and we will create your account.
          </p>
        </div>

        <div>
          <h6 class="text-xs font-bold tracking-wide uppercase">Resources</h6>
          <ul class="mt-3.5 space-y-2.5">
            <li v-for="resource in resources" :key="resource.link">
              <NuxtLink
                :to="resource.link"
                class="text-muted-foreground text-sm transition-colors hover:text-black dark:hover:text-white"
              >
                {{ resource.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h6 class="text-xs font-bold tracking-wide uppercase">Quick Links</h6>
          <ul class="mt-3.5 space-y-2.5">
            <li v-for="link in quickLinks" :key="link.link">
              <NuxtLink
                :to="link.link"
                class="text-muted-foreground text-sm transition-colors hover:text-black dark:hover:text-white"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h6 class="text-xs font-bold tracking-wide uppercase">Need Help?</h6>
          <address
            class="text-muted-foreground mt-3.5 text-sm leading-relaxed not-italic"
          >
            131 Obafemi Awolowo way, Ikeja, Lagos, Nigeria
          </address>
          <a
            href="mailto:info@multitexter.com"
            class="mt-3 block text-sm text-sky-400 hover:text-sky-300"
          >
            info@multitexter.com
          </a>
          <a
            href="https://wa.me/2348148734028"
            target="_blank"
            rel="noopener"
            class="mt-5 flex items-center gap-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <span class="ml-1 size-2 shrink-0 rounded-full bg-emerald-400" />
            Chat on WhatsApp (08148734028)
          </a>
        </div>
      </div>

      <div
        class="border-border flex flex-col-reverse gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-muted-foreground text-xs">
          &copy; {{ currentYear }} Multitexter BulkSMS. All Rights Reserved
        </p>
        <ul class="flex items-center gap-4">
          <li v-for="social in socials" :key="social.name">
            <a
              :href="social.url"
              :title="social.name"
              :aria-label="social.name"
              target="_blank"
              rel="noopener"
              class="border-border text-muted-foreground bg-surface hover:text-primary flex size-8 items-center justify-center rounded-md border transition-colors"
            >
              <svg class="size-4" :viewBox="social.viewBox" fill="currentColor">
                <path
                  :d="social.path"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const resources = [
  { name: 'Coverage', link: '/sms-coverage' },
  { name: 'Privacy Policy', link: '/privacy-policy' },
  { name: 'Contact Sales', link: '/contact-sales' },
  { name: 'Integration Request', link: '/requests' },
  { name: 'Contact Us', link: '/contact' },
  { name: 'About Us', link: '/about' },
  { name: 'Terms & Condition', link: '/terms' },
]

const quickLinks = [
  { name: 'Register Sender Name', link: '/register-name' },
  { name: 'Network Status', link: '/network-status' },
  { name: 'Caution Words', link: '/caution-words' },
]

const socials = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/multitexterdotcom',
    viewBox: '0 0 24 24',
    path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
  },
  {
    name: 'X',
    url: 'https://twitter.com/intent/follow?original_referer=http%3A%2F%2Fwww.multitexter.com%2Fpages%2Fdevelopers&region=follow_link&screen_name=multitexter&tw_p=followbutton',
    viewBox: '-2 -2 28 28',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
]

const currentYear = new Date().getFullYear()
</script>
