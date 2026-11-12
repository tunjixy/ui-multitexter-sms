<template>
  <section class="border-border relative overflow-hidden border-b">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
    />

    <div
      class="wrapper relative grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:py-24 xl:gap-20"
    >
      <div>
        <p
          v-motion-fade-visible-once
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Developers
        </p>
        <h1
          v-motion-reveal
          :delay="100"
          class="mt-4 text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
        >
          The complete SMS API and documentation.
        </h1>
        <p
          v-motion-fade-visible-once
          :delay="300"
          class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          Integrate bulk SMS into your website or any application that can make
          HTTP requests, in PHP, Java, .NET, Visual Basic or any language of
          your choice.
        </p>

        <div
          v-motion-fade-visible-once
          :delay="450"
          class="mt-8 flex flex-wrap gap-3"
        >
          <a
            href="/MultiTexter_HTTP_SMS_API%202.0.pdf"
            target="_blank"
            rel="noopener"
            class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            <FileText class="size-4" />
            Get API Documentation
          </a>
          <a
            href="https://documenter.getpostman.com/view/2209864/TzzGFY4f"
            target="_blank"
            rel="noopener"
            class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 items-center gap-2 rounded-lg border px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            View on Postman
            <ArrowUpRight class="size-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, FileText } from '@lucide/vue'
</script>
