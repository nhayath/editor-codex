<script setup lang="ts">
import { getThemeStyle } from '~/composables/useTheme'

const editor = useHomepageEditor()
const previewShell = ref<HTMLElement | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined
let editHighlightTimer: ReturnType<typeof setTimeout> | undefined

function scrollIntoViewIfNeeded(element: HTMLElement, container: HTMLElement) {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const isAbove = elementRect.top < containerRect.top
  const isBelow = elementRect.bottom > containerRect.bottom

  if (isAbove || isBelow) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  }
}

async function scrollPreviewToSection(sectionId: string) {
  await nextTick()

  const preview = previewShell.value
  const section = preview?.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)
  if (!preview || !section) return

  scrollIntoViewIfNeeded(section, preview)
}

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

    await scrollPreviewToSection(sectionId)

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

watch(
  () => editor.previewScrollRequest.value,
  async (request) => {
    if (request) {
      await scrollPreviewToSection(request.sectionId)
    }
  }
)

watch(
  () => editor.recentlyEditedSectionId.value,
  async (sectionId) => {
    if (!sectionId) return

    await scrollPreviewToSection(sectionId)

    if (editHighlightTimer) {
      clearTimeout(editHighlightTimer)
    }

    editHighlightTimer = setTimeout(() => {
      if (editor.recentlyEditedSectionId.value === sectionId) {
        editor.recentlyEditedSectionId.value = null
      }
    }, 1800)
  }
)

onBeforeUnmount(() => {
  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }
  if (editHighlightTimer) {
    clearTimeout(editHighlightTimer)
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
          :active-highlight="section.id === editor.recentlyEditedSectionId.value || section.id === editor.focusedSectionId.value"
          :editing-highlight="section.id === editor.recentlyEditedSectionId.value"
          editable
          @focus-section="editor.focusSection(section.id)"
          @blur-section="editor.focusSection(null)"
          @edit-section="editor.openSectionEditor(section.id)"
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

.tenant-section.editor-preview-section-highlight {
  position: relative;
  z-index: 1;
  border-radius: 1rem;
  outline: 2px solid color-mix(in srgb, var(--color-primary) 70%, white);
  outline-offset: -0.5rem;
  box-shadow:
    inset 0 0 0 9999px color-mix(in srgb, var(--color-primary) 6%, transparent),
    0 0 34px color-mix(in srgb, var(--color-primary) 28%, transparent);
  transition: outline-color 160ms ease, box-shadow 160ms ease;
}

.tenant-section.editor-preview-editable-section {
  position: relative;
}

.tenant-section.editor-preview-section-highlight::after {
  pointer-events: none;
  content: "";
  position: absolute;
  inset: 0.5rem;
  border-radius: inherit;
  border: 1px solid color-mix(in srgb, var(--color-primary) 46%, transparent);
}

.tenant-section .editor-preview-edit-link {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid color-mix(in srgb, var(--color-primary) 36%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 92%, white);
  color: var(--color-text);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--color-text) 18%, transparent);
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
  opacity: 0;
  padding: 0.5rem 0.7rem;
  pointer-events: auto;
  transform: translateY(-0.25rem);
  transition: opacity 140ms ease, transform 140ms ease;
}

.tenant-section:hover .editor-preview-edit-link,
.tenant-section .editor-preview-edit-link:focus-visible {
  opacity: 1;
  transform: translateY(0);
}

.tenant-section .editor-preview-edit-link:hover {
  border-color: color-mix(in srgb, var(--color-primary) 60%, transparent);
  color: var(--color-primary);
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

.tenant-section.editor-preview-section-edit-highlight {
  animation: editor-preview-edit-pulse 0.9s ease-in-out 2;
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

@keyframes editor-preview-edit-pulse {
  0%,
  100% {
    filter: none;
  }

  50% {
    filter: drop-shadow(0 0 18px color-mix(in srgb, var(--color-primary) 34%, transparent));
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
