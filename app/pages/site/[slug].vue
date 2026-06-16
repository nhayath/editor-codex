<script setup lang="ts">
import type { HomepageConfigResponse } from '~~/types/editor'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error } = await useAsyncData(
  () => `site-${slug.value}`,
  () => $fetch<HomepageConfigResponse>(`/api/tenant/${slug.value}/config`),
  { watch: [slug] }
)

useTheme(
  computed(() => data.value?.config.paletteId),
  computed(() => data.value?.config.fontPairId),
  computed(() => data.value?.config.customColors)
)

const tenantName = computed(() => typeof data.value?.tenant?.name === 'string' ? data.value.tenant.name : 'Mosque site')
const tenantSettings = computed(() => data.value?.tenant?.settings as { aboutText?: string } | undefined)

useHead(() => ({
  title: tenantName.value,
  meta: [
    {
      name: 'description',
      content: tenantSettings.value?.aboutText ?? 'Mosque homepage'
    }
  ]
}))
</script>

<template>
  <div
    class="tenant-site min-h-screen"
    :data-template="data?.config.templateId"
  >
    <UContainer
      v-if="pending"
      class="py-12"
    >
      <USkeleton class="h-12 w-72" />
      <USkeleton class="mt-6 h-96 w-full" />
    </UContainer>

    <UContainer
      v-else-if="error"
      class="py-12"
    >
      <UAlert
        color="error"
        icon="i-lucide-circle-alert"
        title="Unable to load site"
        :description="error.message"
      />
    </UContainer>

    <template v-else-if="data">
      <TenantHeader :tenant="data.tenant" />
      <SectionRenderer
        v-for="section in data.resolvedSections"
        :key="section.id"
        :section="section"
        :data="data.data"
      />
      <TenantFooter :tenant="data.tenant" />
    </template>
  </div>
</template>
