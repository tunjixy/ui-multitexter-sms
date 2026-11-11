<template>
  <div :class="['text-foreground flex flex-col gap-1', attrs.class]">
    <div
      :class="[
        'flex items-start',
        sizes[size].row,
        disabled && 'cursor-not-allowed opacity-60',
      ]"
    >
      <span class="relative flex h-lh shrink-0 items-center">
        <input
          :id="inputId"
          ref="input"
          v-model="model"
          v-bind="inputAttrs"
          type="radio"
          :class="[circleClasses, sizes[size].circle]"
          :name="name"
          :value="value"
          :disabled="disabled"
          :required="required"
          :aria-describedby="hint ? hintId : undefined"
        />
        <CircleIcon
          :class="[
            'text-primary pointer-events-none absolute inset-0 m-auto opacity-0 transition-opacity peer-checked:opacity-100',
            sizes[size].dot,
          ]"
          fill="currentColor"
        />
      </span>

      <label
        v-if="label || $slots.default"
        :for="inputId"
        :class="[
          'select-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
      >
        <slot>{{ label }}</slot>
      </label>
    </div>

    <p
      v-if="hint"
      :id="hintId"
      :class="['text-muted-foreground text-sm', sizes[size].hint]"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { CircleIcon } from '@lucide/vue'

interface Props {
  label?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  value: string | number | boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  hint: undefined,
  size: 'md',
  id: undefined,
  name: undefined,
})

const model = defineModel<string | number | boolean | null>()

// `class` styles the outer wrapper; every other attribute and listener
// (@change, @focus, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-radio-${autoId}`)
const hintId = computed(() => `${inputId.value}-hint`)

const sizes = {
  sm: { row: 'gap-2 text-sm', circle: 'size-4', dot: 'size-1.5', hint: 'pl-6' },
  md: { row: 'gap-2 text-sm', circle: 'size-5', dot: 'size-2', hint: 'pl-7' },
  lg: { row: 'gap-3 text-base', circle: 'size-6', dot: 'size-2.5', hint: 'pl-9' },
} as const

const circleClasses =
  'peer m-0 cursor-pointer appearance-none rounded-full border border-border bg-transparent outline-none ' +
  'transition-[border-color,box-shadow] checked:border-primary ' +
  'enabled:not-checked:hover:border-muted-foreground ' +
  'focus-visible:ring-3 focus-visible:ring-primary/35 disabled:cursor-not-allowed'

const inputEl = useTemplateRef<HTMLInputElement>('input')

defineExpose({
  focus: () => inputEl.value?.focus(),
  el: inputEl,
})
</script>
