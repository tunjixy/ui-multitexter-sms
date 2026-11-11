<template>
  <div :class="['flex flex-col gap-4', attrs.class]">
    <div
      ref="list"
      v-bind="listAttrs"
      role="tablist"
      :class="listClasses"
      @keydown="onKeydown"
    >
      <span
        v-if="rect"
        :class="indicatorClasses"
        :style="{
          width: `${rect.width}px`,
          transform: `translateX(${rect.left}px)`,
        }"
        aria-hidden="true"
      />
      <button
        v-for="(item, index) in items"
        :id="tabId(index)"
        :key="item.value"
        type="button"
        role="tab"
        :class="tabClasses(index)"
        :disabled="item.disabled"
        :tabindex="index === selectedIndex ? 0 : -1"
        :aria-selected="index === selectedIndex"
        :aria-controls="
          index === selectedIndex && $slots[String(item.value)]
            ? panelId
            : undefined
        "
        @click="select(index)"
      >
        <span v-if="item.icon" class="inline-flex shrink-0 [&>svg]:size-4">
          <TabIcon :icon="item.icon" />
        </span>
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge != null"
          :class="badgeClasses(index === selectedIndex)"
        >
          {{ item.badge }}
        </span>
      </button>
    </div>

    <div
      v-if="selectedItem && $slots[String(selectedItem.value)]"
      :id="panelId"
      role="tabpanel"
      tabindex="0"
      :aria-labelledby="tabId(selectedIndex)"
      class="focus-visible:ring-primary/35 rounded-lg outline-none focus-visible:ring-3"
    >
      <slot :name="String(selectedItem.value)" :item="selectedItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component, FunctionalComponent } from 'vue'

export interface TabItem {
  value: string | number
  label: string
  icon?: string | Component
  badge?: string | number
  disabled?: boolean
}

interface Props {
  items: TabItem[]
  variant?: 'line' | 'pill' | 'segmented'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'line',
  fullWidth: false,
})

const model = defineModel<string | number>()

defineSlots<{
  /** A tab's panel. Name the slot after the tab's `value`, e.g. <template #inbox>. */
  [value: string]: ((props: { item: TabItem }) => unknown) | undefined
}>()

// `class` styles the outer wrapper; every other attribute
// (aria-label, data-*) goes to the tablist.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const listAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const baseId = `ui-tabs-${useId()}`
const tabId = (index: number) => `${baseId}-tab-${index}`
const panelId = `${baseId}-panel`

const enabled = computed(() =>
  props.items.flatMap((item, index) => (item.disabled ? [] : [index])),
)

// With no v-model, or one that matches no tab, the first enabled tab is selected.
const selectedIndex = computed(() => {
  const index = props.items.findIndex((item) => item.value === model.value)
  return index !== -1 ? index : (enabled.value[0] ?? -1)
})
const selectedItem = computed(() => props.items[selectedIndex.value])

const TabIcon: FunctionalComponent<{ icon: string | Component }> = ({
  icon,
}) => (typeof icon === 'string' ? icon : h(icon))

const listEl = useTemplateRef<HTMLDivElement>('list')
const tabEls = () => [
  ...(listEl.value?.querySelectorAll<HTMLButtonElement>(
    ':scope > [role="tab"]',
  ) ?? []),
]

function select(index: number) {
  const item = props.items[index]
  if (item && !item.disabled) model.value = item.value
}

// Arrow keys move focus and select in one step, skipping disabled tabs.
function onKeydown(event: KeyboardEvent) {
  const tabs = tabEls()
  const order = enabled.value
  const at = order.indexOf(tabs.indexOf(event.target as HTMLButtonElement))
  const rtl =
    getComputedStyle(event.currentTarget as Element).direction === 'rtl'
  let next: number | undefined
  switch (event.key) {
    case rtl ? 'ArrowLeft' : 'ArrowRight':
      next = order[(at + 1) % order.length]
      break
    case rtl ? 'ArrowRight' : 'ArrowLeft':
      next = order[(at - 1 + order.length) % order.length]
      break
    case 'Home':
      next = order[0]
      break
    case 'End':
      next = order.at(-1)
      break
    default:
      return
  }
  event.preventDefault()
  if (next === undefined) return
  select(next)
  tabs[next]?.focus()
}

