<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { ResolvedSection, ResolvedWidget } from '~~/types/template'
import type { WidgetCategory, WidgetPropSchema } from '~~/types/widget'

type SectionsPanel =
  | { name: 'root' }
  | { name: 'section', sectionId: string }
  | { name: 'sectionBackground', sectionId: string }
  | { name: 'widget', sectionId: string, slot: string }
  | { name: 'widgetPicker' }

const editor = useHomepageEditor()
const widgetRegistry = useWidgetRegistry()
const widgetSearch = ref('')
const sectionsPanel = ref<HTMLElement | null>(null)
const panelStack = ref<SectionsPanel[]>([{ name: 'root' }])
const transitionName = ref('sections-slide-forward')

const sections = computed<ResolvedSection[]>({
  get: () => editor.resolvedSections.value,
  set: value => editor.reorderSections(value.map(section => section.id))
})

const currentPanel = computed(() => panelStack.value[panelStack.value.length - 1] ?? { name: 'root' })
const activeSection = computed(() => {
  if (!('sectionId' in currentPanel.value)) return null
  return sections.value.find(section => section.id === currentPanel.value.sectionId) ?? null
})
const activeWidget = computed(() => {
  if (currentPanel.value.name !== 'widget') return null
  return activeSection.value?.resolvedWidgets?.find(widget => widget.slot === currentPanel.value.slot) ?? null
})
const panelTitle = computed(() => {
  if (currentPanel.value.name === 'root') return 'Sections'
  if (currentPanel.value.name === 'widgetPicker') return 'Add widget'
  if (currentPanel.value.name === 'widget') return activeWidget.value?.name ?? activeWidget.value?.widgetId ?? 'Widget'
  if (currentPanel.value.name === 'sectionBackground') return 'Section background'
  return activeSection.value?.title ?? activeSection.value?.name ?? activeSection.value?.id ?? 'Section'
})
const tenantId = computed(() => editor.tenant.value?.id as string | undefined)

const categoryLabels: Record<WidgetCategory, string> = {
  content: 'Content',
  engagement: 'Engagement',
  media: 'Media',
  data: 'Data'
}

const filteredWidgetGroups = computed(() => {
  const query = widgetSearch.value.trim().toLowerCase()
  const widgets = widgetRegistry.widgets.value.filter((widget) => {
    if (!query) return true
    return [widget.name, widget.description, widget.category]
      .some(value => value.toLowerCase().includes(query))
  })

  return (Object.keys(categoryLabels) as WidgetCategory[])
    .map(category => ({
      category,
      label: categoryLabels[category],
      widgets: widgets.filter(widget => widget.category === category)
    }))
    .filter(group => group.widgets.length)
})

onMounted(() => {
  widgetRegistry.loadWidgets()
})

function openPanel(panel: SectionsPanel) {
  transitionName.value = 'sections-slide-forward'
  panelStack.value.push(panel)
}

function goBack() {
  if (panelStack.value.length <= 1) return
  transitionName.value = 'sections-slide-back'
  panelStack.value.pop()
}

function openSection(section: ResolvedSection) {
  editor.activeSectionId.value = section.id
  editor.focusSection(section.id)
  editor.requestPreviewScroll(section.id)
  openPanel({ name: 'section', sectionId: section.id })
}

function openWidget(section: ResolvedSection, widget: ResolvedWidget) {
  editor.activeSectionId.value = section.id
  editor.focusSection(section.id)
  openPanel({ name: 'widget', sectionId: section.id, slot: widget.slot })
}

function addWidget(widgetId: string, title: string) {
  editor.addWidgetSection(widgetId, title)
  widgetSearch.value = ''
  panelStack.value = [{ name: 'root' }]
}

function updateSection(section: ResolvedSection, key: string, value: unknown) {
  editor.updateSectionProps(section.id, { [key]: value })
}

function updateGroup(section: ResolvedSection, key: string, value: unknown) {
  editor.updateGroupProps(section.id, { [key]: value })
}

function updateWidget(section: ResolvedSection, widget: ResolvedWidget, key: string, value: unknown) {
  editor.updateGroupWidgetProps(section.id, widget.slot, { [key]: value })
}

