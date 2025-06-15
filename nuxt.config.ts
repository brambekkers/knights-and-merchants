// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  srcDir: 'src',
  imports: {
    dirs: ['stores', 'types']
  },
  modules: ['@pinia/nuxt', '@vueuse/nuxt']
})
