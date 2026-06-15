<script setup lang="ts">
const editor = useHomepageEditor()

const items = [
  { label: 'Theme', value: 'theme', icon: 'i-lucide-palette', slot: 'theme' },
  { label: 'Sections', value: 'sections', icon: 'i-lucide-layout-list', slot: 'sections' },
  { label: 'Settings', value: 'settings', icon: 'i-lucide-settings', slot: 'settings' }
]
</script>

<template>
  <aside class="flex w-[360px] shrink-0 flex-col border-r border-muted bg-elevated">
    <UTabs
      v-model="editor.activeTab.value"
      :items="items"
      :content="false"
      variant="link"
      class="border-b border-muted px-3 pt-3"
    />

    <div class="min-h-0 flex-1 overflow-auto p-4">
      <ThemeTab v-if="editor.activeTab.value === 'theme'" />
      <SectionsTab v-else-if="editor.activeTab.value === 'sections'" />
      <SettingsTab v-else />
    </div>
  </aside>
</template>
