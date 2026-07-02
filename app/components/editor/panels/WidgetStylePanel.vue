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
}>()

const styleGroups = new Set(['Style', 'Display', 'Texture', 'Image', 'Card', 'Appearance', 'Layout'])
const heroStyleFieldKeys = new Set([
  'align',
  'imageUrl',
  'overlayOpacity',
  'textTone',
  'texture',
  'spotlightCardBg',
  'spotlightCardOpacity',
  'spotlightCardBlur'
])

const variantField = computed(() => props.schema.find(field => field.key === 'variant'))
const resolvedValues = computed(() => {
  const defaults = Object.fromEntries(props.schema.map(field => [field.key, field.default]))
  return { ...defaults, ...(props.values ?? {}) }
})
const variantValue = computed(() => String(resolvedValues.value.variant ?? variantField.value?.default ?? ''))

const variantOptions = computed(() => (variantField.value?.options ?? []).map(option => ({
  label: String(option.label).split(' — ')[0],
  value: String(option.value)
})))

const styleFields = computed(() => props.schema.filter((field) => {
  if (field.key === 'variant' || field.type === 'background') return false
  if (props.widgetId === 'hero' && heroStyleFieldKeys.has(field.key)) return true
  return Boolean(field.group && styleGroups.has(field.group))
}))

function updateVariant(value: string) {
  emit('update', 'variant', value)
  if (props.widgetId === 'carousel' && (value === 'multi-slide' || value === 'cards') && !resolvedValues.value.slidesPerView) {
    emit('update', 'slidesPerView', '3')
  }
}

function previewKind(value: string) {
  if (props.widgetId === 'carousel') {
    if (value === 'single-slide') return 'hero'
    if (value === 'multi-slide' || value === 'cards') return 'multi'
    if (value === 'minimal') return 'minimal'
    if (value === 'feature') return 'feature'
  }

  if (props.widgetId === 'hero') {
    if (value === 'simple') return 'minimal'
    if (value === 'with-buttons') return 'panel'
    if (value === 'with-image' || value === 'immersive') return 'hero'
    if (value === 'banner') return 'banner'
  }

  if (['list', 'table', 'compact', 'timeline', 'agenda', 'directory', 'strip', 'rail', 'minimal'].includes(value)) return 'list'
  if (['split', 'feature', 'featured', 'feature-panel', 'iqamah-panel', 'with-image'].includes(value)) return 'feature'
  if (['overlay', 'banner', 'immersive', 'single'].includes(value)) return 'hero'
  if (['masonry', 'mosaic', 'filmstrip', 'multi-slide'].includes(value)) return 'multi'
  return 'cards'
}

function previewClass(value: string) {
  return ['widget-style-preview', `widget-style-preview--${previewKind(value)}`]
}
</script>

<template>
  <div class="grid w-full min-w-0 gap-5 overflow-hidden">
    <div
      v-if="variantOptions.length"
      class="grid w-full min-w-0 grid-cols-2 gap-2"
    >
      <button
        v-for="option in variantOptions"
        :key="option.value"
        type="button"
        class="group min-w-0 overflow-hidden rounded-md border bg-default text-left transition hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
        :class="option.value === variantValue ? 'border-primary ring-2 ring-primary/35' : 'border-muted'"
        :aria-pressed="option.value === variantValue"
        @click="updateVariant(option.value)"
      >
        <span class="relative block h-24 overflow-hidden bg-elevated">
          <span :class="previewClass(option.value)">
            <span class="preview-media" />
            <span class="preview-panel" />
            <span class="preview-copy">
              <span />
              <span />
              <span />
            </span>
            <span class="preview-items">
              <span />
              <span />
              <span />
            </span>
            <span class="preview-actions">
              <span />
              <span />
            </span>
          </span>
          <UIcon
            v-if="option.value === variantValue"
            name="i-lucide-check"
            class="absolute right-1.5 top-1.5 size-4 rounded-full bg-primary p-0.5 text-inverted"
          />
        </span>
        <span class="block truncate px-2 py-1.5 text-xs font-semibold text-default">
          {{ option.label }}
        </span>
      </button>
    </div>

    <div
      v-if="styleFields.length"
      class="grid grid-cols-2 gap-x-3 gap-y-4"
    >
      <PropField
        v-for="field in styleFields"
        :key="field.key"
        :class="field.span === 'half' ? 'min-w-0' : 'col-span-2'"
        :field="field"
        :model-value="resolvedValues[field.key]"
        :values="resolvedValues"
        :tenant-id="tenantId"
        @update:model-value="emit('update', field.key, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.widget-style-preview {
  position: absolute;
  inset: 10px;
  display: block;
  color: var(--ui-primary);
}

