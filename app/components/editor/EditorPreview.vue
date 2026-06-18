<script setup lang="ts">
import { getThemeStyle } from '~/composables/useTheme'

const editor = useHomepageEditor()
const previewShell = ref<HTMLElement | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

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

watch(
  () => editor.recentlyAddedSectionId.value,
  async (sectionId) => {
    if (!sectionId) return

    await nextTick()

    const section = previewShell.value?.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)
    section?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })

    if (highlightTimer) {
      clearTimeout(highlightTimer)
    }

    highlightTimer = setTimeout(() => {
      if (editor.recentlyAddedSectionId.value === sectionId) {
        editor.recentlyAddedSectionId.value = null
      }
    }, 3600)
  }
)

onBeforeUnmount(() => {
  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }
})
</script>

<template>
  <section
    ref="previewShell"
    class="flex min-w-0 flex-1 items-start overflow-auto bg-muted p-4"
  >
    <div
      class="mx-auto min-h-full overflow-hidden rounded-lg bg-default shadow-sm ring-1 ring-muted transition-all"
      :style="{ width: previewWidth, maxWidth: '100%' }"
    >
      <div
        v-if="editor.tenant.value && editor.draft.value"
        class="tenant-site min-h-full"
        :data-template="editor.draft.value.templateId"
        :style="style"
      >
        <TenantHeader
          :tenant="editor.tenant.value"
          :template-id="editor.draft.value.templateId"
        />
        <SectionRenderer
          v-for="section in editor.resolvedSections.value"
          :key="section.id"
          :section="section"
          :data="editor.siteData.value"
          :highlighted="section.id === editor.recentlyAddedSectionId.value"
        />
        <TenantFooter
          :tenant="editor.tenant.value"
          :template-id="editor.draft.value.templateId"
        />
      </div>
    </div>
  </section>
</template>

<style>
.tenant-section.editor-new-section-highlight {
  position: relative;
  z-index: 1;
  border-radius: 1rem;
  animation: editor-new-section-glow 1.2s ease-in-out 3;
}

.tenant-section.editor-new-section-highlight::before {
  pointer-events: none;
  content: "";
  position: absolute;
  inset: 0.75rem;
  border: 2px solid color-mix(in srgb, var(--color-secondary) 78%, white);
  border-radius: inherit;
  box-shadow:
    0 0 0 6px color-mix(in srgb, var(--color-secondary) 18%, transparent),
    0 0 42px color-mix(in srgb, var(--color-secondary) 46%, transparent);
  animation: editor-new-section-blink 0.6s ease-in-out 6;
}

@keyframes editor-new-section-glow {
  0%,
  100% {
    filter: none;
  }

  45% {
    filter: drop-shadow(0 0 22px color-mix(in srgb, var(--color-secondary) 42%, transparent));
  }
}

@keyframes editor-new-section-blink {
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tenant-section.editor-new-section-highlight,
  .tenant-section.editor-new-section-highlight::before {
    animation-duration: 1ms;
    animation-iteration-count: 1;
    scroll-behavior: auto;
  }
}
</style>
