<template>
  <div :class="['text-foreground flex flex-col gap-1', attrs.class]">
    <label v-if="label" :for="inputId" class="text-muted-foreground text-sm">
      {{ label }}
    </label>

    <div :class="controlClasses">
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
        class="placeholder:text-muted-foreground/80 h-full min-w-0 flex-1 bg-transparent p-0 text-inherit outline-none disabled:cursor-not-allowed"
        :type="inputType"
        :name="name"
        :value="model ?? ''"
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
        v-if="$slots.trailing"
        class="text-muted-foreground inline-flex items-center"
      >
        <slot name="trailing" />
      </span>

      <button
        v-if="isPassword"
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:text-foreground inline-flex shrink-0 cursor-pointer items-center transition-colors outline-none disabled:cursor-not-allowed"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-pressed="showPassword"
        :aria-controls="inputId"
        :disabled="disabled"
        @mousedown.prevent
        @click="togglePasswordVisibility"
      >
        <EyeOffIcon v-if="showPassword" class="size-4" />
        <EyeIcon v-else class="size-4" />
      </button>
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
import { EyeIcon, EyeOffIcon } from '@lucide/vue'

interface Props {
  label?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'
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
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  type: 'text',
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  variant: 'outline',
  radius: 'lg',
  id: undefined,
  name: undefined,
  autocomplete: undefined,
})

const model = defineModel<string | number | null>({ default: '' })

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

defineSlots<{
  leading?: () => unknown
  trailing?: () => unknown
}>()

// (maxlength, min, step, autofocus, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-input-${autoId}`)
const messageId = computed(() => `${inputId.value}-message`)
const message = computed(() => props.error || props.hint)

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

const inputEl = useTemplateRef<HTMLInputElement>('input')

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (props.type === 'number') {
    model.value = target.value === '' ? null : target.valueAsNumber
  } else {
    model.value = target.value
  }
}

const isPassword = computed(() => props.type === 'password')
const showPassword = ref(false)

const inputType = computed(() =>
  isPassword.value && showPassword.value ? 'text' : props.type,
)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

watch(isPassword, (value) => {
  if (!value) showPassword.value = false
})

defineExpose({
  focus: () => inputEl.value?.focus(),
  select: () => inputEl.value?.select(),
  el: inputEl,
})
</script>
