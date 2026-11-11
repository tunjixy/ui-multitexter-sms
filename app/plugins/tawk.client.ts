const TAWK_SRC = 'https://embed.tawk.to/5e9e109e69e9320caac5a432/default'
const TRIGGER_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart']
const FALLBACK_DELAY_MS = 5000

// Loads the chat widget on the first interaction, or after a delay once the page is idle
export default defineNuxtPlugin(() => {
  onNuxtReady(() => {
    const load = () => {
      clearTimeout(timer)
      TRIGGER_EVENTS.forEach((event) =>
        window.removeEventListener(event, load),
      )

      const script = document.createElement('script')
      script.src = TAWK_SRC
      script.async = true
      document.body.append(script)
    }

    TRIGGER_EVENTS.forEach((event) =>
      window.addEventListener(event, load, { passive: true }),
    )
    const timer = setTimeout(load, FALLBACK_DELAY_MS)
  })
})
