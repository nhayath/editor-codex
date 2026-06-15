import type { HomepageConfigResponse } from '~~/types/editor'

export function useTenantData(slug: MaybeRef<string>) {
  const key = computed(() => `tenant-homepage-${toValue(slug)}`)

  return useAsyncData<HomepageConfigResponse>(
    key,
    () => {
      const endpoint: string = `/api/tenant/${toValue(slug)}/config`
      return $fetch<HomepageConfigResponse>(endpoint)
    },
    { watch: [computed(() => toValue(slug))] }
  )
}
