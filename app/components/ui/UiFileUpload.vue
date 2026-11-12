<template>
  <div ref="root" :class="['text-foreground flex flex-col gap-1', attrs.class]">
    <label v-if="label" :for="inputId" class="text-muted-foreground text-sm">
      {{ label }}
    </label>

    <div
      v-if="model"
      :class="[
        'flex items-center gap-3 rounded-xl border p-4 transition-colors',
        borderClasses,
      ]"
    >
      <span
        class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
      >
        <component :is="fileIcon" class="size-5" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{{ model.name }}</p>
        <p class="text-muted-foreground text-xs">{{ fileSize }}</p>
      </div>
      <button
        type="button"
        :aria-label="`Remove ${model.name}`"
        :disabled="disabled"
        class="text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-primary/35 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
        @click="clear"
      >
        <XIcon class="size-4" />
      </button>
    </div>

    <label
      v-else
      :class="[
        'flex flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors has-focus-visible:ring-3',
        borderClasses,
        error
          ? 'has-focus-visible:ring-red-600/30'
          : 'has-focus-visible:ring-primary/35',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        !disabled && !error && 'hover:border-muted-foreground',
      ]"
    >
      <input
        :id="inputId"
        ref="input"
        v-bind="inputAttrs"
        type="file"
        class="sr-only"
        :name="name"
        :accept="accept"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="message ? messageId : undefined"
        @change="onChange"
      />
      <span
        class="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl"
      >
        <UploadIcon class="size-5" />
      </span>
      <span class="mt-4 text-sm">
        <span class="text-primary font-semibold">{{ placeholder }}</span>
        or drag it here
      </span>
      <span v-if="description" class="text-muted-foreground mt-1 text-xs">
        {{ description }}
      </span>
    </label>

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
import { FileIcon, FileSpreadsheetIcon, UploadIcon, XIcon } from '@lucide/vue'

interface Props {
  label?: string
  placeholder?: string
  description?: string
  hint?: string
  error?: string
  accept?: string
  disabled?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: 'Choose a file',
  description: undefined,
  hint: undefined,
  error: undefined,
  accept: undefined,
  id: undefined,
  name: undefined,
})

const model = defineModel<File | null>({ default: null })

// (capture, autofocus, data-*) goes to the <input> itself.
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const autoId = useId()
const inputId = computed(() => props.id ?? `ui-file-upload-${autoId}`)
const messageId = computed(() => `${inputId.value}-message`)
const message = computed(() => props.error || props.hint)

const rootEl = useTemplateRef<HTMLDivElement>('root')
const inputEl = useTemplateRef<HTMLInputElement>('input')

const { isOverDropZone } = useDropZone(rootEl, {
  multiple: false,
  onDrop: (files) => {
    if (!props.disabled && files?.[0]) model.value = files[0]
  },
})

const borderClasses = computed(() =>
  isOverDropZone.value && !props.disabled
    ? 'border-primary bg-primary/5'
    : props.error
      ? 'border-red-600'
      : 'border-border',
)

const fileIcon = computed(() =>
  /\.(csv|xlsx?|ods)$/i.test(model.value?.name ?? '')
    ? FileSpreadsheetIcon
    : FileIcon,
)

const fileSize = computed(() => {
  const bytes = model.value?.size ?? 0
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

const onChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) model.value = file
}

const clear = () => {
  model.value = null
  nextTick(() => inputEl.value?.focus())
}
</script>
