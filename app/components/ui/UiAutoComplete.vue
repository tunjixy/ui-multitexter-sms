<template>
  <div
    ref="root"
    :class="['text-foreground flex flex-col gap-1', attrs.class]"
    @focusout="onFocusout"
  >
    <label
      v-if="label"
      :id="labelId"
      :for="inputId"
      class="text-muted-foreground text-sm"
    >
      {{ label }}
    </label>

    <div ref="control" :class="controlClasses">
      <span
        v-if="$slots.leading"
        class="text-muted-foreground inline-flex items-center"
      >
        <slot name="leading" />
      </span>

      <input
        :id="inputId"
        ref="input"
        v-bind="inputAttrs"
        type="text"
        role="combobox"
        class="placeholder:text-muted-foreground/80 h-full min-w-0 flex-1 bg-transparent p-0 text-inherit outline-none disabled:cursor-not-allowed"
        :name="name"
        :value="model ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="expanded"
        :aria-controls="listId"
        :aria-activedescendant="
          expanded && activeIndex !== -1 ? optionId(activeIndex) : undefined
        "
        :aria-invalid="error ? true : undefined"
        :aria-describedby="message ? messageId : undefined"
        @input="onInput"
        @keydown="onKeydown"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <button
        v-if="suggestions.length"
        type="button"
        tabindex="-1"
        class="text-muted-foreground hover:text-foreground inline-flex shrink-0 cursor-pointer items-center transition-colors outline-none disabled:cursor-not-allowed"
        :aria-label="expanded ? 'Hide suggestions' : 'Show suggestions'"
        :aria-expanded="expanded"
        :aria-controls="listId"
        :disabled="disabled || readonly"
        @mousedown.prevent
        @click="toggle"
      >
        <ChevronDownIcon
          :class="['size-4 transition-transform', expanded && 'rotate-180']"
        />
      </button>
    </div>

    <div
      ref="popover"
      popover="manual"
      :class="popoverClasses"
      :style="popoverStyle"
      @mousedown.prevent
    >
      <div
        :id="listId"
        ref="list"
        role="listbox"
        :aria-labelledby="label ? labelId : undefined"
        class="relative min-h-0 flex-1 overflow-y-auto overscroll-contain py-1"
      >
        <div
          v-for="(option, index) in items"
          :id="optionId(index)"
          :key="option"
          role="option"
          :aria-selected="index === activeIndex"
          :class="[
            'flex cursor-pointer items-center gap-2 px-3 py-2 text-base sm:text-sm',
            index === activeIndex && 'bg-background',
          ]"
          @mousemove="activeIndex = index"
          @click="select(option)"
        >
          <span class="min-w-0 flex-1 truncate">{{ option }}</span>
          <CheckIcon v-if="option === model" class="size-4 shrink-0" />
        </div>
      </div>
    </div>

    <p
      v-if="message"
      :id="messageId"
      :class="[
        'text-sm',
        error ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
      ]"
      :role="error ? 'alert' : undefined"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from '@lucide/vue'

interface Props {
  options: string[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  variant?: 'outline' | 'filled' | 'ghost'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  variant: 'outline',
  radius: 'lg',
  id: undefined,
  name: undefined,
})

const model = defineModel<string | null>({ default: '' })

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

defineSlots<{
  leading?: () => unknown
}>()

// (maxlength, autofocus, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-autocomplete-${autoId}`)
const labelId = computed(() => `${inputId.value}-label`)
const listId = computed(() => `${inputId.value}-listbox`)
const messageId = computed(() => `${inputId.value}-message`)
const optionId = (index: number) => `${listId.value}-option-${index}`
const message = computed(() => props.error || props.hint)

const rootEl = useTemplateRef<HTMLDivElement>('root')
const controlEl = useTemplateRef<HTMLDivElement>('control')
const inputEl = useTemplateRef<HTMLInputElement>('input')
const popoverEl = useTemplateRef<HTMLDivElement>('popover')
const listEl = useTemplateRef<HTMLDivElement>('list')

const query = ref('')
const open = ref(false)
const activeIndex = ref(-1)

const suggestions = computed(() => [...new Set(props.options)])
const items = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return suggestions.value
  return suggestions.value.filter((option) =>
    option.toLowerCase().startsWith(term),
  )
})
const expanded = computed(() => open.value && items.value.length > 0)

watch(model, (value) => {
  if ((value ?? '') !== query.value) query.value = ''
})

const close = () => {
  open.value = false
  activeIndex.value = -1
}

const select = (option: string) => {
  model.value = option
  close()
}

