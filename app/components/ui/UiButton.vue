<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span
      v-if="loading"
      class="absolute inset-0 m-auto size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <span
      class="inline-flex items-center justify-center gap-2"
      :class="{ invisible: loading }"
    >
      <span v-if="$slots.leading" class="inline-flex text-[1.1em]">
        <slot name="leading" />
      </span>
      <span>
        <slot />
      </span>
      <span v-if="$slots.trailing" class="inline-flex text-[1.1em]">
        <slot name="trailing" />
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'text'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  raised?: boolean
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  raised: false,
  radius: 'none',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const base = `relative shrink-0 items-center justify-center whitespace-nowrap border font-semibold leading-none
  select-none outline-none transition focus-visible:ring-3
  disabled:cursor-not-allowed disabled:opacity-50`

const variants = {
  primary:
    'border-transparent bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/35',
  outline:
    'border-primary bg-transparent text-primary hover:bg-primary/10 focus-visible:ring-primary/35',
  ghost:
    'border-transparent bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/35',
  danger:
    'border-transparent bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/35',
  text: 'border-transparent bg-transparent text-foreground focus-visible:ring-primary/35',
} as const

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
} as const

const radii = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

const raisedClasses =
  'shadow-sm hover:shadow-md enabled:active:translate-y-px enabled:active:shadow-none'

const classes = computed(() => [
  base,
  variants[props.variant],
  sizes[props.size],
  radii[props.radius],
  props.block ? 'flex w-full' : 'inline-flex',
  props.loading ? 'cursor-progress' : 'cursor-pointer',
  props.raised && raisedClasses,
])

const onClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>
