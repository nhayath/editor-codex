<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'

const props = defineProps<{
  section: ResolvedSection
}>()

const editor = useHomepageEditor()
const values = computed(() => props.section.resolvedProps ?? {})
const tenantId = computed(() => editor.tenant.value?.id as string | undefined)

function update(key: string, value: unknown) {
  editor.updateSectionProps(props.section.id, { [key]: value })
}
</script>

<template>
  <div class="grid gap-4">
    <PropField
      v-for="field in section.propSchema ?? []"
      :key="field.key"
      :field="field"
      :model-value="values[field.key]"
      :values="values"
      :tenant-id="tenantId"
      @update:model-value="update(field.key, $event)"
    />
  </div>
</template>