function groupField(field: { key: string, label: string, type: string, default: unknown, options?: { label: string, value: string }[] }) {
  return field as WidgetPropSchema
}

// Compact summary (label + icon) + a live swatch for the section-background row,
// so the current state reads at a glance without opening the sub-panel.
const backgroundModes: Record<string, { label: string, icon: string }> = {
  theme: { label: 'Theme default', icon: 'i-lucide-undo-2' },
  solid: { label: 'Solid colour', icon: 'i-lucide-square' },
  gradient: { label: 'Gradient', icon: 'i-lucide-blend' },
  image: { label: 'Image', icon: 'i-lucide-image' },
  pattern: { label: 'Pattern', icon: 'i-lucide-sparkles' }
}

function backgroundSummary(section: ResolvedSection) {
  return backgroundModes[section.background?.type ?? 'theme'] ?? backgroundModes.theme!
}

function backgroundSwatch(section: ResolvedSection) {
  return getSurfaceBackgroundPresentation(section.background)
}

function isThemeBackground(section: ResolvedSection) {
  return !section.background || section.background.type === 'theme'
}

function scrollRowIntoView(sectionId: string) {
  const panel = sectionsPanel.value
  const scrollContainer = panel?.parentElement
  const row = panel?.querySelector<HTMLElement>(`[data-section-row="${CSS.escape(sectionId)}"]`)
  if (!scrollContainer || !row) return

  const rowRect = row.getBoundingClientRect()
  const scrollContainerRect = scrollContainer.getBoundingClientRect()
  const isAbove = rowRect.top < scrollContainerRect.top
  const isBelow = rowRect.bottom > scrollContainerRect.bottom

  if (isAbove || isBelow) {
    row.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  }
}

watch(
  () => editor.recentlyAddedSectionId.value,
  async (sectionId) => {
    if (!sectionId) return

    editor.activeTab.value = 'sections'
    panelStack.value = [{ name: 'root' }]
    await nextTick()
    scrollRowIntoView(sectionId)
  }
)

watch(
  () => editor.recentlyEditedSectionId.value,
  async (sectionId) => {
    if (!sectionId) return

    editor.activeTab.value = 'sections'
    await nextTick()
    scrollRowIntoView(sectionId)
  }
)

watch(
  () => editor.editorScrollRequest.value,
  async (request) => {
    if (!request) return

    editor.activeTab.value = 'sections'
    await nextTick()
    scrollRowIntoView(request.sectionId)
  }
)

watch(
  () => editor.editorOpenRequest.value,
  async (request) => {
    if (!request) return

    editor.activeTab.value = 'sections'
    editor.activeSectionId.value = request.sectionId
    editor.focusSection(request.sectionId)
    transitionName.value = 'sections-slide-forward'
    panelStack.value = request.widgetSlot
      ? [{ name: 'root' }, { name: 'section', sectionId: request.sectionId }, { name: 'widget', sectionId: request.sectionId, slot: request.widgetSlot }]
      : [{ name: 'root' }, { name: 'section', sectionId: request.sectionId }]
    await nextTick()
    scrollRowIntoView(request.sectionId)
  }
)
</script>

