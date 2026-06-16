<script setup lang="ts">
import type { ResolvedSection } from '~~/types/template'
import type { WidgetPropSchema } from '~~/types/widget'

const props = defineProps<{
  section: ResolvedSection
}>()

const editor = useHomepageEditor()
const tenantId = computed(() => editor.tenant.value?.id as string | undefined)

function updateGroup(key: string, value: unknown) {
  editor.updateGroupProps(props.section.id, { [key]: value })
}

function updateWidget(slot: string, key: string, value: unknown) {
  editor.updateGroupWidgetProps(props.section.id, slot, { [key]: value })
}

function groupField(field: { key: string, label: string, type: string, default: unknown, options?: { label: string, value: string }[] }) {
  return field as WidgetPropSchema
}
</script>

<template>
  <div class="grid gap-5">
    <div
      v-if="section.groupPropSchema?.length"
      class="grid gap-4 rounded-md border border-muted p-3"
    >
      <p class="text-sm font-semibold text-default">
        Group layout
      </p>
      <PropField
        v-for="field in section.groupPropSchema"
        :key="field.key"
        :field="groupField(field)"
        :model-value="section.resolvedGroupProps?.[field.key]"
        :values="section.resolvedGroupProps"
        @update:model-value="updateGroup(field.key, $event)"
      />
    </div>

    <div
      v-for="widget in section.resolvedWidgets ?? []"
      :key="widget.slot"
      class="grid gap-4 rounded-md border border-muted p-3"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-default">
            {{ widget.name ?? widget.widgetId }}
          </p>
          <p class="text-xs text-muted">
            Slot: {{ widget.slot }}
          </p>
        </div>
        <UIcon
          :name="widget.icon ?? 'i-lucide-box'"
          class="size-5 text-muted"
        />
      </div>

      <PropField
        v-for="field in widget.propSchema ?? []"
        :key="field.key"
        :field="field"
        :model-value="widget.resolvedProps[field.key]"
        :values="widget.resolvedProps"
        :tenant-id="tenantId"
        @update:model-value="updateWidget(widget.slot, field.key, $event)"
      />
    </div>
  </div>
</template>
