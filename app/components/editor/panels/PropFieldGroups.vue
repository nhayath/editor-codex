<script setup lang="ts">
import type { WidgetPropSchema } from '~~/types/widget'

const props = defineProps<{
  schema: WidgetPropSchema[]
  values?: Record<string, unknown>
  tenantId?: string
  widgetId?: string
}>()

const emit = defineEmits<{
  update: [key: string, value: unknown]
  openBackground: [key: string]
  openCarouselStyle: []
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

// Background fields always render as standalone drill-in rows at the bottom (see
// the template) — never inside the top grid or a group accordion — so they open
// the slide-in picker in one click, matching the section-background row.
const isBackgroundField = (field: WidgetPropSchema) => field.type === 'background'
const isCarouselField = computed(() => props.widgetId === 'carousel')
const carouselStyleFieldKeys = new Set(['variant', 'accent', 'align', 'slidesPerView', 'imageRatio', 'showCta', 'showArrows', 'showDots', 'loop', 'autoplay', 'autoplaySpeed'])
const isCarouselStyleField = (field: WidgetPropSchema) => isCarouselField.value && carouselStyleFieldKeys.has(field.key)

// Fields without a group render at the top, always open.
const ungroupedFields = computed(() => props.schema.filter(field => !field.group && !isBackgroundField(field) && !isCarouselStyleField(field)))
const carouselVariantField = computed(() => props.schema.find(field => isCarouselStyleField(field) && field.key === 'variant'))
const carouselVariantLabel = computed(() => {
  const value = String(resolvedValues.value.variant ?? carouselVariantField.value?.default ?? 'single-slide')
  return carouselVariantField.value?.options?.find(option => option.value === value)?.label ?? 'Hero slide'
})

// Groups in first-appearance order that have at least one visible field.
const groups = computed(() => {
  const order: string[] = []
  const byName = new Map<string, WidgetPropSchema[]>()

  for (const field of props.schema) {
    if (!field.group || isBackgroundField(field) || isCarouselStyleField(field)) continue
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

// Standalone background drill-in rows, in schema order. PropField hides itself
// when a field's showWhen is unmet, so no extra visibility gating is needed here.
const backgroundFields = computed(() => props.schema.filter(isBackgroundField))

// First group open by default unless its schema explicitly opts into another
// initial state. User toggles persist while the panel remains mounted.
const toggled = ref<Record<string, boolean>>({})

function isOpen(group: { name: string, fields: WidgetPropSchema[] }, index: number) {
  if (group.name in toggled.value) return toggled.value[group.name]!
  const configured = group.fields.find(field => field.groupDefaultOpen !== undefined)?.groupDefaultOpen
  return configured ?? index === 0
}

function toggle(group: { name: string, fields: WidgetPropSchema[] }, index: number) {
  toggled.value = { ...toggled.value, [group.name]: !isOpen(group, index) }
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
        @open-background="emit('openBackground', field.key)"
      />
    </div>

    <button
      v-if="isCarouselField && carouselVariantField"
      type="button"
      class="flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-muted px-3 py-2.5 text-sm font-medium text-default transition-colors hover:bg-elevated/50"
      @click="emit('openCarouselStyle')"
    >
      <span class="truncate">Style</span>
      <span class="flex shrink-0 items-center gap-2">
        <span class="text-xs font-normal text-muted">{{ carouselVariantLabel }}</span>
        <UIcon
          name="i-lucide-chevron-right"
          class="size-4 text-muted"
        />
      </span>
    </button>

    <div
      v-for="(group, index) in groups"
      :key="group.name"
      class="overflow-hidden rounded-md border border-muted"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-default transition-colors hover:bg-elevated/50"
        @click="toggle(group, index)"
      >
        {{ group.name }}
        <UIcon
          :name="isOpen(group, index) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="size-4 text-muted"
        />
      </button>
      <div
        v-show="isOpen(group, index)"
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
          @open-background="emit('openBackground', field.key)"
        />
      </div>
    </div>

    <PropField
      v-for="field in backgroundFields"
      :key="field.key"
      :field="field"
      :model-value="resolvedValues[field.key]"
      :values="resolvedValues"
      :tenant-id="tenantId"
      @update:model-value="emit('update', field.key, $event)"
      @open-background="emit('openBackground', field.key)"
    />
  </div>
</template>
