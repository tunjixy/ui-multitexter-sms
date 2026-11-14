<template>
  <div :class="['text-foreground flex flex-col gap-1', attrs.class]">
    <label v-if="label" :for="textareaId" class="text-muted-foreground text-sm">
      {{ label }}
    </label>

    <div class="grid grid-cols-1">
      <textarea
        :id="textareaId"
        ref="textarea"
        v-bind="textareaAttrs"
        :class="textareaClasses"
        :name="name"
        :value="model ?? ''"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="message ? messageId : undefined"
        @input="onInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
      <span
        v-if="autoresize"
        :class="replicaClasses"
        :style="{ maxHeight: maxRows ? `${maxRows}lh` : undefined }"
        >{{ replica }}</span
      >
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
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  variant?: 'outline' | 'filled' | 'ghost'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  rows?: number
  autoresize?: boolean
  maxRows?: number
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  id?: string
  name?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  variant: 'outline',
  radius: 'lg',
  rows: 3,
  autoresize: false,
  maxRows: undefined,
  id: undefined,
  name: undefined,
  autocomplete: undefined,
})

const model = defineModel<string | null>({ default: '' })

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// (maxlength, autofocus, spellcheck, data-*) goes to the <textarea> itself.
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const textareaAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const textareaId = computed(() => props.id ?? `ui-textarea-${autoId}`)
const messageId = computed(() => `${textareaId.value}-message`)
const message = computed(() => props.error || props.hint)

const replica = computed(() => `${model.value || props.placeholder || ''} `)

const radii = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-3xl',
} as const

const variants = {
  outline: 'border focus:ring-3',
  filled: 'border focus:ring-3',
  ghost: 'border-b focus:shadow-[0_1px_0_0]',
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

const controlClasses = computed(() => {
  const ghost = props.variant === 'ghost'
  return [
    'col-start-1 row-start-1 block min-w-0 py-2.25 text-base outline-none transition-[background-color,border-color,box-shadow] sm:text-sm',
    variants[props.variant],
    ghost ? 'rounded-none px-0' : [radii[props.radius], 'px-3'],
    props.error
      ? 'border-red-600 focus:ring-red-600/30 focus:shadow-red-600'
      : [
          borders[props.variant],
          'focus:border-primary focus:ring-primary/35 focus:shadow-primary',
        ],
    props.disabled && !ghost ? 'bg-background' : backgrounds[props.variant],
    props.disabled
      ? 'cursor-not-allowed opacity-60'
      : !props.error && hovers[props.variant],
  ]
})

const textareaClasses = computed(() => [
  controlClasses.value,
  'w-full placeholder:text-muted-foreground/80',
  !props.autoresize
    ? 'resize-y'
    : props.maxRows
      ? 'resize-none overflow-y-auto'
      : 'resize-none overflow-hidden',
])

const replicaClasses = computed(() => [
  controlClasses.value,
  'invisible box-content overflow-hidden break-words whitespace-pre-wrap',
])

const textareaEl = useTemplateRef<HTMLTextAreaElement>('textarea')

const onInput = (event: Event) => {
  model.value = (event.target as HTMLTextAreaElement).value
}

defineExpose({
  focus: () => textareaEl.value?.focus(),
  select: () => textareaEl.value?.select(),
  el: textareaEl,
})
</script>
