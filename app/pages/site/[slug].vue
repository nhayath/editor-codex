<script setup lang="ts">
import type { HomepageConfigResponse } from '~~/types/editor'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error } = await useAsyncData(
  () => `site-${slug.value}`,
  () => $fetch<HomepageConfigResponse>(`/api/tenant/${slug.value}/config`),
  { watch: [slug] }
)

const { style: themeStyle } = useTheme(
  computed(() => data.value?.config.paletteId),
  computed(() => data.value?.config.fontPairId),
  computed(() => data.value?.config.customColors)
)

// The announcement bar is page-level chrome (configured in Settings, stored on
// the homepage config — not a section). Rendering it as a direct child of
// .tenant-site lets its `position: sticky` pin across the whole page.
const announcementBar = computed(() => {
  const bar = data.value?.config.announcementBar
  return bar?.enabled ? bar.props : null
})

const pageBackground = computed(() => {
  const config = data.value?.config
  return getPageBackgroundPresentation(
    config?.pageBackground,
    config?.paletteId,
    config?.customColors
  )
})

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
    :class="pageBackground.className"
    :data-template="data?.config.templateId"
    :style="{ ...themeStyle, ...pageBackground.style }"
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
      <WidgetAnnouncementBar
        v-if="announcementBar"
        v-bind="announcementBar"
        :data="data.data"
      />
      <TenantChrome
        area="header"
        :chrome="data.template.header"
        :tenant="data.tenant"
        :template-id="data.config.templateId"
      />
      <SectionRenderer
        v-for="section in data.resolvedSections"
        :key="section.id"
        :section="section"
        :data="data.data"
      />
      <TenantChrome
        area="footer"
        :chrome="data.template.footer"
        :tenant="data.tenant"
        :template-id="data.config.templateId"
      />
    </template>
  </div>
</template>
