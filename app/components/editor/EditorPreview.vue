<script setup lang="ts">
import { getThemeStyle } from '~/composables/useTheme'

const editor = useHomepageEditor()

const previewWidth = computed(() => {
  if (editor.previewDevice.value === 'mobile') return '390px'
  if (editor.previewDevice.value === 'tablet') return '768px'
  return '100%'
})

const style = computed(() => {
  if (!editor.draft.value) return {}
  return getThemeStyle(
    editor.draft.value.paletteId,
    editor.draft.value.fontPairId,
    editor.draft.value.customColors
  )
})
</script>

<template>
  <section class="flex min-w-0 flex-1 items-start overflow-auto bg-muted p-4">
    <div
      class="mx-auto min-h-full overflow-hidden rounded-lg bg-default shadow-sm ring-1 ring-muted transition-all"
      :style="{ width: previewWidth, maxWidth: '100%' }"
    >
      <div
        v-if="editor.tenant.value && editor.draft.value"
        class="tenant-site min-h-full"
        :style="style"
      >
        <TenantHeader :tenant="editor.tenant.value" />
        <SectionRenderer
          v-for="section in editor.resolvedSections.value"
          :key="section.id"
          :section="section"
          :data="editor.siteData.value"
        />
        <TenantFooter :tenant="editor.tenant.value" />
      </div>
    </div>
  </section>
</template>
