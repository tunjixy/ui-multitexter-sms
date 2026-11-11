<template>
  <div :class="['text-foreground flex flex-col gap-1', attrs.class]">
    <label v-if="label" :for="inputId" class="text-sm font-semibold">
      {{ label }}
    </label>

    <div
      :class="[
        'group relative grid w-fit items-center gap-2',
        disabled && 'cursor-not-allowed opacity-60',
      ]"
      :style="{ gridTemplateColumns: columns }"
    >
      <template v-for="box in boxes" :key="box.index">
        <span
          v-if="box.separated"
          class="bg-grey dark:bg-grey/50 mx-1 h-0.5 w-3 shrink-0 rounded-full"
          aria-hidden="true"
        />
        <div :class="boxClasses(box.active)" aria-hidden="true">
          <template v-if="box.char">{{ mask ? '*' : box.char }}</template>
          <span
            v-else-if="box.active"
            class="caret bg-foreground h-[1em] w-px"
          />
        </div>
      </template>

      <!-- iOS zooms into inputs under 16px, hence text-base on invisible text. -->
      <input
        :id="inputId"
        ref="input"
        autocomplete="one-time-code"
        autocapitalize="off"
        autocorrect="off"
        :spellcheck="false"
        v-bind="inputAttrs"
        type="text"
        class="absolute inset-0 size-full cursor-text bg-transparent text-base text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
        :value="model"
        :inputmode="numeric ? 'numeric' : 'text'"
        :pattern="pattern"
        :maxlength="length"
        :name="name"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="message ? messageId : undefined"
        @input="onInput"
        @paste="onPaste"
        @focus="onFocus"
        @blur="onBlur"
        @click="syncCaret"
        @keyup="syncCaret"
        @select="syncCaret"
      />
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
interface Props {
  length?: 4 | 6 | 8
  mask?: boolean
  separator?: number
  numeric?: boolean
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  mask: false,
  separator: undefined,
  numeric: true,
  label: undefined,
  hint: undefined,
  error: undefined,
  id: undefined,
  name: undefined,
})

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  complete: [code: string]
}>()

// `class` styles the outer wrapper; every other attribute and listener
// (aria-label, autofocus, @focus, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-otp-input-${autoId}`)
const messageId = computed(() => `${inputId.value}-message`)
const message = computed(() => props.error || props.hint)

// Makes a partly filled code fail form validation, not just an empty one.
const pattern = computed(
  () => `${props.numeric ? '\\d' : '.'}{${props.length}}`,
)

const focused = ref(false)
const allSelected = ref(false)

const boxes = computed(() => {
  const code = model.value
  const current = Math.min(code.length, props.length - 1)
  return Array.from({ length: props.length }, (_, index) => ({
    index,
    char: code[index] ?? '',
    active:
      focused.value &&
      (allSelected.value ? index < code.length : index === current),
    separated: !!props.separator && index > 0 && index % props.separator === 0,
  }))
})

const columns = computed(() =>
  boxes.value
    .map((box) => `${box.separated ? 'auto ' : ''}minmax(0, 2.5rem)`)
    .join(' '),
)

const boxClasses = (active: boolean) => [
  'flex aspect-square min-h-0 w-full items-center justify-center rounded-lg border text-base leading-none font-medium ' +
    'transition-[border-color,box-shadow]',
  props.disabled ? 'bg-background' : 'bg-surface',
  props.error ? 'border-red-600' : active ? 'border-primary' : 'border-border',
  active && (props.error ? 'ring-3 ring-red-600/30' : 'ring-3 ring-primary/35'),
  !active && !props.error && !props.disabled && 'group-hover:border-border',
]

const inputEl = useTemplateRef<HTMLInputElement>('input')

const clean = (text: string) => {
  const chars = text.replace(/\s/g, '')
  return (props.numeric ? chars.replace(/\D/g, '') : chars).slice(
    0,
    props.length,
  )
}

const syncCaret = () => {
  const el = inputEl.value
  if (!el) return
  const end = el.value.length
  allSelected.value =
    end > 0 && el.selectionStart === 0 && el.selectionEnd === end
  if (
    !allSelected.value &&
    (el.selectionStart !== end || el.selectionEnd !== end)
  ) {
    el.setSelectionRange(end, end)
  }
}

const setCode = (el: HTMLInputElement, code: string) => {
  el.value = code
  model.value = code
  syncCaret()
  if (code.length === props.length) emit('complete', code)
}

const onInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  setCode(el, clean(el.value))
}

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const code = clean(
    (event.clipboardData?.getData('text') ?? '').replace(/-/g, ''),
  )
  if (code) setCode(event.target as HTMLInputElement, code)
}

const onFocus = () => {
  focused.value = true
  syncCaret()
}

const onBlur = () => {
  focused.value = false
  allSelected.value = false
}

watch(
  () => [props.length, props.numeric],
  () => {
    const code = clean(model.value)
    if (code !== model.value) model.value = code
  },
)

defineExpose({
  focus: () => inputEl.value?.focus(),
  el: inputEl,
})
</script>

<style scoped>
@keyframes ui-otp-caret-blink {
  0%,
  70%,
  100% {
    opacity: 1;
  }
  20%,
  50% {
    opacity: 0;
  }
}

.caret {
  animation: ui-otp-caret-blink 1.25s ease-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
