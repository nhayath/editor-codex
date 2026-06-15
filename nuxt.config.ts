// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@tiptap/vue-3',
        '@tiptap/starter-kit',
        '@tiptap/extension-image',
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-view',
        'prosemirror-transform',
      ]
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  ui: {
    theme: {
      defaultVariants: {
        color: 'neutral'
      }
    }
  }
})
