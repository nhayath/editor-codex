<script setup lang="ts">
import type { ResolvedSection, ResolvedWidget } from '~~/types/template'
import { resolveWidgetComponent } from './widgetComponents'

const props = defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
}>()

const layoutClass = computed(() => {
  const layout = props.section.resolvedGroupProps?.layout
  return layout === 'stack'
    ? 'grid gap-6'
    : 'grid gap-6 @xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]'
})

function componentFor(widget: ResolvedWidget) {
  return resolveWidgetComponent(widget.component, widget.widgetId)
}
</script>

<template>
  <section
    v-if="section.enabled"
    :id="section.id"
    class="tenant-section"
  >
    <div class="tenant-container">
      <div
        class="@container"
        :class="layoutClass"
      >
        <template
          v-for="widget in section.resolvedWidgets"
          :key="widget.slot"
        >
          <component
            :is="componentFor(widget)"
            v-if="componentFor(widget)"
            v-bind="widget.resolvedProps"
            :data="data"
          />
        </template>
      </div>
    </div>
  </section>
</template>
