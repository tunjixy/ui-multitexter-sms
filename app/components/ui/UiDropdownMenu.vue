<template>
  <span
    ref="wrapper"
    class="contents"
    @click="onClick"
    @keydown="onTriggerKeydown"
    @focusout="onFocusout"
  >
    <slot :open="open" />
    <span
      :id="menuId"
      ref="menu"
      :aria-labelledby="triggerId"
      v-bind="menuAttrs"
      popover="manual"
      role="menu"
      tabindex="-1"
      :class="[menuClasses, attrs.class]"
      @keydown="onMenuKeydown"
      @mousedown.prevent
    >
      <template
        v-for="(item, index) in items"
        :key="item.type === 'divider' ? `divider-${index}` : item.id"
      >
        <span
          v-if="item.type === 'divider'"
          role="separator"
          class="bg-border -mx-1 my-1 block h-px"
        />
        <button
          v-else
          type="button"
          role="menuitem"
          tabindex="-1"
          :disabled="item.disabled"
          :class="itemClasses(item)"
          @click="select(item)"
          @pointermove="onItemPointermove"
          @pointerleave="onItemPointerleave"
        >
          <!-- Rendered empty on items without an icon, so every label lines up. -->
          <span
            v-if="hasIcons"
            :class="[
              'inline-flex h-5 w-4 shrink-0 items-center justify-center [&>svg]:size-4',
              !item.danger && 'text-muted-foreground',
            ]"
          >
            <ItemIcon v-if="item.icon" :icon="item.icon" />
          </span>
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="item.description"
              :class="[
                'text-xs',
                item.danger
                  ? 'text-red-600/75 dark:text-red-400/75'
                  : 'text-muted-foreground',
              ]"
            >
              {{ item.description }}
            </span>
          </span>
        </button>
      </template>
    </span>
  </span>
</template>

<script setup lang="ts">
import type { Component, FunctionalComponent } from 'vue'

export interface DropdownMenuAction {
  type?: 'item'
  id: string | number
  label: string
  icon?: string | Component
  description?: string
  danger?: boolean
  disabled?: boolean
}

export interface DropdownMenuDivider {
  type: 'divider'
}

export type DropdownMenuItem = DropdownMenuAction | DropdownMenuDivider

interface Props {
  items: DropdownMenuItem[]
  placement?: 'start' | 'end' | 'top-start' | 'top-end'
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'start',
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  select: [item: DropdownMenuAction]
}>()

defineSlots<{
  /** The element that opens the menu, e.g. a <UiButton>. */
  default?: (props: { open: boolean }) => unknown
}>()

// `class` and other attributes go on the menu panel.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const menuAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const menuId = `ui-dropdown-menu-${useId()}`
const triggerId = ref<string>()
const wrapperEl = useTemplateRef<HTMLSpanElement>('wrapper')
const menuEl = useTemplateRef<HTMLSpanElement>('menu')

const actions = computed(() =>
  props.items.filter(
    (item): item is DropdownMenuAction => item.type !== 'divider',
  ),
)
const hasIcons = computed(() => actions.value.some((item) => item.icon))

const ItemIcon: FunctionalComponent<{ icon: string | Component }> = ({
  icon,
}) => (typeof icon === 'string' ? icon : h(icon))

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]'

const target = () => {
  const root = wrapperEl.value?.firstElementChild
  if (!root || root === menuEl.value) return null
  return (
    root.matches(FOCUSABLE) ? root : (root.querySelector(FOCUSABLE) ?? root)
  ) as HTMLElement
}

const wire = () => {
  const el = target()
  if (!el) return
  if (!el.matches(FOCUSABLE)) {
    el.tabIndex = 0
    el.setAttribute('role', 'button')
  }
  el.id ||= `${menuId}-trigger`
  el.setAttribute('aria-haspopup', 'menu')
  el.setAttribute('aria-controls', menuId)
  el.setAttribute('aria-expanded', String(open.value))
  triggerId.value = el.id
}

const buttons = () => [
  ...(menuEl.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ??
    []),
]
const focusedIndex = () =>
  buttons().indexOf(document.activeElement as HTMLButtonElement)

function nextEnabled(from: number, step: 1 | -1) {
  const count = actions.value.length
  for (let i = 1; i <= count; i++) {
    const index = (((from + step * i) % count) + count) % count
    if (!actions.value[index]!.disabled) return index
  }
  return -1
}

const first = () => nextEnabled(-1, 1)
const last = () => nextEnabled(0, -1)

const focusItem = (index: number) => (buttons()[index] ?? menuEl.value)?.focus()

type Focus = 'menu' | 'first' | 'last'
let focusOnOpen: Focus = 'menu'

function focusInto(focus: Focus) {
  if (focus === 'menu') menuEl.value?.focus({ preventScroll: true })
  else focusItem(focus === 'first' ? first() : last())
}

function show(focus: Focus = 'menu') {
  if (open.value) return focusInto(focus)
  focusOnOpen = focus
  open.value = true
}

function returnFocus() {
  if (menuEl.value?.contains(document.activeElement)) target()?.focus()
}

function close() {
  returnFocus()
  open.value = false
}

function select(item: DropdownMenuAction) {
  if (item.disabled) return
  close()
  emit('select', item)
}

function onClick(event: MouseEvent) {
  if (menuEl.value?.contains(event.target as Node)) return
  if (open.value) close()
  else show(event.detail === 0 ? 'first' : 'menu')
}