<template>
  <div
    ref="sectionsPanel"
    class="sections-panel-shell"
  >
    <div
      v-if="currentPanel.name !== 'root'"
      class="mb-4 flex items-center gap-2"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-chevron-left"
        aria-label="Back"
        @click="goBack"
      />
      <h2 class="truncate text-sm font-semibold text-default">
        {{ panelTitle }}
      </h2>
    </div>

    <Transition
      :name="transitionName"
      mode="out-in"
    >
      <section
        v-if="currentPanel.name === 'root'"
        key="root"
        class="grid w-full min-w-0 gap-4 overflow-hidden"
      >
        <div class="flex w-full min-w-0 items-center justify-between gap-3 overflow-hidden">
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-default">
              Sections
            </h2>
            <p class="truncate text-xs text-muted">
              Reorder, edit, or add widgets.
            </p>
          </div>
          <UButton
            class="shrink-0"
            icon="i-lucide-plus"
            label="Widget"
            size="sm"
            @click="openPanel({ name: 'widgetPicker' })"
          />
        </div>

        <Draggable
          v-model="sections"
          item-key="id"
          handle=".drag-handle"
          class="grid w-full min-w-0 gap-2 overflow-hidden"
        >
          <template #item="{ element }">
            <div
              class="w-full min-w-0 overflow-hidden rounded-md border border-muted bg-default transition"
              :class="{
                'editor-section-row-highlight': editor.focusedSectionId.value === element.id || editor.recentlyEditedSectionId.value === element.id,
                'editor-section-row-edit-highlight': editor.recentlyEditedSectionId.value === element.id,
                'ring-2 ring-primary/50 shadow-[0_0_22px_color-mix(in_srgb,var(--ui-primary)_24%,transparent)]': editor.focusedSectionId.value === element.id || editor.recentlyEditedSectionId.value === element.id
              }"
              :data-section-row="element.id"
              @mouseenter="editor.focusSection(element.id)"
              @mouseleave="editor.focusSection(null)"
            >
              <button
                type="button"
                class="flex w-full min-w-0 items-center gap-2 overflow-hidden p-3 text-left"
                @click="openSection(element)"
              >
                <UIcon
                  name="i-lucide-grip-vertical"
                  class="drag-handle size-4 shrink-0 cursor-grab text-muted"
                />
                <UIcon
                  :name="element.type === 'group' ? 'i-lucide-columns-2' : 'i-lucide-square'"
                  class="size-4 shrink-0 text-muted"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-default">
                    {{ element.title || element.id }}
                  </p>
                  <p class="truncate text-xs text-muted">
                    {{ element.type === 'group' ? `${element.resolvedWidgets?.length ?? 0} widgets` : (element.name ?? element.widgetId ?? 'Widget') }}
                  </p>
                </div>
                <UIcon
                  v-if="element.required"
                  name="i-lucide-lock"
                  class="size-4 shrink-0 text-muted"
                />
                <UButton
                  v-if="element.removable"
                  class="shrink-0"
                  icon="i-lucide-trash-2"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Remove section"
                  @click.stop="editor.removeSection(element.id)"
                />
                <USwitch
                  class="shrink-0"
                  :model-value="element.enabled"
                  :disabled="element.required"
                  @click.stop
                  @update:model-value="editor.toggleSection(element.id, $event)"
                />
                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-4 shrink-0 text-muted"
                />
              </button>
            </div>
          </template>
        </Draggable>
      </section>

      <section
        v-else-if="currentPanel.name === 'widgetPicker'"
        key="widgetPicker"
        class="grid w-full min-w-0 gap-3 overflow-hidden"
      >
        <UInput
          v-model="widgetSearch"
          icon="i-lucide-search"
          placeholder="Search widgets"
          size="sm"
        />

        <div
          v-if="widgetRegistry.loading.value"
          class="grid w-full min-w-0 gap-2 overflow-hidden"
        >
          <USkeleton class="h-14 w-full" />
          <USkeleton class="h-14 w-full" />
        </div>

        <div
          v-else-if="filteredWidgetGroups.length"
          class="grid w-full min-w-0 gap-4 overflow-hidden"
        >
          <div
            v-for="group in filteredWidgetGroups"
            :key="group.category"
            class="grid gap-2"
          >
            <p class="text-xs font-semibold uppercase text-muted">
              {{ group.label }}
            </p>
            <button
              v-for="widget in group.widgets"
              :key="widget.id"
              type="button"
              class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
              @click="addWidget(widget.id, widget.name)"
            >
              <UIcon
                :name="widget.icon"
                class="size-5 shrink-0 text-muted"
              />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-default">{{ widget.name }}</span>
                <span class="line-clamp-2 text-xs text-muted">{{ widget.description }}</span>
              </span>
              <UIcon
                name="i-lucide-plus"
                class="size-4 shrink-0 text-muted"
              />
            </button>
          </div>
        </div>

        <p
          v-else
          class="rounded-md border border-muted p-3 text-sm text-muted"
        >
          No widgets match your search.
        </p>
      </section>

      <section
        v-else-if="currentPanel.name === 'section' && activeSection"
        :key="`section-${activeSection.id}`"
          class="grid w-full min-w-0 gap-3 overflow-hidden"
        @focusin="editor.focusSection(activeSection.id)"
      >
        <template v-if="activeSection.type === 'group'">
          <div
            v-if="activeSection.groupPropSchema?.length"
            class="grid w-full min-w-0 gap-4 overflow-hidden rounded-md border border-muted bg-default p-3"
          >
            <p class="text-sm font-semibold text-default">
              Group layout
            </p>

            <PropField
              v-for="field in activeSection.groupPropSchema"
              :key="field.key"
              :field="groupField(field)"
              :model-value="activeSection.resolvedGroupProps?.[field.key]"
              :values="activeSection.resolvedGroupProps"
              @update:model-value="updateGroup(activeSection, field.key, $event)"
            />
          </div>

          <button
            v-for="widget in activeSection.resolvedWidgets ?? []"
            :key="widget.slot"
            type="button"
            class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
            @click="openWidget(activeSection, widget)"
          >
            <UIcon
              :name="widget.icon ?? 'i-lucide-box'"
              class="size-4 shrink-0 text-muted"
            />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-default">{{ widget.name ?? widget.widgetId }}</span>
              <span class="block truncate text-xs text-muted">Slot: {{ widget.slot }}</span>
            </span>
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 text-muted"
            />
          </button>
        </template>

        <template v-else>
          <PropFieldGroups
            :schema="activeSection.propSchema ?? []"
            :values="activeSection.resolvedProps"
            :tenant-id="tenantId"
            @update="(key, value) => activeSection && updateSection(activeSection, key, value)"
          />
        </template>

        <button
          type="button"
          class="mt-1 flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel({ name: 'sectionBackground', sectionId: activeSection.id })"
        >
          <span
            class="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border border-muted bg-elevated"
            :class="backgroundSwatch(activeSection).className"
            :style="backgroundSwatch(activeSection).style"
          >
            <UIcon
              v-if="isThemeBackground(activeSection)"
              :name="backgroundSummary(activeSection).icon"
              class="size-4 text-muted"
            />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-default">Section background</span>
            <span class="block truncate text-xs text-muted">{{ backgroundSummary(activeSection).label }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>
      </section>

      <section
        v-else-if="currentPanel.name === 'sectionBackground' && activeSection"
        :key="`section-bg-${activeSection.id}`"
        class="grid w-full min-w-0 gap-3 overflow-hidden"
      >
        <p class="text-xs leading-4 text-muted">
          A full-width colour, image, or pattern behind the whole section.
        </p>
        <BackgroundPicker
          :model-value="activeSection.background ?? null"
          :tenant-id="tenantId"
          :palette-id="editor.draft.value?.paletteId"
          :custom-colors="editor.draft.value?.customColors"
          @update:model-value="activeSection && editor.setSectionBackground(activeSection.id, $event)"
        />
      </section>

      <section
        v-else-if="currentPanel.name === 'widget' && activeSection && activeWidget"
        :key="`widget-${activeSection.id}-${activeWidget.slot}`"
        class="grid w-full min-w-0 gap-4 overflow-hidden"
        @focusin="editor.focusSection(activeSection.id)"
      >
        <PropFieldGroups
          :schema="activeWidget.propSchema ?? []"
          :values="activeWidget.resolvedProps"
          :tenant-id="tenantId"
          @update="(key, value) => activeSection && activeWidget && updateWidget(activeSection, activeWidget, key, value)"
        />
      </section>

      <section
        v-else
        key="missing"
        class="rounded-md border border-muted p-3 text-sm text-muted"
      >
        This section is no longer available.
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.sections-panel-shell {
  max-width: 100%;
  overflow: hidden;
}

.sections-slide-forward-enter-active,
.sections-slide-forward-leave-active,
.sections-slide-back-enter-active,
.sections-slide-back-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.sections-slide-forward-enter-from,
.sections-slide-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.sections-slide-forward-leave-to,
.sections-slide-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.editor-section-row-highlight {
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--ui-primary) 9%, transparent),
      transparent 58%
    ),
    var(--ui-bg);
}

.editor-section-row-edit-highlight {
  animation: editor-section-row-edit-pulse 0.9s ease-in-out 2;
}

@keyframes editor-section-row-edit-pulse {
  0%,
  100% {
    filter: none;
  }

  50% {
    filter: drop-shadow(0 0 14px color-mix(in srgb, var(--ui-primary) 34%, transparent));
  }
}
</style>
