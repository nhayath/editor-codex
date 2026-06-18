<script setup lang="ts">
import type { ResolvedSection, ResolvedWidget } from '~~/types/template'
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

const layoutClass = computed(() => {
  const layout = props.section.resolvedGroupProps?.layout
  const arrangement = props.section.resolvedGroupProps?.arrangement

  if (layout === 'stack') {
    return 'grid gap-6'
  }

  if (arrangement === 'three-card') {
    return 'grid gap-6 @xl:grid-cols-3'
  }

  if (arrangement === 'side-main') {
    return 'grid gap-6 @xl:grid-cols-[minmax(260px,0.68fr)_minmax(0,1.32fr)]'
  }

  return 'grid gap-6 @xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]'
})

function componentFor(widget: ResolvedWidget) {
  return resolveWidgetComponent(widget.component, widget.widgetId)
}

function widgetShellClass(widget: ResolvedWidget) {
  const arrangement = props.section.resolvedGroupProps?.arrangement

  if (arrangement === 'side-main') {
    if (widget.slot === 'prayers') return 'min-w-0 order-1 @xl:order-2'
    if (widget.slot === 'khutbah') return 'min-w-0 order-2 @xl:order-1'
  }

  return 'min-w-0'
}
</script>

<template>
  <section
    v-if="section.enabled"
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
      <div class="@container">
        <div
          :class="layoutClass"
        >
          <template
            v-for="widget in section.resolvedWidgets"
            :key="widget.slot"
          >
            <div :class="widgetShellClass(widget)">
              <component
                :is="componentFor(widget)"
                v-if="componentFor(widget)"
                v-bind="widget.resolvedProps"
                :data="data"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
