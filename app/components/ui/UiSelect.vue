<template>
  <div
    ref="root"
    :class="['text-foreground flex flex-col gap-1', attrs.class]"
    @focusout="onFocusout"
  >
    <label
      v-if="label"
      :id="labelId"
      class="text-muted-foreground text-sm"
      @click="triggerEl?.focus()"
    >
      {{ label }}
    </label>

    <button
      :id="triggerId"
      ref="trigger"
      v-bind="triggerAttrs"
      type="button"
      role="combobox"
      :class="triggerClasses"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-activedescendant="
        open && activeIndex !== -1 ? optionId(activeIndex) : undefined
      "
      :aria-labelledby="label ? labelId : undefined"
      :aria-required="required || undefined"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="message ? messageId : undefined"
      @click="toggle"
      @keydown="onKeydown"
      @keyup.space.prevent
    >
      <span
        v-if="selected?.icon"
        class="text-muted-foreground inline-flex shrink-0 [&>svg]:size-4"
      >
        <OptionIcon :icon="selected.icon" />
      </span>
      <span
        :class="[
          'min-w-0 flex-1 truncate',
          !selected && 'text-muted-foreground/80',
        ]"
      >
        {{ selected?.label ?? placeholder }}
      </span>
      <ChevronDownIcon
        :class="[
          'text-muted-foreground size-4 shrink-0 transition-transform',
          open && 'rotate-180',
        ]"
      />
    </button>

    <input v-if="name" type="hidden" :name="name" :value="model ?? ''" />

    <div
      ref="popover"
      popover="manual"
      :class="popoverClasses"
      :style="popoverStyle"
      @mousedown="onPopoverMousedown"
    >
      <!-- Same height and padding as the trigger. -->
      <div
        v-if="searchable"
        :class="[
          'border-border flex shrink-0 items-center gap-2 border-b',
          sizes[size].trigger,
          paddings[size],
        ]"
      >
        <SearchIcon class="text-muted-foreground size-4 shrink-0" />
        <input
          ref="searchInput"
          type="text"
          role="combobox"
          class="placeholder:text-muted-foreground/80 h-full min-w-0 flex-1 bg-transparent p-0 text-inherit outline-none"
          :value="query"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          aria-autocomplete="list"
          :aria-expanded="open"
          :aria-controls="listId"
          :aria-activedescendant="
            activeIndex !== -1 ? optionId(activeIndex) : undefined
          "
          autocomplete="off"
          spellcheck="false"
          @input="onSearchInput"
          @keydown="onListKeydown"
        />
        <button
          v-if="query"
          type="button"
          tabindex="-1"
          class="text-muted-foreground hover:text-foreground inline-flex shrink-0 cursor-pointer transition-colors"
          aria-label="Clear search"
          @click="setQuery('')"
        >
          <XIcon class="size-4" />
        </button>
      </div>

      <div
        :id="listId"
        ref="list"
        role="listbox"
        tabindex="-1"
        :aria-labelledby="label ? labelId : undefined"
        :class="[
          'relative min-h-0 flex-1 overflow-y-auto overscroll-contain',
          items.length > 0 && 'py-1',
        ]"
      >
        <div
          v-for="(section, s) in sections"
          :key="section.name"
          :role="section.name ? 'group' : undefined"
          :aria-labelledby="section.name ? `${listId}-group-${s}` : undefined"
        >
          <div
            v-if="section.name"
            :id="`${listId}-group-${s}`"
            role="presentation"
            :class="[
              'text-muted-foreground pt-3 pb-1 text-xs font-semibold tracking-wider uppercase',
              sizes[size].group,
            ]"
          >
            {{ section.name }}
          </div>
          <div
            v-for="{ option, index } in section.options"
            :id="optionId(index)"
            :key="option.value"
            role="option"
            :aria-selected="option.value === model"
            :aria-disabled="option.disabled || undefined"
            :class="optionClasses(option, index)"
            @mousemove="hover(index)"
            @click="select(index)"
          >
            <span
              v-if="option.icon"
              class="text-muted-foreground inline-flex shrink-0 [&>svg]:size-4"
            >
              <OptionIcon :icon="option.icon" />
            </span>
            <span class="flex min-w-0 flex-1 flex-col">
              <span
                :class="['truncate', option.value === model && 'font-semibold']"
              >
                {{ option.label }}
              </span>
              <span
                v-if="option.description"
                class="text-muted-foreground text-xs"
              >
                {{ option.description }}
              </span>
            </span>
            <CheckIcon v-if="option.value === model" class="size-4 shrink-0" />
          </div>
        </div>
      </div>

      <p
        v-if="!items.length"
        class="text-muted-foreground px-3 py-6 text-center text-sm"
      >
        {{ query ? noResultsText : 'No results.' }}
      </p>
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
import type { Component, FunctionalComponent } from 'vue'
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from '@lucide/vue'

