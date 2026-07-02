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

const variantField = computed(() => props.schema.find(field => field.key === 'variant'))
const variantValue = computed(() => String(resolvedValues.value.variant ?? variantField.value?.default ?? 'with-buttons'))

const variantOptions = computed(() => (variantField.value?.options ?? []).map(option => ({
  label: String(option.label).split(' — ')[0],
  value: String(option.value)
})))

const styleFieldKeys = new Set([
  'align',
  'imageUrl',
  'overlayOpacity',
  'textTone',
  'texture',
  'spotlightCardBg',
  'spotlightCardOpacity',
  'spotlightCardBlur'
])
const styleFields = computed(() => props.schema.filter(field => styleFieldKeys.has(field.key)))

function updateVariant(value: string) {
  emit('update', 'variant', value)
}

function previewClass(value: string) {
  return `hero-style-preview hero-style-preview--${value}`
}
</script>

<template>
  <div class="grid w-full min-w-0 gap-5 overflow-hidden">
    <div class="grid w-full min-w-0 grid-cols-2 gap-2">
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
            <span class="preview-image" />
            <span class="preview-panel" />
            <span class="preview-copy">
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
.hero-style-preview {
  position: absolute;
  inset: 10px;
  display: block;
  color: var(--ui-primary);
}

.hero-style-preview :where(.preview-image, .preview-panel, .preview-copy, .preview-actions) {
  position: absolute;
}

.preview-image,
.preview-panel {
  border-radius: 0.45rem;
  background: color-mix(in srgb, currentColor 20%, transparent);
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
  width: 26px;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 38%, transparent);
}

.hero-style-preview--simple .preview-copy {
  top: 22px;
  right: 15px;
  left: 15px;
  place-items: center;
}

.hero-style-preview--simple .preview-actions,
.hero-style-preview--simple .preview-image,
.hero-style-preview--simple .preview-panel {
  display: none;
}

.hero-style-preview--split .preview-panel {
  inset: 4px auto 8px 0;
  width: 48%;
}

.hero-style-preview--split .preview-image {
  inset: 4px 0 8px auto;
  width: 44%;
}

.hero-style-preview--split .preview-copy {
  top: 18px;
  left: 8px;
  width: 36%;
}

.hero-style-preview--split .preview-actions {
  bottom: 15px;
  left: 8px;
}

.hero-style-preview--with-image .preview-image {
  inset: 2px 0 8px;
}

.hero-style-preview--with-image .preview-panel {
  top: 16px;
  bottom: 18px;
  left: 10px;
  width: 46%;
  background: color-mix(in srgb, var(--ui-bg) 78%, transparent);
}

.hero-style-preview--with-image .preview-copy {
  top: 25px;
  left: 18px;
  width: 34%;
}

.hero-style-preview--with-image .preview-actions {
  bottom: 25px;
  left: 18px;
}

.hero-style-preview--with-buttons .preview-panel {
  inset: 4px 0 8px;
}

.hero-style-preview--with-buttons .preview-copy {
  top: 17px;
  left: 14px;
  width: 56%;
}

.hero-style-preview--with-buttons .preview-actions {
  bottom: 18px;
  left: 14px;
}

.hero-style-preview--immersive .preview-image {
  inset: 0 0 8px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 28%, transparent),
    color-mix(in srgb, currentColor 10%, transparent)
  );
}

.hero-style-preview--immersive .preview-copy {
  bottom: 22px;
  left: 12px;
  width: 52%;
}

.hero-style-preview--immersive .preview-copy span,
.hero-style-preview--immersive .preview-actions span {
  background: rgba(255, 255, 255, 0.78);
}

.hero-style-preview--immersive .preview-actions {
  bottom: 10px;
  left: 12px;
}

.hero-style-preview--banner .preview-panel {
  inset: 18px 0 22px;
}

.hero-style-preview--banner .preview-copy {
  top: 25px;
  left: 12px;
  width: 48%;
}

.hero-style-preview--banner .preview-actions {
  top: 33px;
  right: 12px;
}

.hero-style-preview--split .preview-panel,
.hero-style-preview--with-image .preview-image,
.hero-style-preview--with-buttons .preview-panel,
.hero-style-preview--immersive .preview-image,
.hero-style-preview--banner .preview-panel {
  background-color: color-mix(in srgb, currentColor 16%, var(--ui-bg));
}

.hero-style-preview--with-buttons .preview-image,
.hero-style-preview--banner .preview-image,
.hero-style-preview--immersive .preview-panel {
  display: none;
}
</style>
