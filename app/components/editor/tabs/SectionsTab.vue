<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { ResolvedSection } from '~~/types/template'
import type { WidgetCategory } from '~~/types/widget'

const editor = useHomepageEditor()
const widgetRegistry = useWidgetRegistry()
const showWidgetPicker = ref(false)
const widgetSearch = ref('')
const sectionsPanel = ref<HTMLElement | null>(null)

const sections = computed<ResolvedSection[]>({
  get: () => editor.resolvedSections.value,
  set: value => editor.reorderSections(value.map(section => section.id))
})

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

function selectSection(section: ResolvedSection) {
  editor.activeSectionId.value = section.id
  editor.focusSection(section.id)
  editor.requestPreviewScroll(section.id)
}

function addWidget(widgetId: string, title: string) {
  editor.addWidgetSection(widgetId, title)
  showWidgetPicker.value = false
  widgetSearch.value = ''
}
</script>

<template>
  <div
    ref="sectionsPanel"
    class="grid gap-4"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Sections
        </h2>
        <p class="text-xs text-muted">
          Reorder, edit, or add widgets.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Widget"
        size="sm"
        @click="showWidgetPicker = !showWidgetPicker"
      />
    </div>

    <div
      v-if="showWidgetPicker"
      class="grid gap-3 rounded-md border border-muted bg-default p-3"
    >
      <UInput
        v-model="widgetSearch"
        icon="i-lucide-search"
        placeholder="Search widgets"
        size="sm"
      />

      <div
        v-if="widgetRegistry.loading.value"
        class="grid gap-2"
      >
        <USkeleton class="h-14 w-full" />
        <USkeleton class="h-14 w-full" />
      </div>

      <div
        v-else-if="filteredWidgetGroups.length"
        class="grid max-h-80 gap-4 overflow-auto pr-1"
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
            class="flex w-full items-center gap-3 rounded-md border border-muted p-3 text-left transition hover:bg-elevated"
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
    </div>

    <Draggable
      v-model="sections"
      item-key="id"
      handle=".drag-handle"
      class="grid gap-2"
    >
      <template #item="{ element }">
        <div
          class="rounded-md border border-muted bg-default transition"
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
            class="flex w-full items-center gap-3 p-3 text-left"
            @click="selectSection(element)"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="drag-handle size-4 cursor-grab text-muted"
            />
            <UIcon
              :name="element.type === 'group' ? 'i-lucide-columns-2' : 'i-lucide-square'"
              class="size-4 text-muted"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-default">
                {{ element.title || element.id }}
              </p>
              <p class="text-xs text-muted">
                {{ element.required ? 'Required' : 'Optional' }}
              </p>
            </div>
            <UIcon
              v-if="element.required"
              name="i-lucide-lock"
              class="size-4 text-muted"
            />
            <UButton
              v-if="element.removable"
              icon="i-lucide-trash-2"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Remove section"
              @click.stop="editor.removeSection(element.id)"
            />
            <USwitch
              :model-value="element.enabled"
              :disabled="element.required"
              @click.stop
              @update:model-value="editor.toggleSection(element.id, $event)"
            />
            <UIcon
              :name="editor.activeSectionId.value === element.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="size-4 text-muted"
            />
          </button>

          <div
            v-if="editor.activeSectionId.value === element.id"
            class="border-t border-muted p-3"
          >
            <GroupEditor
              v-if="element.type === 'group'"
              :section="element"
            />
            <SectionEditor
              v-else
              :section="element"
            />
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<style scoped>
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
