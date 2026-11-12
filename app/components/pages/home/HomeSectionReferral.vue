<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <div
        v-motion-slide-visible-once-bottom
        class="bg-dark-blue relative overflow-hidden rounded-xl border border-white/10 text-white"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-48 -left-40 size-112 rounded-full bg-teal-400/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          class="bg-primary/20 pointer-events-none absolute -top-48 -right-24 size-112 rounded-full blur-3xl"
        />

        <div class="relative grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div class="p-8 sm:p-12 lg:p-16">
            <p
              v-motion-fade-visible-once
              :delay="150"
              class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
            >
              Referral Programme
            </p>
            <h2
              v-motion-reveal
              :delay="250"
              class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              Refer MultiTexter &amp; make money
            </h2>
            <p
              v-motion-fade-visible-once
              :delay="450"
              class="mt-6 max-w-xl text-base leading-relaxed text-white/75"
            >
              After signing up for bulk SMS, a unique referral link is generated
              for you. Go to Profile Summary after logging in to retrieve your
              referral. Send your referral link to someone to register, and when
              the person recharges, you get extra units. You can sell your extra
              units by transferring the units and get cash from them.
            </p>

            <div
              v-motion-fade-visible-once
              :delay="550"
              class="mt-8 flex flex-wrap gap-3"
            >
              <NuxtLink
                to="/signup"
                class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 inline-flex h-12 items-center rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
              >
                Register now
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="focus-visible:ring-primary/40 inline-flex h-12 items-center rounded-lg border border-white/20 px-6 text-sm font-semibold transition-colors ease-in outline-none hover:bg-white/10 focus-visible:ring-3"
              >
                Login
              </NuxtLink>
            </div>
          </div>

          <div
            class="flex flex-col justify-center border-t border-white/10 p-8 sm:p-12 lg:border-t-0 lg:border-l"
          >
            <p
              class="text-xs font-medium tracking-[0.15em] text-white/50 uppercase"
            >
              Your link looks like this
            </p>
            <p
              class="text-primary mt-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-mono text-sm break-all"
            >
              https://web.multitexter.com/signup?ref=refid
            </p>

            <ol class="mt-6 space-y-3 text-sm text-white/80">
              <li
                v-for="(step, index) in steps"
                :key="step"
                v-motion-slide-visible-once-right
                :delay="400 + index * 100"
                class="flex gap-3"
              >
                <span class="text-primary font-semibold tabular-nums">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                {{ step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  'Share your unique link',
  'Your contact registers and recharges',
  'Receive extra units, transfer them for cash',
]
</script>
