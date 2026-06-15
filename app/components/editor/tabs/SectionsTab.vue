<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { ResolvedSection } from '~~/types/template'

const editor = useHomepageEditor()

const sections = computed<ResolvedSection[]>({
  get: () => editor.resolvedSections.value,
  set: value => editor.reorderSections(value.map(section => section.id))
})

function selectSection(section: ResolvedSection) {
  editor.activeSectionId.value = editor.activeSectionId.value === section.id ? null : section.id
}
</script>

<template>
  <div class="grid gap-4">
    <div>
      <h2 class="text-sm font-semibold text-default">
        Sections
      </h2>
    </div>

    <Draggable
      v-model="sections"
      item-key="id"
      handle=".drag-handle"
      class="grid gap-2"
    >
      <template #item="{ element }">
        <div class="rounded-md border border-muted bg-default">
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