function onTriggerKeydown(event: KeyboardEvent) {
  const el = event.target as HTMLElement
  if (menuEl.value?.contains(el)) return
  switch (event.key) {
    case 'ArrowDown':
      show('first')
      break
    case 'ArrowUp':
      show('last')
      break
    case 'Enter':
    case ' ':
      // These already turn Enter and Space into a click.
      if (el.matches('button, a[href], input, summary')) return
      if (open.value) close()
      else show('first')
      break
    default:
      return
  }
  event.preventDefault()
}

let search = ''
let searchTimer: ReturnType<typeof setTimeout> | undefined

const typeahead = (char: string) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => (search = ''), 500)
  search += char.toLowerCase()

  const repeated = [...search].every((c) => c === search[0])
  const prefix = repeated ? search[0]! : search
  const from = focusedIndex()
  const start = repeated ? from + 1 : Math.max(from, 0)
  const count = actions.value.length
  for (let i = 0; i < count; i++) {
    const index = (start + i) % count
    const item = actions.value[index]!
    if (!item.disabled && item.label.toLowerCase().startsWith(prefix)) {
      focusItem(index)
      return
    }
  }
}

const onMenuKeydown = (event: KeyboardEvent) => {
  const { key } = event
  const from = focusedIndex()
  switch (key) {
    case 'ArrowDown':
      focusItem(from === -1 ? first() : nextEnabled(from, 1))
      break
    case 'ArrowUp':
      focusItem(from === -1 ? last() : nextEnabled(from, -1))
      break
    case 'Home':
      focusItem(first())
      break
    case 'End':
      focusItem(last())
      break
    case 'Escape':
      event.stopPropagation()
      close()
      break
    case 'Tab':
      close()
      return
    default:
      if (
        key.length !== 1 ||
        key === ' ' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return
      typeahead(key)
  }
  event.preventDefault()
}

const onItemPointermove = (event: PointerEvent) => {
  const item = event.currentTarget as HTMLButtonElement
  if (event.pointerType !== 'touch' && document.activeElement !== item) {
    item.focus({ preventScroll: true })
  }
}

const onItemPointerleave = (event: PointerEvent) => {
  if (document.activeElement === event.currentTarget) {
    menuEl.value?.focus({ preventScroll: true })
  }
}

const onFocusout = (event: FocusEvent) => {
  if (
    open.value &&
    !wrapperEl.value?.contains(event.relatedTarget as Node | null)
  ) {
    close()
  }
}

const GAP = 6
const EDGE = 8

const position = () => {
  const anchor = target()
  const menu = menuEl.value
  if (!anchor || !menu) return

  Object.assign(menu.style, {
    left: '0px',
    top: '0px',
    bottom: 'auto',
    maxHeight: '',
  })
  const rect = anchor.getBoundingClientRect()
  const { offsetWidth: width, offsetHeight: height } = menu
  const { clientWidth: vw, clientHeight: vh } = document.documentElement
  const below = vh - rect.bottom - GAP - EDGE
  const above = rect.top - GAP - EDGE

  const wantsTop = props.placement.startsWith('top')
  const [wanted, other] = wantsTop ? [above, below] : [below, above]
  const up = wantsTop !== (height > wanted && other > wanted)
  const rtl = getComputedStyle(anchor).direction === 'rtl'
  const alignEnd = props.placement.endsWith('end') !== rtl
  const x = alignEnd ? rect.right - width : rect.left

  Object.assign(menu.style, {
    left: `${Math.max(EDGE, Math.min(x, vw - width - EDGE))}px`,
    top: up ? 'auto' : `${rect.bottom + GAP}px`,
    bottom: up ? `${vh - rect.top + GAP}px` : 'auto',
    maxHeight: `${up ? above : below}px`,
  })
}

const onScroll = (event: Event) => {
  if (event.target !== menuEl.value) position()
}

const stopTracking = () => {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', position)
}

const sync = (isOpen: boolean) => {
  const menu = menuEl.value
  if (!menu) return
  wire()
  if (isOpen) {
    if (!menu.matches(':popover-open')) menu.showPopover()
    position()
    focusInto(focusOnOpen)
    focusOnOpen = 'menu'
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    window.addEventListener('resize', position)
  } else {
    returnFocus()
    if (menu.matches(':popover-open')) menu.hidePopover()
    stopTracking()
  }
}

onMounted(() => sync(open.value))
watch(open, sync, { flush: 'post' })

onBeforeUnmount(() => {
  if (menuEl.value?.matches(':popover-open')) menuEl.value.hidePopover()
  stopTracking()
  clearTimeout(searchTimer)
})

const menuClasses =
  'inset-auto m-0 w-max min-w-48 max-w-[min(20rem,calc(100vw_-_1rem))] overflow-y-auto overscroll-contain ' +
  'rounded-lg border border-border bg-surface p-1 text-foreground shadow-lg outline-none ' +
  'transition-opacity duration-150 starting:opacity-0 motion-reduce:transition-none dark:scheme-dark'

const itemClasses = (item: DropdownMenuAction) => [
  'flex w-full cursor-pointer items-start gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm ' +
    'select-none focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
  item.danger
    ? 'text-red-600 focus:bg-red-600/10 dark:text-red-400'
    : 'focus:bg-background',
]
</script>
