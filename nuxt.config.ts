// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  srcDir: 'src',
  imports: {
    dirs: ['stores', 'types', 'utils']
  },
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/i18n'],
  i18n: {
    locales: [{ code: 'en', file: 'en.json' }],
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'no_prefix'
  }
})
