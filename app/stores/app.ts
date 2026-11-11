export const useAppStore = defineStore('appStore', () => {
  const pageTitle = ref('')

  const setPageTitle = (title: string) => {
    pageTitle.value = title
  }

  return {
    pageTitle,
    setPageTitle,
  }
})
