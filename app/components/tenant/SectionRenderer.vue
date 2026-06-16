<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import { resolveWidgetComponent } from './widgetComponents'

const props = defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
}>()

const widgetComponent = computed(() => resolveWidgetComponent(props.section.component, props.section.widgetId))
</script>

<template>
  <GroupRenderer
    v-if="section.type === 'group'"
    :section="section"
    :data="data"
  />

  <section
    v-else-if="section.enabled && section.widgetId"
    :id="section.id"
    class="tenant-section"
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
