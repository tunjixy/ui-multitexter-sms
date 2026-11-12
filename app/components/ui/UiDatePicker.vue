<template>
  <div
    ref="root"
    :class="['text-foreground flex flex-col gap-1', attrs.class]"
    @keydown="onKeydown"
  >
    <label v-if="label" :for="inputId" class="text-muted-foreground text-sm">
      {{ label }}
    </label>

    <DatePicker
      v-bind="pickerAttrs"
      v-model:open="isOpen"
      :value="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :input-class="inputClasses"
      :input-attr="{
        id: inputId,
        name,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': message ? messageId : undefined,
      }"
      :append-to-body="!inDialog"
      :popup-style="inDialog ? popupStyle : undefined"
      @update:value="model = $event"
    />

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
interface Props {
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  id: undefined,
  name: undefined,
})

const model = defineModel<string | null>({ default: null })

// Picker options (type, format, value-type, disabled-date…) go to <DatePicker>.
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const pickerAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-date-picker-${autoId}`)
const messageId = computed(() => `${inputId.value}-message`)
const message = computed(() => props.error || props.hint)

const inputClasses = computed(() => [
  'h-11 w-full rounded-lg border pr-9 pl-3 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/80 focus:ring-3 sm:text-sm',
  props.error
    ? 'border-red-600 focus:ring-red-600/30'
    : 'border-border hover:not-focus:border-muted-foreground focus:border-primary focus:ring-primary/35',
  props.disabled
    ? 'cursor-not-allowed bg-background opacity-60'
    : 'cursor-pointer bg-surface',
])

// Inside a modal <dialog>, everything outside it is inert, so the popup can't
// be appended to <body>. It stays in the dialog and is fixed to the viewport
// so the dialog's scroll area doesn't clip it.
const rootEl = useTemplateRef<HTMLElement>('root')
const isOpen = ref(false)
const inDialog = ref(false)
const popupStyle = ref<Record<string, string>>({})

onMounted(() => {
  inDialog.value = !!rootEl.value?.closest('dialog')
})

const GAP = 4
const EDGE = 8

const place = () => {
  const input = rootEl.value?.querySelector('input')
  const popup = rootEl.value?.querySelector<HTMLElement>('.mx-datepicker-popup')
  if (!input || !popup) return

  const rect = input.getBoundingClientRect()
  const { offsetWidth: width, offsetHeight: height } = popup
  const { clientWidth: vw, clientHeight: vh } = document.documentElement
  const below = vh - rect.bottom - GAP - EDGE
  const up = height > below && rect.top - GAP - EDGE > below

  popupStyle.value = {
    position: 'fixed',
    left: `${Math.max(EDGE, Math.min(rect.left, vw - width - EDGE))}px`,
    top: up ? 'auto' : `${rect.bottom + GAP}px`,
    bottom: up ? `${vh - rect.top + GAP}px` : 'auto',
  }
}

const stopTracking = () => {
  window.removeEventListener('scroll', place, true)
  window.removeEventListener('resize', place)
}

watch(isOpen, (open) => {
  if (!open) return stopTracking()
  if (!inDialog.value) return
  nextTick(place)
  window.addEventListener('scroll', place, { capture: true, passive: true })
  window.addEventListener('resize', place)
})

// Escape closes the popup without also closing the surrounding modal.
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !isOpen.value) return
  event.preventDefault()
  event.stopPropagation()
  isOpen.value = false
}

onBeforeUnmount(stopTracking)
</script>
