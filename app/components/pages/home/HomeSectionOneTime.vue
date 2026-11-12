<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <div
        v-motion-slide-visible-once-bottom
        class="bg-primary/8 border-primary/20 mx-auto max-w-4xl rounded-xl border px-6 py-10 text-center sm:px-12 sm:py-12"
      >
        <h2
          v-motion-reveal
          :delay="150"
          class="text-xl leading-snug font-semibold tracking-tight text-balance sm:text-2xl"
        >
          For One Time Password and Financial Institution / Bank Traffic.
        </h2>
        <p
          v-motion-fade-visible-once
          :delay="350"
          class="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed text-pretty"
        >
          We have a special pricing and onboarding process to ensure your sender
          name gets delivered to all networks regardless of whether or not they
          are DND active. Do reach us via
          <a
            href="mailto:support@multitexter.com"
            class="text-primary font-semibold whitespace-nowrap underline underline-offset-2 hover:no-underline"
          >
            support@multitexter.com</a
          >
          or contact us
          <NuxtLink
            to="/contact-sales"
            class="text-primary font-semibold underline underline-offset-2 hover:no-underline"
          >
            HERE</NuxtLink
          >.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
