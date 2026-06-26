<script setup lang="ts">
import type { WidgetPropSchema } from '~~/types/widget'

const props = defineProps<{
  field: WidgetPropSchema
  modelValue: unknown
  values?: Record<string, unknown>
  tenantId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

const value = computed({
  get: () => props.modelValue ?? props.field.default,
  set: next => emit('update:modelValue', next)
})

const stringValue = computed({
  get: () => String(value.value ?? ''),
  set: next => emit('update:modelValue', next)
})

const numberValue = computed({
  get: () => Number(value.value ?? 0),
  set: next => emit('update:modelValue', Number(next))
})

const booleanValue = computed({
  get: () => Boolean(value.value),
  set: next => emit('update:modelValue', next)
})

const selectValue = computed({
  get: () => value.value as any,
  set: next => emit('update:modelValue', next)
})

const selectItems = computed(() => (props.field.options ?? []) as any[])

function matchesCondition(condition: { key: string; value: unknown }) {
  const current = props.values?.[condition.key]
  const expected = condition.value
  return Array.isArray(expected) ? expected.includes(current) : current === expected
}

const visible = computed(() => {
  const showWhen = props.field.showWhen
  if (!showWhen) return true
  // Array of conditions = OR (visible if any match).
  return Array.isArray(showWhen) ? showWhen.some(matchesCondition) : matchesCondition(showWhen)
})

// Rich-text editor (UEditor) — a curated, non-technical button set. Grouped
// arrays render with separators between them. Kept intentionally small so a
// non-techie editing a short blurb isn't overwhelmed.
const richtextToolbar = [
  [
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', tooltip: { text: 'Heading' } },
    { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', tooltip: { text: 'Subheading' } }
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } }
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Bullet list' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Numbered list' } }
  ],
  [
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Link' } },
    { kind: 'blockquote', icon: 'i-lucide-quote', tooltip: { text: 'Quote' } },
    { kind: 'clearFormatting', icon: 'i-lucide-remove-formatting', tooltip: { text: 'Clear formatting' } }
  ]
]

// Bubble menu — appears on text selection. Inline marks + link only.
const richtextBubble = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
  { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Link' } }
]
</script>

<template>
  <UFormField
    v-if="visible"
    :label="field.label"
    :name="field.key"
    :required="field.required"
  >
    <UTextarea
      v-if="field.type === 'textarea'"
      v-model="stringValue"
      autoresize
      :maxrows="6"
      :placeholder="field.placeholder"
    />

    <UEditor
      v-else-if="field.type === 'richtext'"
      v-slot="{ editor }"
      v-model="stringValue"
      content-type="html"
      class="min-h-52 rounded-md border border-muted bg-default"
      placeholder="Start writing..."
    >
      <UEditorToolbar
        :editor="editor"
        :items="richtextToolbar"
        class="border-b border-muted"
      />
      <UEditorToolbar
        :editor="editor"
        :items="richtextBubble"
        layout="bubble"
      />
    </UEditor>

    <UInput
      v-else-if="field.type === 'number'"
      v-model="numberValue"
      type="number"
      :placeholder="field.placeholder"
    />

    <USwitch
      v-else-if="field.type === 'toggle'"
      v-model="booleanValue"
    />

    <USelect
      v-else-if="field.type === 'select'"
      v-model="selectValue"
      :items="selectItems"
      value-key="value"
      label-key="label"
      :placeholder="field.placeholder"
      class="w-full"
    />

    <UColorPicker
      v-else-if="field.type === 'color'"
      v-model="stringValue"
    />

    <ImagePicker
      v-else-if="field.type === 'image'"
      v-model="stringValue"
      :tenant-id="tenantId"
    />

    <GalleryImagePicker
      v-else-if="field.type === 'images'"
      v-model="stringValue"
      :tenant-id="tenantId"
    />

    <CarouselSlidePicker
      v-else-if="field.type === 'slides'"
      v-model="stringValue"
      :tenant-id="tenantId"
    />

    <FeaturePanelPicker
      v-else-if="field.type === 'feature-slides'"
      v-model="stringValue"
      :tenant-id="tenantId"
    />

    <UInput
      v-else
      v-model="stringValue"
      :type="field.type === 'url' ? 'url' : 'text'"
      :icon="field.type === 'icon' ? 'i-lucide-icons' : undefined"
      :placeholder="field.placeholder"
    />
  </UFormField>
</template>
