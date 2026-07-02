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
const variantValue = computed(() => String(resolvedValues.value.variant ?? variantField.value?.default ?? 'single-slide'))

const variantOptions = computed(() => (variantField.value?.options ?? []).map(option => ({
  label: String(option.label),
  value: String(option.value)
})))

const displayFieldKeys = new Set(['accent', 'align', 'slidesPerView', 'imageRatio', 'showCta', 'showArrows', 'showDots', 'loop', 'autoplay', 'autoplaySpeed'])
const displayFields = computed(() => props.schema.filter(field => displayFieldKeys.has(field.key)))

function updateVariant(value: string) {
  emit('update', 'variant', value)
  if ((value === 'multi-slide' || value === 'cards') && !resolvedValues.value.slidesPerView) {
    emit('update', 'slidesPerView', '3')
  }
}

function previewClass(value: string) {
  return `carousel-style-preview carousel-style-preview--${value}`
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
            <span class="preview-copy">
              <span />
              <span />
              <span />
            </span>
            <span class="preview-card preview-card-a" />
            <span class="preview-card preview-card-b" />
            <span class="preview-card preview-card-c" />
            <span class="preview-dots">
              <span />
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
      v-if="displayFields.length"
      class="grid grid-cols-2 gap-x-3 gap-y-4"
    >
      <PropField
        v-for="field in displayFields"
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
.carousel-style-preview {
  position: absolute;
  inset: 10px;
  display: block;
  color: var(--ui-primary);
}

.carousel-style-preview :where(.preview-image, .preview-copy, .preview-card, .preview-dots) {
  position: absolute;
}

.preview-image,
.preview-card {
  border-radius: 0.45rem;
  background: color-mix(in srgb, currentColor 22%, transparent);
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
  width: 70%;
  height: 8px;
}

.preview-copy span:nth-child(2) {
  width: 92%;
}

.preview-copy span:nth-child(3) {
  width: 58%;
}

.preview-dots {
  bottom: 0;
  left: 50%;
  display: flex;
  gap: 4px;
  transform: translateX(-50%);
}

.preview-dots span {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 34%, transparent);
}

.carousel-style-preview--single-slide .preview-image,
.carousel-style-preview--multi-slide .preview-card,
.carousel-style-preview--cards .preview-card {
  inset-block: 2px 10px;
}

.carousel-style-preview--single-slide .preview-image {
  inset-inline: 0;
}

.carousel-style-preview--single-slide .preview-copy {
  right: 10px;
  bottom: 18px;
  left: 10px;
}

.carousel-style-preview--single-slide .preview-copy span {
  background: rgba(255, 255, 255, 0.78);
}

.carousel-style-preview--multi-slide .preview-card-a,
.carousel-style-preview--cards .preview-card-a {
  left: 0;
  width: 31%;
}

.carousel-style-preview--multi-slide .preview-card-b,
.carousel-style-preview--cards .preview-card-b {
  left: 34.5%;
  width: 31%;
}

.carousel-style-preview--multi-slide .preview-card-c,
.carousel-style-preview--cards .preview-card-c {
  right: 0;
  width: 31%;
}

.carousel-style-preview--cards .preview-card {
  background: color-mix(in srgb, currentColor 12%, var(--ui-bg));
}

.carousel-style-preview--cards .preview-card::after {
  position: absolute;
  right: 8px;
  bottom: 9px;
  left: 8px;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 28%, transparent);
  content: "";
}

.carousel-style-preview--split .preview-image {
  top: 4px;
  bottom: 12px;
  left: 0;
  width: 45%;
}

.carousel-style-preview--split .preview-copy {
  top: 17px;
  right: 0;
  width: 45%;
}

.carousel-style-preview--minimal .preview-copy {
  top: 22px;
  right: 14px;
  left: 14px;
  place-items: center;
}

.carousel-style-preview--minimal .preview-copy span {
  height: 5px;
}

.carousel-style-preview--feature .preview-card-a {
  inset: 2px 0 10px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 26%, transparent),
    color-mix(in srgb, currentColor 10%, transparent)
  );
}

.carousel-style-preview--feature .preview-copy {
  top: 16px;
  left: 10px;
  width: 43%;
}

.carousel-style-preview--feature .preview-card-b {
  top: 18px;
  right: 10px;
  width: 34%;
  height: 34px;
  background: color-mix(in srgb, var(--ui-bg) 82%, transparent);
}

.carousel-style-preview--single-slide :where(.preview-card, .preview-card-a, .preview-card-b, .preview-card-c),
.carousel-style-preview--split :where(.preview-card, .preview-card-a, .preview-card-b, .preview-card-c),
.carousel-style-preview--minimal :where(.preview-image, .preview-card, .preview-card-a, .preview-card-b, .preview-card-c),
.carousel-style-preview--multi-slide .preview-image,
.carousel-style-preview--multi-slide .preview-copy,
.carousel-style-preview--cards .preview-image,
.carousel-style-preview--cards .preview-copy,
.carousel-style-preview--feature .preview-image,
.carousel-style-preview--feature .preview-card-c {
  display: none;
}
</style>
