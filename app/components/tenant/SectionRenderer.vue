<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import { resolveWidgetComponent } from './widgetComponents'

const props = defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
  highlighted?: boolean
  activeHighlight?: boolean
  editingHighlight?: boolean
}>()

const emit = defineEmits<{
  focusSection: []
  blurSection: []
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
    @focus-section="emit('focusSection')"
    @blur-section="emit('blurSection')"
  />

  <section
    v-else-if="section.enabled && section.widgetId"
    :id="section.id"
    class="tenant-section"
    :class="{
      'editor-new-section-highlight': highlighted,
      'editor-preview-section-highlight': activeHighlight,
      'editor-preview-section-edit-highlight': editingHighlight
    }"
    @mouseenter="emit('focusSection')"
    @mouseleave="emit('blurSection')"
  >
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
