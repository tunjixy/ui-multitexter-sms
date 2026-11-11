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

    <div class="wrapper relative py-16 lg:py-24">
      <p class="text-primary text-xs font-semibold tracking-[0.25em] uppercase">
        Caution Words
      </p>
      <h1
        class="mt-4 max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
      >
        What to avoid for better delivery.
      </h1>
      <p
        class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
      >
        Some sender names and message content can stop your SMS from being
        delivered. Follow these guidelines before sending to your recipients.
      </p>
    </div>
  </section>
</template>
