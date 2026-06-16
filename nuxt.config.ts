// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        '@tiptap/extension-image',
        '@tiptap/starter-kit',
        '@tiptap/vue-3',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-view',
        'vuedraggable', // CJS
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
