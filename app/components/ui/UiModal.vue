<template>
  <dialog
    ref="dialog"
    v-bind="passthroughAttrs"
    :data-ui-modal="baseId"
    :data-closing="closing || undefined"
    :class="dialogClasses"
    :aria-labelledby="title || $slots.header ? titleId : undefined"
    :aria-describedby="description ? descriptionId : undefined"
    @cancel="onCancel"
    @close="onClose"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <div
      class="relative flex min-h-0 grow flex-col gap-4 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <header v-if="title || description || $slots.header" class="pr-8">
        <div :id="titleId">
          <slot name="header" :close="close">
            <h2 v-if="title" class="text-lg leading-snug font-semibold">
              {{ title }}
            </h2>
          </slot>
        </div>
        <p
          v-if="description"
          :id="descriptionId"
          class="text-muted-foreground mt-1 text-sm/relaxed"
        >
          {{ description }}
        </p>
      </header>

      <button
        v-if="!hideClose"
        type="button"
        class="text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-primary/35 absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-3"
        aria-label="Close"
        @click="close"
      >
        <XIcon class="size-4.5" />
      </button>

      <div
        v-if="$slots.default"
        class="focus-visible:ring-primary/35 -mx-6 -my-1 min-h-0 grow overflow-y-auto overscroll-contain px-6 py-1 text-sm/relaxed outline-none focus-visible:ring-3 focus-visible:ring-inset"
      >
        <slot :close="close" />
      </div>

      <footer
        v-if="$slots.footer"
        class="flex flex-wrap justify-end gap-2 pt-2"
      >
        <slot name="footer" :close="close" />
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { XIcon } from '@lucide/vue'

interface Props {
  title?: string
  description?: string
  /** sm, md and lg are a bottom sheet on phones; full fills the screen everywhere. */
  size?: 'sm' | 'md' | 'lg' | 'full'
  overlay?: 'blur' | 'transparent' | 'dim'
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  hideClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  size: 'md',
  overlay: 'blur',
  closeOnBackdrop: true,
  closeOnEsc: true,
  hideClose: false,
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  default?: (props: { close: () => void }) => unknown
  header?: (props: { close: () => void }) => unknown
  footer?: (props: { close: () => void }) => unknown
}>()

// `class` and other attributes go on the <dialog>.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const overlays = {
  blur: 'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
  dim: 'backdrop:bg-black/60',
  transparent: 'backdrop:bg-transparent',
} as const

const sheet =
  'mx-0 mt-auto mb-0 w-full max-w-none max-h-[calc(100dvh-2rem)] rounded-t-2xl ' +
  'sm:m-auto sm:w-[calc(100%-2rem)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-xl'

const sizes = {
  sm: [sheet, 'sm:max-w-sm'],
  md: [sheet, 'sm:max-w-lg'],
  lg: [sheet, 'sm:max-w-3xl'],
  full: 'm-0 size-full max-h-none max-w-none rounded-none',
} as const

// Opening starts from the `starting:` styles and closing moves to the
// `data-closing:` ones. Phones and `full` slide up from the bottom edge;
// centred dialogs slide up a short way while fading in.
const motion =
  'transition-[translate,opacity] duration-300 ease-out data-closing:duration-200 data-closing:ease-in ' +
  'starting:translate-y-full data-closing:translate-y-full ' +
  'backdrop:transition-opacity backdrop:duration-300 data-closing:backdrop:duration-200 ' +
  'starting:backdrop:opacity-0 data-closing:backdrop:opacity-0 '

const centredMotion =
  'sm:starting:translate-y-8 sm:starting:opacity-0 sm:data-closing:translate-y-8 sm:data-closing:opacity-0'

const dialogClasses = computed(() => [
  'overflow-auto border-0 bg-surface p-0 text-foreground shadow-2xl open:flex open:flex-col',
  sizes[props.size],
  motion,
  props.size !== 'full' && centredMotion,
  overlays[props.overlay],
  attrs.class,
])

const dialogEl = useTemplateRef<HTMLDialogElement>('dialog')
const baseId = useId()
const titleId = `ui-modal-${baseId}-title`
const descriptionId = `ui-modal-${baseId}-description`

function close() {
  open.value = false
}

const modalStack = useModalStack()
const closing = ref(false)
let run = 0

const animationsSettled = async (dialog: HTMLDialogElement) => {
  await nextTick()
  await Promise.allSettled(dialog.getAnimations().map((a) => a.finished))
}

// Closing waits for the slide-down to finish before the <dialog> is closed.
const sync = async (isOpen: boolean) => {
  const dialog = dialogEl.value
  if (!dialog) return
  const thisRun = ++run

  if (isOpen) {
    closing.value = false
    if (!dialog.open) dialog.showModal()
    await animationsSettled(dialog)
    if (thisRun === run) modalStack.add(baseId)
    return
  }

  if (!dialog.open) return
  modalStack.remove(baseId)
  closing.value = true
  await animationsSettled(dialog)
  if (thisRun !== run) return
  closing.value = false
  dialog.close()
}

// <dialog> only exists in the browser, so sync after mount (safe for SSR).
onMounted(() => sync(open.value))

watch(open, sync, { flush: 'post' })

onBeforeUnmount(() => {
  modalStack.remove(baseId)
  if (dialogEl.value?.open) dialogEl.value.close()
})

const onCancel = (event: Event) => {
  event.preventDefault()
  if (props.closeOnEsc) close()
}

const onClose = () => {
  modalStack.remove(baseId)
  closing.value = false
  if (open.value) open.value = false
  emit('close')
}

let pressStartedOnBackdrop = false

const onPointerDown = (event: PointerEvent) => {
  pressStartedOnBackdrop = event.target === dialogEl.value
}

const onClick = (event: MouseEvent) => {
  if (
    props.closeOnBackdrop &&
    pressStartedOnBackdrop &&
    event.target === dialogEl.value
  ) {
    close()
  }
  pressStartedOnBackdrop = false
}
</script>
