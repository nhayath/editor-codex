<script setup lang="ts">
import type { WidgetPropSchema } from '~~/types/widget'
import type { SurfaceBackgroundConfig } from '~~/types/template'
import { pageBackgroundPatterns } from '~/composables/usePageBackground'
import { getThemeStyle } from '~/composables/useTheme'

const props = defineProps<{
  field: WidgetPropSchema
  modelValue: unknown
  values?: Record<string, unknown>
  tenantId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  // Background fields drill into a slide-in sub-panel (owned by SectionsTab)
  // rather than rendering the picker inline, matching the section-background UX.
  openBackground: []
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
  get: () => {
    if (typeof value.value === 'string') return value.value !== 'false' && value.value !== '0'
    return Boolean(value.value)
  },
  set: next => emit('update:modelValue', next)
})

const selectValue = computed({
  get: () => value.value as any,
  set: next => emit('update:modelValue', next)
})

const selectItems = computed(() => (props.field.options ?? []) as any[])

// Colour fields may store a `var(--color-*)` reference (e.g. the theme default).
// The colour picker can't render a CSS variable, so resolve it to the active
// theme's hex for display; picking a new colour writes the literal hex back.
const editor = useHomepageEditor()
const themeColors = computed<Record<string, string>>(() => {
  const draft = editor.draft.value
  return getThemeStyle(draft?.paletteId, draft?.fontPairId, draft?.customColors) as Record<string, string>
})

function resolveColor(input: string) {
  const match = /^var\(\s*(--[\w-]+)\s*\)$/.exec(input.trim())
  if (!match) return input
  return themeColors.value[match[1]!] ?? input
}

const colorValue = computed({
  get: () => resolveColor(stringValue.value),
  set: next => emit('update:modelValue', next)
})

const usesFeatureSlideEditor = computed(() => props.field.key === 'slides' && props.values?.variant === 'feature')

const patternItems = computed(() => {
  const options = props.field.options?.length
    ? props.field.options
    : pageBackgroundPatterns.map(pattern => ({ label: pattern.name, value: pattern.id }))

  return options.map((option) => {
    const id = String(option.value)
    const pattern = pageBackgroundPatterns.find(item => item.id === id)
    return {
      ...option,
      value: id,
      url: pattern?.url ?? '',
      description: pattern?.description ?? ''
    }
  })
})

function patternMaskStyle(url: string) {
  return {
    maskImage: `url("${url}")`,
    WebkitMaskImage: `url("${url}")`
  }
}

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

// Background fields render as a compact drill-in row (styled like a group
// accordion header): the label + current mode as a muted value. The actual
// picker opens in a slide-in sub-panel (see SectionsTab).
const backgroundValue = computed(() => (value.value as SurfaceBackgroundConfig | null) ?? null)
const backgroundMode = computed(() => getSurfaceBackgroundMode(backgroundValue.value))

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
  <button
    v-if="visible && field.type === 'background'"
    type="button"
    class="flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-muted px-3 py-2.5 text-sm font-medium text-default transition-colors hover:bg-elevated/50"
    @click="emit('openBackground')"
  >
    <span class="truncate">{{ field.label }}</span>
    <span class="flex shrink-0 items-center gap-2">
      <span class="text-xs font-normal text-muted">{{ backgroundMode.label }}</span>
      <UIcon
        name="i-lucide-chevron-right"
        class="size-4 text-muted"
      />
    </span>
  </button>

  <UFormField
    v-else-if="visible"
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

    <div
      v-else-if="field.type === 'pattern-select'"
      class="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1"
    >
      <button
        v-for="item in patternItems"
        :key="item.value"
        type="button"
        class="group min-w-0 overflow-hidden rounded-md border border-muted bg-default text-left transition hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
        :class="stringValue === item.value ? 'ring-2 ring-primary' : ''"
        :title="String(item.label)"
        :aria-pressed="stringValue === item.value"
        @click="stringValue = item.value"
      >
        <span class="relative block h-16 overflow-hidden bg-elevated">
          <span
            v-if="item.value === 'none'"
            class="absolute inset-0 bg-[linear-gradient(135deg,transparent_47%,color-mix(in_srgb,var(--ui-border-muted)_80%,transparent)_48%,color-mix(in_srgb,var(--ui-border-muted)_80%,transparent)_52%,transparent_53%)]"
          />
          <span
            v-else
            class="absolute inset-0 bg-primary opacity-35 [mask-position:center] [mask-repeat:repeat] [mask-size:48px]"
            :style="patternMaskStyle(item.url)"
          />
          <UIcon
            v-if="stringValue === item.value"
            name="i-lucide-check"
            class="absolute right-1.5 top-1.5 size-4 rounded-full bg-primary p-0.5 text-inverted"
          />
        </span>
        <span class="block min-w-0 px-2 py-1.5">
          <span class="block truncate text-xs font-semibold text-default">{{ item.label }}</span>
          <span
            v-if="item.description"
            class="mt-0.5 block truncate text-[11px] text-muted"
          >
            {{ item.description }}
          </span>
        </span>
      </button>
    </div>

    <UColorPicker
      v-else-if="field.type === 'color'"
      v-model="colorValue"
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

    <FeaturePanelPicker
      v-else-if="usesFeatureSlideEditor"
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
