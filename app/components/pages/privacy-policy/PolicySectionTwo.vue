<template>
  <section
    class="wrapper grid gap-12 py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20 lg:py-24"
  >
    <aside class="hidden lg:block">
      <nav aria-label="On this page" class="sticky top-32">
        <p
          class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
        >
          On this page
        </p>
        <ol class="border-border mt-5 border-l">
          <li v-for="(section, index) in sections" :key="section.id">
            <a
              :href="`#${section.id}`"
              :aria-current="activeId === section.id ? 'location' : undefined"
              :class="[
                '-ml-px flex items-baseline gap-3 border-l py-2 pl-4 text-sm transition-colors ease-in',
                activeId === section.id
                  ? 'border-primary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              ]"
              @click="activeId = section.id"
            >
              <span class="text-xs tabular-nums opacity-60">
                {{ formatIndex(index) }}
              </span>
              {{ section.title }}
            </a>
          </li>
        </ol>
      </nav>
    </aside>

    <div class="divide-border max-w-3xl divide-y">
      <section id="overview" class="scroll-mt-24 pb-12">
        <div class="flex items-baseline gap-4">
          <span class="text-primary text-sm font-semibold tabular-nums">
            01
          </span>
          <h2 class="text-2xl font-semibold tracking-tight">Overview</h2>
        </div>

        <p class="text-muted-foreground mt-6 leading-relaxed">
          <strong class="text-foreground font-semibold">Multitexter</strong>
          is committed to protecting the privacy and security of our customers
          and will like to certify that our users are fully informed about the
          way information is collected and used. The following sets forth the
          policies for the collection and use of personally identifiable
          information by multitexter.
        </p>

        <div
          class="border-primary/25 bg-primary/5 mt-8 flex gap-4 rounded-2xl border p-6"
        >
          <ShieldCheck class="text-primary mt-0.5 size-5 shrink-0" />
          <p class="leading-relaxed font-medium">
            Multitexter will not sell out your personal information for any
            reason, as we understand the need for your privacy.
          </p>
        </div>

        <p class="text-muted-foreground mt-8 leading-relaxed">
          <strong class="text-foreground font-semibold">Multitexter</strong>
          may use certain non-affiliated third parties as service providers, and
          may share nonpublic personal information with them in order to fulfil
          the services requested. While we carefully select trusted and
          reputable third-party companies with which to partner, multitexter is
          not responsible for the privacy practices of third-party partners or
          the privacy policies or content of third-party partner sites.
        </p>
      </section>

      <section id="use-of-data" class="scroll-mt-24 py-12">
        <div class="flex items-baseline gap-4">
          <span class="text-primary text-sm font-semibold tabular-nums">
            02
          </span>
          <h2 class="text-2xl font-semibold tracking-tight">
            Use of Data Collected
          </h2>
        </div>

        <p class="text-muted-foreground mt-6 leading-relaxed">
          We use your personal, demographic and profile data to enhance your
          experience at our site and to enable us to present content in which we
          think you may be interested. We use your contact information to send
          you information about our company and promotional material from our
          partners. We may also use your personal, demographic and profile data
          to improve our site, for statistical analysis, for marketing and
          promotional purposes, and for editorial or feedback purposes for our
          advertisers. Information collected by us may be added to our databases
          and used for future e-mails or postal mailings regarding site updates,
          new products and services, upcoming events, and/or status of orders
          placed online.
        </p>
      </section>

      <section id="disclosure" class="scroll-mt-24 py-12">
        <div class="flex items-baseline gap-4">
          <span class="text-primary text-sm font-semibold tabular-nums">
            03
          </span>
          <h2 class="text-2xl font-semibold tracking-tight">
            Disclosure of Data to Third Parties
          </h2>
        </div>

        <p class="text-muted-foreground mt-6 leading-relaxed">
          We may disclose data we collect to third parties as described below.
          If you choose to provide personal information, it may be used for the
          following purposes:
        </p>

        <ol class="mt-6 space-y-4">
          <li
            v-for="(purpose, index) in disclosurePurposes"
            :key="index"
            class="flex gap-4"
          >
            <span
              class="border-border bg-surface text-primary flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums"
            >
              {{ index + 1 }}
            </span>
            <span class="text-muted-foreground pt-0.5 leading-relaxed">
              {{ purpose }}
            </span>
          </li>
        </ol>
      </section>

      <section id="changes" class="scroll-mt-24 py-12">
        <div class="flex items-baseline gap-4">
          <span class="text-primary text-sm font-semibold tabular-nums">
            04
          </span>
          <h2 class="text-2xl font-semibold tracking-tight">
            Changes to this Privacy Policy
          </h2>
        </div>

        <p class="text-muted-foreground mt-6 leading-relaxed">
          We reserve the right to revise and update this Privacy Policy at any
          time by posting the changes online at our site, and will apply to all
          information collected by
          <a
            href="http://multitexter.com"
            class="text-primary font-medium hover:underline"
          >
            multitexter.com
          </a>
          both prior to and following the effective date. Your use of the Site
          following any such revisions will be deemed your acceptance of such
          revisions.
        </p>
      </section>

      <div class="pt-12">
        <div
          class="bg-surface border-border relative overflow-hidden rounded-3xl border p-8 sm:p-10"
        >
          <div
            aria-hidden="true"
            class="bg-primary/10 pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full blur-3xl"
          />
          <div
            class="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div class="max-w-md">
              <h2 class="text-2xl font-semibold tracking-tight">
                Read our Terms of Service
              </h2>
              <p class="text-muted-foreground mt-3 leading-relaxed">
                The rules for using Multitexter and its services.
              </p>
            </div>
            <NuxtLink
              to="/terms"
              class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
            >
              View Terms
              <ArrowRight class="size-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, ShieldCheck } from '@lucide/vue'

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'use-of-data', title: 'Use of Data Collected' },
  { id: 'disclosure', title: 'Disclosure of Data to Third Parties' },
  { id: 'changes', title: 'Changes to this Privacy Policy' },
]

const activeId = ref('overview')
const sectionEls = ref<HTMLElement[]>([])

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

onMounted(() => {
  sectionEls.value = sections
    .map(({ id }) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
})

useIntersectionObserver(
  sectionEls,
  (entries) => {
    const visible = entries.find((entry) => entry.isIntersecting)
    if (visible) activeId.value = visible.target.id
  },
  { rootMargin: '-30% 0px -65% 0px' },
)

const disclosurePurposes = [
  'Considering you for an account with the third-party company.',
  'Sharing of your information with trusted third parties such as financial services providers.',
  'As required by law.',
  'For marketing products and services which we determine, in our sole judgment, that you might find of interest via mediums such as postal direct mail and telemarketing.',
]
</script>
