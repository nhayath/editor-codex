<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import { widgetComponents } from './widgetComponents'

defineProps<{
  section: ResolvedSection
  data?: Record<string, unknown>
}>()

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
        :is="widgetComponents[section.widgetId]"
        v-bind="section.resolvedProps"
        :data="data"
      />
    </div>
  </section>
</template>
