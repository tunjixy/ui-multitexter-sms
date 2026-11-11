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
          type="checkbox"
          :class="[boxClasses, sizes[size].box]"
          :name="name"
          :value="value"
          :disabled="disabled"
          :required="required"
          :aria-describedby="hint ? hintId : undefined"
        />
        <CheckIcon
          :class="[
            'pointer-events-none absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100',
            sizes[size].check,
          ]"
          :stroke-width="3"
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
import { CheckIcon } from '@lucide/vue'

interface Props {
  label?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  /** Added to / removed from the v-model when it's an array. */
  value?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  hint: undefined,
  size: 'md',
  id: undefined,
  name: undefined,
  value: undefined,
})

const model = defineModel<boolean | (string | number)[]>({ default: false })

// `class` styles the outer wrapper; every other attribute and listener
// (@change, @focus, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-checkbox-${autoId}`)
const hintId = computed(() => `${inputId.value}-hint`)

const sizes = {
  sm: { row: 'gap-2 text-sm', box: 'size-4', check: 'size-3', hint: 'pl-6' },
  md: { row: 'gap-2 text-sm', box: 'size-5', check: 'size-3.5', hint: 'pl-7' },
  lg: { row: 'gap-3 text-base', box: 'size-6', check: 'size-4', hint: 'pl-9' },
} as const

const boxClasses =
  'peer m-0 cursor-pointer appearance-none rounded-sm border border-border bg-transparent outline-none ' +
  'transition-[background-color,border-color,box-shadow] checked:border-primary checked:bg-primary ' +
  'enabled:not-checked:hover:border-muted-foreground ' +
  'focus-visible:ring-3 focus-visible:ring-primary/35 disabled:cursor-not-allowed'

const inputEl = useTemplateRef<HTMLInputElement>('input')

defineExpose({
  focus: () => inputEl.value?.focus(),
  el: inputEl,
})
</script>
