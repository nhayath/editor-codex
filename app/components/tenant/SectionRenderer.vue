<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import { resolveWidgetComponent } from './widgetComponents'

const props = defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
  highlighted?: boolean
  activeHighlight?: boolean
  editingHighlight?: boolean
  editable?: boolean
}>()

const emit = defineEmits<{
  'focus-section': []
  'blur-section': []
  'edit-section': []
}>()

const widgetComponent = computed(() => resolveWidgetComponent(props.section.component, props.section.widgetId))
</script>

<template>
  <GroupRenderer
    v-if="section.type === 'group'"
    :section="section"
    :data="data"
    :highlighted="highlighted"
    :active-highlight="activeHighlight"
    :editing-highlight="editingHighlight"
    :editable="editable"
    @focus-section="emit('focus-section')"
    @blur-section="emit('blur-section')"
    @edit-section="emit('edit-section')"
  />

  <section
    v-else-if="section.enabled && section.widgetId"
    :id="section.id"
    class="tenant-section"
    :class="{
      'editor-preview-editable-section': editable,
      'editor-new-section-highlight': highlighted,
      'editor-preview-section-highlight': activeHighlight,
      'editor-preview-section-edit-highlight': editingHighlight
    }"
    @mouseenter="emit('focus-section')"
    @mouseleave="emit('blur-section')"
  >
    <button
      v-if="editable"
      type="button"
      class="editor-preview-edit-link"
      aria-label="Edit section"
      @click.stop="emit('edit-section')"
    >
      <span aria-hidden="true">Edit</span>
    </button>
    <div class="tenant-container">
      <component
        :is="widgetComponent"
        v-if="widgetComponent"
        v-bind="section.resolvedProps"
        :data="data"
      />
    </div>
  </section>
</template>