.widget-style-preview :where(.preview-media, .preview-panel, .preview-copy, .preview-items, .preview-actions) {
  position: absolute;
}

.preview-media,
.preview-panel,
.preview-items span {
  border-radius: 0.45rem;
  background: color-mix(in srgb, currentColor 18%, var(--ui-bg));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 18%, transparent);
}

.preview-copy {
  display: grid;
  gap: 4px;
}

.preview-copy span {
  display: block;
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 34%, transparent);
}

.preview-copy span:first-child {
  width: 72%;
  height: 8px;
}

.preview-copy span:nth-child(2) {
  width: 96%;
}

.preview-copy span:nth-child(3) {
  width: 58%;
}

.preview-actions {
  display: flex;
  gap: 5px;
}

.preview-actions span {
  width: 25px;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 38%, transparent);
}

.preview-items {
  display: grid;
  gap: 5px;
}

.preview-items span {
  display: block;
}

.widget-style-preview--cards .preview-items {
  inset: 4px 0 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.widget-style-preview--cards .preview-items span::after {
  display: block;
  width: 60%;
  height: 5px;
  margin: 35px 8px 0;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 28%, transparent);
  content: "";
}

.widget-style-preview--cards .preview-copy,
.widget-style-preview--cards .preview-media,
.widget-style-preview--cards .preview-panel,
.widget-style-preview--cards .preview-actions {
  display: none;
}

.widget-style-preview--multi .preview-items {
  inset: 2px 0 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.widget-style-preview--multi .preview-copy,
.widget-style-preview--multi .preview-media,
.widget-style-preview--multi .preview-panel,
.widget-style-preview--multi .preview-actions {
  display: none;
}

.widget-style-preview--list .preview-items {
  inset: 2px 0 8px;
}

.widget-style-preview--list .preview-items span {
  height: 18px;
}

.widget-style-preview--list .preview-copy,
.widget-style-preview--list .preview-media,
.widget-style-preview--list .preview-panel,
.widget-style-preview--list .preview-actions {
  display: none;
}

.widget-style-preview--feature .preview-panel {
  inset: 4px auto 8px 0;
  width: 48%;
}

.widget-style-preview--feature .preview-media {
  inset: 4px 0 8px auto;
  width: 44%;
}

.widget-style-preview--feature .preview-copy {
  top: 18px;
  left: 8px;
  width: 36%;
}

.widget-style-preview--feature .preview-actions {
  bottom: 15px;
  left: 8px;
}

.widget-style-preview--feature .preview-items {
  display: none;
}

.widget-style-preview--hero .preview-media {
  inset: 2px 0 8px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 26%, transparent),
    color-mix(in srgb, currentColor 10%, transparent)
  );
}

.widget-style-preview--hero .preview-copy {
  right: 12px;
  bottom: 28px;
  left: 12px;
}

.widget-style-preview--hero .preview-copy span,
.widget-style-preview--hero .preview-actions span {
  background: rgba(255, 255, 255, 0.78);
}

.widget-style-preview--hero .preview-actions {
  bottom: 13px;
  left: 12px;
}

.widget-style-preview--hero .preview-panel,
.widget-style-preview--hero .preview-items {
  display: none;
}

.widget-style-preview--panel .preview-panel {
  inset: 4px 0 8px;
}

.widget-style-preview--panel .preview-copy {
  top: 17px;
  left: 14px;
  width: 56%;
}

.widget-style-preview--panel .preview-actions {
  bottom: 18px;
  left: 14px;
}

.widget-style-preview--panel .preview-media,
.widget-style-preview--panel .preview-items {
  display: none;
}

.widget-style-preview--banner .preview-panel {
  inset: 18px 0 22px;
}

.widget-style-preview--banner .preview-copy {
  top: 25px;
  left: 12px;
  width: 48%;
}

.widget-style-preview--banner .preview-actions {
  top: 33px;
  right: 12px;
}

.widget-style-preview--banner .preview-media,
.widget-style-preview--banner .preview-items {
  display: none;
}

.widget-style-preview--minimal .preview-copy {
  top: 22px;
  right: 14px;
  left: 14px;
  place-items: center;
}

.widget-style-preview--minimal .preview-media,
.widget-style-preview--minimal .preview-panel,
.widget-style-preview--minimal .preview-items,
.widget-style-preview--minimal .preview-actions {
  display: none;
}
</style>
