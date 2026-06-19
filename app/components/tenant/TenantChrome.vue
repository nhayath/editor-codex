<script setup lang="ts">
import type { TemplateDefinition } from '~~/types/template'
import { resolveFooterComponent, resolveHeaderComponent } from './chromeComponents'

type ChromeDefinition = TemplateDefinition['header'] | TemplateDefinition['footer']

const props = defineProps<{
  area: 'header' | 'footer'
  tenant?: Record<string, unknown> | null
  templateId?: string
  chrome?: ChromeDefinition
}>()

const chromeProps = computed(() => props.chrome?.props ?? {})

const chromeComponent = computed(() => {
  if (props.area === 'header') {
    return resolveHeaderComponent(props.chrome?.component)
  }

  return resolveFooterComponent(props.chrome?.component)
})
</script>

<template>
  <component
    :is="chromeComponent"
    :tenant="tenant"
    :template-id="templateId"
    v-bind="chromeProps"
  />
</template>