export interface SelectOption {
  value: string | number
  label: string
  description?: string
  icon?: string | Component
  disabled?: boolean
  group?: string
}

interface Props {
  options: SelectOption[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  variant?: 'outline' | 'filled' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: 'Select…',
  hint: undefined,
  error: undefined,
  variant: 'outline',
  size: 'md',
  radius: 'lg',
  id: undefined,
  name: undefined,
  searchPlaceholder: 'Search…',
  noResultsText: 'No results.',
})

const model = defineModel<string | number | null>({ default: null })

// (aria-label, @focus, data-*) goes to the trigger button.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const triggerAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const triggerId = computed(() => props.id ?? `ui-select-${autoId}`)
const labelId = computed(() => `${triggerId.value}-label`)
const listId = computed(() => `${triggerId.value}-listbox`)
const messageId = computed(() => `${triggerId.value}-message`)
const optionId = (index: number) => `${listId.value}-option-${index}`
const message = computed(() => props.error || props.hint)

const query = ref('')

const visibleOptions = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return props.options
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(term),
  )
})

const sections = computed(() => {
  const groups = new Map<string, SelectOption[]>()
  for (const option of visibleOptions.value) {
    const name = option.group ?? ''
    groups.set(name, [...(groups.get(name) ?? []), option])
  }
  let index = 0
  return [...groups].map(([name, options]) => ({
    name,
    options: options.map((option) => ({ option, index: index++ })),
  }))
})
const items = computed(() =>
  sections.value.flatMap((section) => section.options.map((o) => o.option)),
)
const selected = computed(() =>
  props.options.find((option) => option.value === model.value),
)

const OptionIcon: FunctionalComponent<{ icon: string | Component }> = ({
  icon,
}) => (typeof icon === 'string' ? icon : h(icon))

const rootEl = useTemplateRef<HTMLDivElement>('root')
const triggerEl = useTemplateRef<HTMLButtonElement>('trigger')
const popoverEl = useTemplateRef<HTMLDivElement>('popover')
const listEl = useTemplateRef<HTMLDivElement>('list')
const searchEl = useTemplateRef<HTMLInputElement>('searchInput')
const open = ref(false)
const activeIndex = ref(-1)

const findEnabled = (from: number, step: 1 | -1) => {
  for (let i = from; i >= 0 && i < items.value.length; i += step) {
    if (!items.value[i]?.disabled) return i
  }
  return -1
}

const firstEnabled = () => findEnabled(0, 1)
const lastEnabled = () => findEnabled(items.value.length - 1, -1)

function moveBy(delta: number) {
  const target = Math.min(
    Math.max(activeIndex.value + delta, 0),
    items.value.length - 1,
  )
  const step = delta > 0 ? 1 : -1
  const next = findEnabled(target, step)
  activeIndex.value = next !== -1 ? next : findEnabled(target, -step as -1)
}

