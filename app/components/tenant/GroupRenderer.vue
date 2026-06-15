<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import { widgetComponents } from './widgetComponents'

const props = defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
}>()

const layoutClass = computed(() => {
  const layout = props.section.resolvedGroupProps?.layout
  return layout === 'stack'
    ? 'grid gap-6'
    : 'grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]'
})
</script>

<template>
  <section
    v-if="section.enabled"
    :id="section.id"
    class="tenant-section"
  >
    <div class="tenant-container">
      <div :class="layoutClass">
        <component
          :is="widgetComponents[widget.widgetId]"
          v-for="widget in section.resolvedWidgets"
          :key="widget.slot"
          v-bind="widget.resolvedProps"
          :data="data"
        />
      </div>
    </div>
  </section>
</template>
