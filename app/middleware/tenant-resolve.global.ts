export default defineNuxtRouteMiddleware((to) => {
  const activeTenantSlug = useState<string | null>('activeTenantSlug', () => null)
  const slug = typeof to.params.slug === 'string' ? to.params.slug : null

  if (slug && (to.path.startsWith('/editor/') || to.path.startsWith('/site/'))) {
    activeTenantSlug.value = slug
  }
})
