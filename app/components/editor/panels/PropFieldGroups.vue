<script setup lang="ts">
import type { WidgetPropSchema } from '~~/types/widget'

const props = defineProps<{
  schema: WidgetPropSchema[]
  values?: Record<string, unknown>
  tenantId?: string
}>()

const emit = defineEmits<{
  update: [key: string, value: unknown]
}>()

const resolvedValues = computed(() => props.values ?? {})

function matchesCondition(condition: { key: string; value: unknown }) {
  const current = resolvedValues.value[condition.key]
  const expected = condition.value
  return Array.isArray(expected) ? expected.includes(current) : current === expected
}

function isVisible(field: WidgetPropSchema) {
  const showWhen = field.showWhen
  if (!showWhen) return true
  return Array.isArray(showWhen) ? showWhen.some(matchesCondition) : matchesCondition(showWhen)
}

// Fields without a group render at the top, always open.
const ungroupedFields = computed(() => props.schema.filter(field => !field.group))

// Groups in first-appearance order that have at least one visible field.
const groups = computed(() => {
  const order: string[] = []
  const byName = new Map<string, WidgetPropSchema[]>()

  for (const field of props.schema) {
    if (!field.group) continue
    if (!byName.has(field.group)) {
      byName.set(field.group, [])
      order.push(field.group)
    }
    byName.get(field.group)!.push(field)
  }

  return order
    .map(name => ({ name, fields: byName.get(name)! }))
    .filter(group => group.fields.some(isVisible))
})

// First group open by default; the rest collapsed. User toggles persist.
const toggled = ref<Record<string, boolean>>({})

function isOpen(name: string, index: number) {
  return name in toggled.value ? toggled.value[name]! : index === 0
}

function toggle(name: string, index: number) {
  toggled.value = { ...toggled.value, [name]: !isOpen(name, index) }
}

function spanClass(field: WidgetPropSchema) {
  return field.span === 'half' ? 'min-w-0' : 'col-span-2'
}
</script>

<template>
  <div class="grid w-full min-w-0 gap-3 overflow-hidden">
    <div
      v-if="ungroupedFields.length"
      class="grid grid-cols-2 gap-x-3 gap-y-4"
    >
      <PropField
        v-for="field in ungroupedFields"
        :key="field.key"
        :class="spanClass(field)"
        :field="field"
        :model-value="resolvedValues[field.key]"
        :values="resolvedValues"
        :tenant-id="tenantId"
        @update:model-value="emit('update', field.key, $event)"
      />
    </div>

    <div
      v-for="(group, index) in groups"
      :key="group.name"
      class="overflow-hidden rounded-md border border-muted"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-default transition-colors hover:bg-elevated/50"
        @click="toggle(group.name, index)"
      >
        {{ group.name }}
        <UIcon
          :name="isOpen(group.name, index) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="size-4 text-muted"
        />
      </button>
      <div
        v-show="isOpen(group.name, index)"
        class="grid grid-cols-2 gap-x-3 gap-y-4 px-3 pb-3"
      >
        <PropField
          v-for="field in group.fields"
          :key="field.key"
          :class="spanClass(field)"
          :field="field"
          :model-value="resolvedValues[field.key]"
          :values="resolvedValues"
          :tenant-id="tenantId"
          @update:model-value="emit('update', field.key, $event)"
        />
      </div>
    </div>
  </div>
</template>