const toggle = () => {
  if (expanded.value) close()
  else {
    if (!items.value.length) query.value = ''
    open.value = true
  }
  inputEl.value?.focus()
}

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  query.value = value
  model.value = value
  open.value = true
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.readonly) return
  const count = items.value.length

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      if (!count) return
      const down = event.key === 'ArrowDown'
      if (!expanded.value) {
        open.value = true
        activeIndex.value = event.altKey ? -1 : down ? 0 : count - 1
      } else if (!event.altKey) {
        activeIndex.value = down
          ? (activeIndex.value + 1) % count
          : activeIndex.value <= 0
            ? count - 1
            : activeIndex.value - 1
      }
      break
    }
    case 'Enter':
      if (!expanded.value || activeIndex.value === -1) return
      select(items.value[activeIndex.value]!)
      break
    case 'Escape':
      if (!expanded.value) return
      event.stopPropagation()
      close()
      break
    default:
      return
  }
  event.preventDefault()
}

const onFocusout = (event: FocusEvent) => {
  if (!rootEl.value?.contains(event.relatedTarget as Node | null)) close()
}

const MAX_HEIGHT = 288
const GAP = 6
const popoverStyle = ref<Record<string, string>>({})

const position = () => {
  const anchor = controlEl.value
  const popover = popoverEl.value
  const list = listEl.value
  if (!anchor || !popover || !list) return
  const rect = anchor.getBoundingClientRect()
  const viewport = document.documentElement.clientHeight
  const below = viewport - rect.bottom - GAP * 2
  const above = rect.top - GAP * 2
  const height = Math.min(
    popover.offsetHeight - list.clientHeight + list.scrollHeight,
    MAX_HEIGHT,
  )
  const flip = height > below && above > below
  popoverStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `${Math.min(MAX_HEIGHT, flip ? above : below)}px`,
    top: flip ? 'auto' : `${rect.bottom + GAP}px`,
    bottom: flip ? `${viewport - rect.top + GAP}px` : 'auto',
  }
}

const onScroll = (event: Event) => {
  if (event.target !== listEl.value) position()
}

const stopTracking = () => {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', position)
}

const scrollToActive = () => {
  const list = listEl.value
  const option = document.getElementById(optionId(activeIndex.value))
  if (!list || !option) return
  const bottom = option.offsetTop + option.offsetHeight
  if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop
  else if (bottom > list.scrollTop + list.clientHeight)
    list.scrollTop = bottom - list.clientHeight
}

watch(
  expanded,
  (isExpanded) => {
    const popover = popoverEl.value
    if (!popover) return
    if (isExpanded) {
      if (!popover.matches(':popover-open')) popover.showPopover()
      position()
      window.addEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      })
      window.addEventListener('resize', position)
    } else {
      if (popover.matches(':popover-open')) popover.hidePopover()
      stopTracking()
    }
  },
  { flush: 'post' },
)

watch(
  items,
  () => {
    activeIndex.value = -1
    if (listEl.value) listEl.value.scrollTop = 0
    if (expanded.value) position()
  },
  { flush: 'post' },
)

watch(
  activeIndex,
  () => {
    if (expanded.value) scrollToActive()
  },
  { flush: 'post' },
)

onBeforeUnmount(stopTracking)

const radii = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

const variants = {
  outline: 'border focus-within:ring-3',
  filled: 'border focus-within:ring-3',
  ghost: 'border-b focus-within:shadow-[0_1px_0_0]',
} as const

const borders = {
  outline: 'border-border',
  filled: 'border-transparent',
  ghost: 'border-border',
} as const

const backgrounds = {
  outline: 'bg-surface',
  filled: 'bg-foreground/5',
  ghost: 'bg-transparent',
} as const

const hovers = {
  outline: 'hover:not-focus-within:border-muted-foreground',
  filled: 'hover:bg-foreground/10',
  ghost: 'hover:not-focus-within:border-muted-foreground',
} as const

const controlClasses = computed(() => {
  const ghost = props.variant === 'ghost'
  return [
    'flex h-11 items-center gap-2 text-base transition-[background-color,border-color,box-shadow] sm:text-sm',
    variants[props.variant],
    ghost ? 'rounded-none px-0' : [radii[props.radius], 'px-3'],
    props.error
      ? 'border-red-600 focus-within:ring-red-600/30 focus-within:shadow-red-600'
      : [
          borders[props.variant],
          'focus-within:border-primary focus-within:ring-primary/35 focus-within:shadow-primary',
        ],
    props.disabled && !ghost ? 'bg-background' : backgrounds[props.variant],
    props.disabled
      ? 'cursor-not-allowed opacity-60'
      : !props.error && hovers[props.variant],
  ]
})

const popoverClasses = computed(() => [
  'inset-auto m-0 max-h-72 flex-col overflow-hidden border border-border bg-surface p-0 text-foreground shadow-lg outline-none open:flex dark:scheme-dark ' +
    'transition-opacity duration-150 starting:opacity-0 motion-reduce:transition-none',
  props.radius === 'full' ? 'rounded-lg' : radii[props.radius],
])

defineExpose({
  focus: () => inputEl.value?.focus(),
  select: () => inputEl.value?.select(),
  el: inputEl,
})
</script>
