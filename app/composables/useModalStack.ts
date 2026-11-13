// Open UiModals, oldest first. The Toaster teleports into the newest one,
// since a modal <dialog> sits in the top layer above any z-index.
export default function useModalStack() {
  const stack = useState<string[]>('modal-stack', () => [])

  const top = computed(() => stack.value.at(-1))

  const add = (id: string) => {
    if (!stack.value.includes(id)) stack.value = [...stack.value, id]
  }

  const remove = (id: string) => {
    stack.value = stack.value.filter((entry) => entry !== id)
  }

  return { top, add, remove }
}
