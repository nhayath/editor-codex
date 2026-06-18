<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import { resolveWidgetComponent } from './widgetComponents'

const props = defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
  highlighted?: boolean
}>()

const widgetComponent = computed(() => resolveWidgetComponent(props.section.component, props.section.widgetId))
</script>

<template>
  <GroupRenderer
    v-if="section.type === 'group'"
    :section="section"
    :data="data"
    :highlighted="highlighted"
  />

  <section
    v-else-if="section.enabled && section.widgetId"
    :id="section.id"
    class="tenant-section"
    :class="{ 'editor-new-section-highlight': highlighted }"
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
