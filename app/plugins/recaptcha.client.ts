import { install } from 'vue3-recaptcha-v2'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(install, {
    sitekey: '6Le0Da8UAAAAANOJzK5Yg_pzCC8bfvZNIZF_YPsl',
  })
})