function show(focus: 'selected' | 'first' | 'last' = 'selected') {
  if (props.disabled || open.value) return
  query.value = ''
  const selectedIndex = items.value.findIndex(
    (option) => option.value === model.value,
  )
  activeIndex.value =
    focus === 'last'
      ? lastEnabled()
      : focus === 'selected' && selectedIndex !== -1
        ? selectedIndex
        : firstEnabled()
  open.value = true
  // Safari doesn't focus a button on click, and the keyboard and blur handling need it.
  triggerEl.value?.focus()
}

function close(restoreFocus = true) {
  if (!open.value) return
  open.value = false
  query.value = ''
  if (restoreFocus && popoverEl.value?.contains(document.activeElement)) {
    triggerEl.value?.focus()
  }
}

const toggle = () => (open.value ? close() : show())

function select(index: number) {
  const option = items.value[index]
  if (!option || option.disabled) return
  model.value = option.value
  close()
}

function pickActive() {
  if (activeIndex.value === -1) close()
  else select(activeIndex.value)
}

function hover(index: number) {
  if (!items.value[index]?.disabled) activeIndex.value = index
}

function setQuery(value: string) {
  query.value = value
  activeIndex.value = firstEnabled()
  if (listEl.value) listEl.value.scrollTop = 0
}

const onSearchInput = (event: Event) =>
  setQuery((event.target as HTMLInputElement).value)

// Close when focus leaves the component. Moving between the trigger and the
// search field (both inside it) keeps the list open.
function onFocusout(event: FocusEvent) {
  if (!rootEl.value?.contains(event.relatedTarget as Node | null)) {
    close(false)
  }
}
const onPopoverMousedown = (event: MouseEvent) => {
  if (event.target !== searchEl.value) event.preventDefault()
}

let search = ''
let searchTimer: ReturnType<typeof setTimeout> | undefined

function typeahead(char: string) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => (search = ''), 500)
  search += char.toLowerCase()

  const repeated = [...search].every((c) => c === search[0])
  const prefix = repeated ? search[0]! : search
  const start = Math.max(activeIndex.value + (repeated ? 1 : 0), 0)
  const count = items.value.length
  for (let i = 0; i < count; i++) {
    const index = (start + i) % count
    const option = items.value[index]!
    if (!option.disabled && option.label.toLowerCase().startsWith(prefix)) {
      activeIndex.value = index
      return
    }
  }
}

function onListKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      moveBy(1)
      break
    case 'ArrowUp':
      if (event.altKey) pickActive()
      else moveBy(-1)
      break
    case 'PageDown':
      moveBy(10)
      break
    case 'PageUp':
      moveBy(-10)
      break
    case 'Enter':
      pickActive()
      break
    case 'Escape':
      event.stopPropagation()
      close()
      break
    default:
      return false
  }
  event.preventDefault()
  return true
}

function onKeydown(event: KeyboardEvent) {
  const { key } = event
  const printable =
    key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey

  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) show()
    else if (key === 'Home') show('first')
    else if (key === 'End') show('last')
    else if (printable) {
      show()
      // Start the search with the key that opened the list.
      if (props.searchable) setQuery(key)
      else typeahead(key)
    } else return
    event.preventDefault()
    return
  }

  if (onListKeydown(event)) return
  switch (key) {
    case 'Home':
      activeIndex.value = firstEnabled()
      break
    case 'End':
      activeIndex.value = lastEnabled()
      break
    case ' ':
      // A space mid-search is part of the search, e.g. "united s".
      if (search) typeahead(key)
      else pickActive()
      break
    default:
      if (!printable) return
      typeahead(key)
  }
  event.preventDefault()
}

const MAX_HEIGHT = 288
const GAP = 6
const popoverStyle = ref<Record<string, string>>({})

