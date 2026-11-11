import tailwindcss from '@tailwindcss/vite'

const noindex = { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'en',
      },
      viewport: 'width=device-width, initial-scale=1',
      title: 'Best Bulk SMS Service in Nigeria',
      titleTemplate: '%s | Multitexter',
      meta: [
        {
          name: 'description',
          content:
            "Buy and send bulk SMS on Nigeria and Africa's reliable text messaging provider, platform, portal and gateway. Best free and premium bulk SMS @ 1 unit per SMS.",
        },
        {
          name: 'keywords',
          content: [
            'bulk sms',
            'bulk sms nigeria',
            'buy bulk sms',
            'send bulk sms',
            'cheap bulk sms',
            'bulk sms provider',
            'bulk sms gateway',
            'bulk sms reseller',
            'sms marketing',
            'transactional sms',
            'promotional sms',
            'otp sms',
            'sms api',
            'smpp',
            'sender id registration',
            'voice sms',
            'mtn bulk sms',
            'airtel bulk sms',
            'glo bulk sms',
            'T2 bulk sms',
            'multitexter',
          ].join(', '),
        },
        { name: 'theme-color', content: '#40c2f3' },
        {
          name: 'google-site-verification',
          content: 'Qnew9MfPLuroCdyTkh09XrdlNs8G5ZNWLOXMLz475w4',
        },
        {
          name: 'country',
          content: 'NG',
        },
        {
          name: 'author',
          content: 'MultiTexter.com',
        },
        {
          name: 'language',
          content: 'en',
        },
        // Open Graph (og:url and og:image are set per page in app.vue)
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: 'Multitexter',
        },
        {
          property: 'og:title',
          content:
            'Multitexter Bulk SMS: Send Free SMS to all Nigerian Networks. Get free delivery reports & API',
        },
        {
          property: 'og:description',
          content:
            "Buy and send bulk SMS on Nigeria and Africa's reliable text messaging provider, platform, portal and gateway. Best free and premium bulk SMS @ 1 unit per SMS.",
        },
        // Twitter Card (title, description and image fall back to the og:* tags)
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@multitexter',
        },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'vue-sonner/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],
  imports: {
    dirs: ['stores'],
  },
  colorMode: {
    classSuffix: '',
  },
  site: {
    url: 'https://multitexter.com',
    name: 'Multitexter',
    description:
      'Smartest, fastest and most reliable bulk text messaging platform across Nigeria and Africa.',
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Multitexter',
      alternateName: 'MultiTexter BulkSMS',
      description:
        'Smartest, fastest and most reliable bulk text messaging platform across Nigeria and Africa.',
      logo: '/android-chrome-512x512.png',
      email: 'info@multitexter.com',
      telephone: '+2348148734028',
      address: {
        streetAddress: '6th Floor, 294 Herbert Macaulay Way, Sabo',
        addressLocality: 'Yaba',
        addressRegion: 'Lagos',
        addressCountry: 'NG',
      },
      sameAs: [
        'https://www.facebook.com/multitexterdotcom',
        'https://x.com/multitexter',
      ],
    },
  },
  runtimeConfig: {
    public: {
      BASE_URL: import.meta.env.APP_API_URL as string,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  routeRules: {
    // User dashboard renders only on client-side
    '/dashboard/**': { ssr: false, ...noindex },
    '/auth/**': noindex,
    '/forgot-password': noindex,
    '/reset-password': noindex,
    '/resend-activation': noindex,
    '/logout': noindex,
    '/users/**': noindex,
    '/user/**': noindex,
    '/payment-confirm/**': noindex,
    '/unsubscribe': noindex,
  },
  hooks: {
    'pages:extend'(pages) {
      pages.push(
        {
          name: 'login',
          path: '/login',
          file: '~/pages/auth/login.vue',
        },
        {
          name: 'signup',
          path: '/signup',
          file: '~/pages/auth/signup.vue',
        },
        {
          name: 'verify-otp',
          path: '/verify-otp',
          file: '~/pages/auth/verify-otp.vue',
        },
        {
          name: 'forgot-password',
          path: '/forgot-password',
          file: '~/pages/auth/forgot-password.vue',
        },
        {
          name: 'reset-password',
          path: '/reset-password',
          file: '~/pages/auth/reset-password.vue',
        },
        {
          name: 'resend-activation',
          path: '/resend-activation',
          file: '~/pages/auth/resend-activation.vue',
        },
        {
          name: 'logout',
          path: '/logout',
          file: '~/pages/auth/logout.vue',
        },
      )
    },
  },
})
