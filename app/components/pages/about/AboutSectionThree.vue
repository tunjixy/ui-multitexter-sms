<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper grid items-center gap-12 lg:grid-cols-2 xl:gap-16">
      <div>
        <p
          v-motion-fade-visible-once
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Sector Solutions
        </p>

        <h2
          v-motion-reveal
          :delay="100"
          class="text-foreground mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Tailored for every sector in modern Nigeria.
        </h2>

        <p
          v-motion-fade-visible-once
          :delay="300"
          class="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
        >
          Whether communicating order updates for quick-service restaurants or
          dispatching session notices for academic centers, MultiTexter scales
          with specific operational criteria.
        </p>

        <ol class="mt-10 grid gap-4">
          <li
            v-for="(sector, index) in sectors"
            :key="sector.title"
            v-motion-slide-visible-once-bottom
            :delay="index * 100"
            class="bg-surface border-border hover:border-primary/40 flex gap-4 rounded-xl border p-5 transition-colors ease-in"
          >
            <span
              class="bg-primary text-dark-blue flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <div>
              <h3 class="text-foreground text-sm font-semibold sm:text-base">
                {{ sector.title }}
              </h3>
              <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                {{ sector.description }}
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div
        v-motion-slide-visible-once-bottom
        :delay="200"
        class="bg-surface border-border relative overflow-hidden rounded-3xl border p-7 sm:p-10"
      >
        <span
          aria-hidden="true"
          class="border-primary/15 pointer-events-none absolute top-1/2 -right-32 size-96 rounded-full border"
        />

        <div class="relative">
          <p
            class="text-primary text-xs font-semibold tracking-[0.2em] uppercase"
          >
            Operational Standards
          </p>

          <h3
            class="text-foreground mt-3 text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl"
          >
            Committed to transparent carrier analytics
          </h3>

          <p
            class="text-muted-foreground mt-5 text-sm leading-relaxed sm:text-base"
          >
            We do not compromise on unit deductibility transparency. Every
            campaign generated through MultiTexter returns detailed network
            receipt data, so you never pay for lost messages or unverified
            handshakes.
          </p>

          <ul class="mt-8 grid gap-4 sm:grid-cols-2">
            <li
              v-for="standard in standards"
              :key="standard.title"
              class="bg-background border-border rounded-xl border p-5"
            >
              <h4 class="text-primary text-sm font-semibold sm:text-base">
                {{ standard.title }}
              </h4>
              <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
                {{ standard.description }}
              </p>
            </li>
          </ul>

          <p
            class="bg-primary/10 border-primary/30 text-foreground mt-8 rounded-xl border p-5 text-sm leading-relaxed"
          >
            Backed by 24/7 dedicated support desk stationed in Lagos, ready to
            assist via direct phone lines, live chat, or email ticketing.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Item {
  title: string
  description: string
}

const sectors: Item[] = [
  {
    title: 'Retail & QSR Chains',
    description:
      'Flash promotions, instant loyalty point confirmations, and customer pickup dispatch texts.',
  },
  {
    title: 'Fintechs & Micro-Lenders',
    description:
      'Repayment reminders, time-sensitive verification PINs, and automated account statements.',
  },
  {
    title: 'Churches & Non-Profits',
    description:
      'Weekly congregation fellowship schedules, event notices, and member welfare notifications.',
  },
]

const standards: Item[] = [
  {
    title: 'Sender ID Whitelisting',
    description:
      'Full assistance registering official corporate sender names with the NCC and network providers.',
  },
  {
    title: 'Dynamic Contact Tagging',
    description:
      'Segment lists by state, purchase frequency, or branch location for hyper-personalized dispatch.',
  },
]
</script>
