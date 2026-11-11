<template>
  <span
    ref="wrapper"
    class="contents"
    @pointerover="onPointerover"
    @pointerout="onPointerout"
    @pointerdown="onPointerdown"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <slot />
    <span
      v-if="content || $slots.content"
      :id="tooltipId"
      ref="tooltip"
      v-bind="tooltipAttrs"
      popover="manual"
      role="tooltip"
      :class="[tooltipClasses, attrs.class]"
      :style="{ maxWidth: toCss(maxWidth) }"
    >
      <slot name="content">{{ content }}</slot>
      <span
        v-if="arrow"
        class="absolute size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-inherit"
        :style="arrowStyle"
        aria-hidden="true"
      />
    </span>
  </span>
</template>

<script setup lang="ts">
type Side = 'top' | 'right' | 'bottom' | 'left'

interface Props {
  content?: string
  placement?: Side
  delay?: 0 | 200 | 500
  arrow?: boolean
  maxWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  content: undefined,
  placement: 'top',
  delay: 0,
  arrow: true,
  maxWidth: 240,
})

defineSlots<{
  /** The element the tooltip describes, e.g. a <UiButton>. */
  default?: () => unknown
  content?: () => unknown
}>()

// `class` and other attributes style the tooltip bubble itself.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const tooltipAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const tooltipId = `ui-tooltip-${useId()}`
const wrapperEl = useTemplateRef<HTMLSpanElement>('wrapper')
const tooltipEl = useTemplateRef<HTMLSpanElement>('tooltip')

const toCss = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

const triggerEl = () => {
  const first = wrapperEl.value?.firstElementChild
  return first && first !== tooltipEl.value ? (first as HTMLElement) : null
}

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]'
const describe = () => {
  const trigger = triggerEl()
  const target = trigger?.matches(FOCUSABLE)
    ? trigger
    : (trigger?.querySelector(FOCUSABLE) ?? trigger)
  if (!target) return
  const ids = (target.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
  if (!ids.includes(tooltipId)) {
    target.setAttribute('aria-describedby', [...ids, tooltipId].join(' '))
  }
}
onMounted(describe)

const open = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let pending: boolean | undefined
let keyboardFocus = false

const schedule = (value: boolean, delay: number) => {
  if (pending === value) return
  clearTimeout(timer)
  pending = undefined
  if (open.value === value) return
  if (!delay) {
    open.value = value
    return
  }
  pending = value
  timer = setTimeout(() => {
    pending = undefined
    open.value = value
  }, delay)
}

const isInside = (node: EventTarget | null) =>
  node instanceof Node && !!wrapperEl.value?.contains(node)

const onPointerover = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') schedule(true, props.delay)
}

const onPointerout = (event: PointerEvent) => {
  if (!isInside(event.relatedTarget) && !keyboardFocus) schedule(false, 100)
}

const onPointerdown = (event: PointerEvent) => {
  if (tooltipEl.value?.contains(event.target as Node)) return
  keyboardFocus = false
  schedule(false, 0)
}

const onFocusin = (event: FocusEvent) => {
  if (!(event.target as Element).matches(':focus-visible')) return
  keyboardFocus = true
  schedule(true, 0)
}

const onFocusout = (event: FocusEvent) => {
  if (isInside(event.relatedTarget)) return
  keyboardFocus = false
  schedule(false, 0)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  event.preventDefault()
  schedule(false, 0)
}

const EDGE = 8
const opposite = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
} as const
const side = ref<Side>(props.placement)
const arrowOffset = ref(0)

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max))

function position() {
  const trigger = triggerEl()
  const tooltip = tooltipEl.value
  if (!trigger || !tooltip) return
  // Measured at the top-left, where nothing squeezes its width.
  tooltip.style.left = tooltip.style.top = '0px'
  const rect = trigger.getBoundingClientRect()
  const { offsetWidth: width, offsetHeight: height } = tooltip
  const { clientWidth: vw, clientHeight: vh } = document.documentElement
  const gap = props.arrow ? 10 : 6
  const room = {
    top: rect.top,
    bottom: vh - rect.bottom,
    left: rect.left,
    right: vw - rect.right,
  }

  let placed: Side = props.placement
  const vertical = placed === 'top' || placed === 'bottom'
  if (
    room[placed] < (vertical ? height : width) + gap + EDGE &&
    room[opposite[placed]] > room[placed]
  ) {
    placed = opposite[placed]
  }

  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const x = clamp(
    vertical
      ? centerX - width / 2
      : placed === 'left'
        ? rect.left - gap - width
        : rect.right + gap,
    EDGE,
    vw - width - EDGE,
  )
  const y = clamp(
    vertical
      ? placed === 'top'
        ? rect.top - gap - height
        : rect.bottom + gap
      : centerY - height / 2,
    EDGE,
    vh - height - EDGE,
  )

  tooltip.style.left = `${x}px`
  tooltip.style.top = `${y}px`
  side.value = placed
  // Kept clear of the rounded corners.
  arrowOffset.value = vertical
    ? clamp(centerX - x, 12, width - 12)
    : clamp(centerY - y, 12, height - 12)
}

const arrowStyle = computed(() =>
  side.value === 'top' || side.value === 'bottom'
    ? {
        left: `${arrowOffset.value}px`,
        top: side.value === 'top' ? '100%' : '0',
      }
    : {
        top: `${arrowOffset.value}px`,
        left: side.value === 'left' ? '100%' : '0',
      },
)

function stopTracking() {
  window.removeEventListener('scroll', position, true)
  window.removeEventListener('resize', position)
  document.removeEventListener('keydown', onKeydown)
}

watch(
  open,
  (isOpen) => {
    const tooltip = tooltipEl.value
    if (!tooltip) return
    if (isOpen) {
      describe()
      if (!tooltip.matches(':popover-open')) tooltip.showPopover()
      position()
      window.addEventListener('scroll', position, {
        capture: true,
        passive: true,
      })
      window.addEventListener('resize', position)
      document.addEventListener('keydown', onKeydown)
    } else {
      if (tooltip.matches(':popover-open')) tooltip.hidePopover()
      stopTracking()
    }
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  stopTracking()
  clearTimeout(timer)
})

const tooltipClasses =
  'inset-auto m-0 overflow-visible rounded-md border-0 bg-foreground px-2.5 py-1.5 ' +
  'text-left text-xs leading-snug font-medium break-words text-background shadow-md ' +
  'transition-opacity duration-150 starting:opacity-0 motion-reduce:transition-none'
</script>
