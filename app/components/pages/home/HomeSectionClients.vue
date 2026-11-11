<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <div class="text-center">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
          Our Clients
        </h2>
        <p class="text-muted-foreground mt-3 text-base">
          Here are some of our clients that use us
        </p>
      </div>

      <div
        class="marquee mt-12 overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div class="marquee-track flex w-max">
          <ul
            v-for="copy in 2"
            :key="copy"
            :aria-hidden="copy === 2 || undefined"
            class="flex shrink-0 gap-4 pr-4"
          >
            <li
              v-for="client in clients"
              :key="client.image"
              class="flex w-20 shrink-0 items-center justify-center sm:w-48"
            >
              <NuxtImg
                :src="`/images/${client.image}`"
                :alt="copy === 1 ? client.name : ''"
                loading="lazy"
                :class="[
                  'h-14 w-auto object-contain sm:h-16',
                  !client.transparent && 'rounded-lg bg-white',
                ]"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Client {
  name: string
  image: string
  transparent?: boolean
}

const clients: Client[] = [
  { name: 'Burger King', image: 'burger-king.png', transparent: true },
  { name: 'Loanbook', image: 'loan-book.jpeg' },
  { name: 'Covenant University', image: 'covenant.jpg' },
  { name: 'PrepClass', image: 'prep.png' },
  { name: 'BuyPower', image: 'buypowerng.jpg' },
  { name: 'The Redeemed Christian Church of God', image: 'rccg.png' },
  { name: 'IROKOtv', image: 'iroko.png', transparent: true },
  { name: "Domino's Pizza", image: 'dominous.png' },
  { name: 'Blackbet', image: 'blackbelt.jpg' },
]
</script>

<style scoped>
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.marquee-track {
  animation: marquee 50s linear infinite;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}
</style>