// The list is a popover in the browser's top layer, so it's never clipped by
// a scrolling parent or a <UiModal>. It sits under the trigger, or above it
// when there's more room there.
function position() {
  const trigger = triggerEl.value
  const popover = popoverEl.value
  const list = listEl.value
  if (!trigger || !popover || !list) return
  const rect = trigger.getBoundingClientRect()
  const viewport = document.documentElement.clientHeight
  const below = viewport - rect.bottom - GAP * 2
  const above = rect.top - GAP * 2
  // The height it would be with the whole list showing.
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

function stopTracking() {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', position)
}

// Keeps the active option (and its group heading) scrolled into view.
function scrollToActive() {
  const list = listEl.value
  const option = document.getElementById(optionId(activeIndex.value))
  if (!list || !option) return
  const heading = option.previousElementSibling as HTMLElement | null
  const top =
    activeIndex.value === firstEnabled()
      ? 0
      : heading?.getAttribute('role') === 'presentation'
        ? heading.offsetTop
        : option.offsetTop
  const bottom = option.offsetTop + option.offsetHeight
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight)
    list.scrollTop = bottom - list.clientHeight
}

watch(
  open,
  (isOpen) => {
    const popover = popoverEl.value
    if (!popover) return
    if (isOpen) {
      if (!popover.matches(':popover-open')) popover.showPopover()
      position()
      searchEl.value?.focus({ preventScroll: true })
      scrollToActive()
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
  activeIndex,
  () => {
    if (open.value) scrollToActive()
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  stopTracking()
  clearTimeout(searchTimer)
})

const sizes = {
  sm: {
    trigger: 'h-8 text-sm',
    option: 'px-2 py-1.5 text-sm',
    group: 'px-2',
  },
  md: {
    trigger: 'h-10 text-base sm:text-sm',
    option: 'px-3 py-2 text-base sm:text-sm',
    group: 'px-3',
  },
  lg: {
    trigger: 'h-12 text-base',
    option: 'px-4 py-2.5 text-base',
    group: 'px-4',
  },
} as const

const paddings = {
  sm: 'px-2',
  md: 'px-3',
  lg: 'px-4',
} as const

const radii = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

const variants = {
  outline: 'border focus:ring-3',
  filled: 'border focus:ring-3',
  ghost: 'border-b focus:shadow-[0_1px_0_0]',
} as const

// The variants' focus ring, applied while the list is open.
const rings = {
  outline: 'ring-3',
  filled: 'ring-3',
  ghost: 'shadow-[0_1px_0_0]',
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
  outline: 'hover:not-focus:border-muted-foreground',
  filled: 'hover:bg-foreground/10',
  ghost: 'hover:not-focus:border-muted-foreground',
} as const

const triggerClasses = computed(() => {
  const ghost = props.variant === 'ghost'
  return [
    'flex w-full items-center gap-2 text-left outline-none transition-[background-color,border-color,box-shadow]',
    sizes[props.size].trigger,
    variants[props.variant],
    ghost ? 'rounded-none px-0' : [radii[props.radius], paddings[props.size]],
    props.error
      ? 'border-red-600 focus:ring-red-600/30 focus:shadow-red-600'
      : [
          open.value ? 'border-primary' : borders[props.variant],
          'focus:border-primary focus:ring-primary/35 focus:shadow-primary',
        ],
    open.value && [
      rings[props.variant],
      props.error
        ? 'ring-red-600/30 shadow-red-600'
        : 'ring-primary/35 shadow-primary',
    ],
    props.disabled && !ghost ? 'bg-background' : backgrounds[props.variant],
    props.disabled
      ? 'cursor-not-allowed opacity-60'
      : [
          'cursor-pointer',
          !props.error && !open.value && hovers[props.variant],
        ],
  ]
})

const popoverClasses = computed(() => [
  'inset-auto m-0 max-h-72 flex-col overflow-hidden border border-border bg-surface p-0 text-foreground shadow-lg outline-none open:flex dark:scheme-dark ' +
    'transition-opacity duration-150 starting:opacity-0 motion-reduce:transition-none',
  props.radius === 'full' ? 'rounded-lg' : radii[props.radius],
])

const optionClasses = (option: SelectOption, index: number) => [
  'flex items-center gap-2',
  sizes[props.size].option,
  index === activeIndex.value && 'bg-background',
  option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
]

defineExpose({
  focus: () => triggerEl.value?.focus(),
  el: triggerEl,
})
</script>
