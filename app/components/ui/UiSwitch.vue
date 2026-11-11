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
          role="switch"
          :class="[trackClasses, sizes[size].track]"
          :name="name"
          :disabled="disabled"
          :required="required"
          :aria-describedby="hint ? hintId : undefined"
        />
        <span
          :class="[
            'pointer-events-none absolute inset-y-0 left-0.5 my-auto rounded-full bg-white shadow-sm ' +
              'transition-transform motion-reduce:transition-none ' +
              'forced-color-adjust-none forced-colors:bg-[CanvasText]',
            sizes[size].thumb,
          ]"
          aria-hidden="true"
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
interface Props {
  label?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  hint: undefined,
  size: 'md',
  id: undefined,
  name: undefined,
})

const model = defineModel<boolean>({ default: false })

defineSlots<{
  /** Label content, when it needs more than plain text (e.g. a link). */
  default?: () => unknown
}>()

// (@change, @focus, aria-label, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-switch-${autoId}`)
const hintId = computed(() => `${inputId.value}-hint`)

const sizes = {
  sm: {
    row: 'gap-2 text-sm',
    track: 'h-4 w-7',
    thumb: 'size-3 peer-checked:translate-x-3',
    hint: 'pl-9',
  },
  md: {
    row: 'gap-2 text-sm',
    track: 'h-5 w-9',
    thumb: 'size-4 peer-checked:translate-x-4',
    hint: 'pl-11',
  },
  lg: {
    row: 'gap-3 text-base',
    track: 'h-6 w-11',
    thumb: 'size-5 peer-checked:translate-x-5',
    hint: 'pl-14',
  },
} as const

const trackClasses =
  'peer m-0 cursor-pointer appearance-none rounded-full border-2 border-transparent bg-foreground/25 outline-none ' +
  'transition-[background-color,box-shadow] checked:bg-primary enabled:checked:hover:bg-primary/90 ' +
  'focus-visible:ring-3 focus-visible:ring-primary/35 disabled:cursor-not-allowed'

const inputEl = useTemplateRef<HTMLInputElement>('input')

defineExpose({
  focus: () => inputEl.value?.focus(),
  el: inputEl,
})
</script>