const rect = ref<{ left: number; width: number } | null>(null)
const sliding = ref(false)

const measure = (slide: boolean) => {
  const tab = tabEls()[selectedIndex.value]
  sliding.value = slide
  rect.value = tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : null
}

let observer: ResizeObserver | undefined
function observe() {
  observer?.disconnect()
  observer = new ResizeObserver(() => measure(false))
  if (listEl.value) observer.observe(listEl.value)
  for (const tab of tabEls()) observer.observe(tab)
}

onMounted(observe)
onBeforeUnmount(() => observer?.disconnect())

watch(selectedIndex, () => measure(true), { flush: 'post' })
watch(
  () => [props.variant, props.fullWidth],
  () => measure(false),
  { flush: 'post' },
)
// Tabs are keyed by value, so new values mean new elements to observe.
watch(() => props.items.map((item) => item.value).join('\n'), observe, {
  flush: 'post',
})

const variants = {
  line: {
    list: 'shadow-[inset_0_-1px_0_var(--color-border)]',
    tab: 'h-10 rounded-t-md px-3 focus-visible:ring-inset',
    idle: 'text-muted-foreground enabled:hover:text-foreground',
    active: 'text-foreground',
    indicator: 'bottom-0 border-b-2 border-primary',
    fallback: 'shadow-[inset_0_-2px_0_var(--color-primary)]',
    badge: 'bg-primary/10 text-primary',
  },
  pill: {
    list: '-m-1 gap-1 p-1',
    tab: 'h-9 rounded px-4',
    idle: 'text-muted-foreground enabled:hover:bg-foreground/5 enabled:hover:text-foreground',
    active: 'text-white',
    indicator: 'inset-y-1 rounded border border-transparent bg-primary',
    fallback: 'bg-primary',
    badge: 'bg-white/20 text-white',
  },
  segmented: {
    list: 'rounded-lg bg-foreground/5 p-1',
    // rounded-sm inside the list's rounded-lg and p-1, so the corners stay concentric.
    tab: 'h-8 rounded-sm px-3',
    idle: 'text-muted-foreground enabled:hover:text-foreground',
    active: 'text-foreground',
    indicator:
      'inset-y-1 rounded-sm border border-transparent bg-surface shadow-sm dark:bg-foreground/15',
    fallback: 'bg-surface shadow-sm dark:bg-foreground/15',
    badge: 'bg-primary/10 text-primary',
  },
} as const

const listClasses = computed(() => [
  'relative flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  variants[props.variant].list,
  props.variant === 'segmented' && !props.fullWidth && 'w-fit max-w-full',
])

const indicatorClasses = computed(() => [
  'pointer-events-none absolute left-0',
  variants[props.variant].indicator,
  sliding.value &&
    'transition-[transform,width] duration-300 ease-out motion-reduce:transition-none',
])

const tabClasses = (index: number) => {
  const variant = variants[props.variant]
  const selected = index === selectedIndex.value
  return [
    'relative inline-flex cursor-pointer items-center justify-center gap-2 text-sm font-medium whitespace-nowrap select-none outline-none ' +
      'transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-primary/35 ' +
      'disabled:cursor-not-allowed disabled:opacity-50',
    variant.tab,
    props.fullWidth ? 'flex-1' : 'shrink-0',
    selected ? variant.active : variant.idle,
    selected && !rect.value && variant.fallback,
  ]
}

const badgeClasses = (selected: boolean) => [
  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs leading-none font-semibold transition-colors duration-300',
  selected
    ? variants[props.variant].badge
    : 'bg-foreground/10 text-muted-foreground',
]

defineExpose({
  focus: () => tabEls()[selectedIndex.value]?.focus(),
  el: listEl,
})
</script>
