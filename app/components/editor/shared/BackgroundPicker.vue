<script setup lang="ts">
import type { SurfaceBackgroundConfig, SurfacePatternOverlay } from '~~/types/template'
import { getPalette } from '~/composables/useTheme'
import { defaultPatternOverlay, migrateSurfaceBackground } from '~/composables/usePageBackground'

// Friendly, non-technical background editor shared by widgets and sections.
// Mode cards + contextual controls mirror the page background editor so admins
// only ever learn one background UI. Emits `null` for the theme/default mode
// (removes any stored fill); every other mode emits a SurfaceBackgroundConfig.
const props = withDefaults(defineProps<{
  modelValue?: SurfaceBackgroundConfig | null
  tenantId?: string
  paletteId?: string
  customColors?: Record<string, string> | null
  themeLabel?: string
  themeDescription?: string
}>(), {
  themeLabel: 'Theme default',
  themeDescription: 'Match the site background'
})

const emit = defineEmits<{
  'update:modelValue': [value: SurfaceBackgroundConfig | null]
}>()

const palette = computed(() => ({
  ...getPalette(props.paletteId),
  ...(props.customColors ?? {})
}))

// Migrate legacy standalone-pattern configs so the editor shows the right base
// + overlay. null and an explicit `theme` config both mean "no fill".
const config = computed(() => migrateSurfaceBackground(props.modelValue))
const mode = computed(() => {
  const type = config.value?.type
  return !type || type === 'theme' ? 'theme' : type
})

const modeOptions = computed(() => [
  { id: 'theme', label: props.themeLabel, icon: 'i-lucide-undo-2', description: props.themeDescription },
  { id: 'solid', label: 'Solid colour', icon: 'i-lucide-square', description: 'One clean background colour' },
  { id: 'gradient', label: 'Gradient', icon: 'i-lucide-blend', description: 'Blend two colours' },
  { id: 'image', label: 'Image', icon: 'i-lucide-image', description: 'Upload or choose a photo' }
] as const)

const gradientAngles = [
  { label: '↘', value: 135, title: 'Diagonal' },
  { label: '↓', value: 180, title: 'Top to bottom' },
  { label: '→', value: 90, title: 'Left to right' },
  { label: '↗', value: 45, title: 'Diagonal up' }
]

// The pattern overlay is preserved when switching between base fills.
const pattern = computed<SurfacePatternOverlay | undefined>(() => config.value?.pattern)
const hasPattern = computed(() => Boolean(pattern.value))

function selectMode(nextMode: 'theme' | 'solid' | 'gradient' | 'image') {
  if (nextMode === mode.value) return
  const keep = pattern.value ? { pattern: pattern.value } : {}

  if (nextMode === 'theme') {
    // Keep a pattern layered over the theme base; otherwise clear the fill.
    emit('update:modelValue', pattern.value ? { type: 'theme', pattern: pattern.value } : null)
  } else if (nextMode === 'solid') {
    emit('update:modelValue', { type: 'solid', color: palette.value.background, ...keep })
  } else if (nextMode === 'gradient') {
    emit('update:modelValue', { type: 'gradient', from: palette.value.background, to: palette.value.primary, angle: 135, ...keep })
  } else {
    emit('update:modelValue', { type: 'image', url: '', fit: 'cover', position: 'center', overlayTone: 'dark', overlayOpacity: 0, ...keep })
  }
}

// Patch the base fill (never the pattern — see updatePattern).
function updateCurrent(patch: Record<string, unknown>) {
  const base = config.value
  if (!base || base.type === 'theme') return
  emit('update:modelValue', { ...base, ...patch } as SurfaceBackgroundConfig)
}

// ----- Pattern overlay (orthogonal to the base fill) -----
function setPattern(next: SurfacePatternOverlay | null) {
  const base = config.value
  if (!next) {
    // Drop the overlay; a theme base with no fill collapses back to default.
    if (!base || base.type === 'theme') { emit('update:modelValue', null); return }
    const rest = { ...base }
    delete (rest as { pattern?: unknown }).pattern
    emit('update:modelValue', rest)
    return
  }
  if (!base || base.type === 'theme') { emit('update:modelValue', { type: 'theme', pattern: next }); return }
  emit('update:modelValue', { ...base, pattern: next })
}

function togglePattern() {
  setPattern(hasPattern.value ? null : defaultPatternOverlay())
}

function updatePattern(patch: Partial<SurfacePatternOverlay>) {
  if (!pattern.value) return
  setPattern({ ...pattern.value, ...patch })
}

function patternPreviewStyle(patternUrl: string) {
  return {
    backgroundColor: palette.value.primary,
    maskImage: `url("${patternUrl}")`,
    WebkitMaskImage: `url("${patternUrl}")`
  }
}
</script>

<template>
  <div class="grid gap-5">
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="option in modeOptions"
        :key="option.id"
        type="button"
        class="min-w-0 rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
        :class="mode === option.id ? 'ring-2 ring-primary' : ''"
        @click="selectMode(option.id)"
      >
        <span class="flex items-center gap-2">
          <UIcon :name="option.icon" class="size-4 shrink-0 text-primary" />
          <span class="truncate text-sm font-semibold text-default">{{ option.label }}</span>
          <UIcon v-if="mode === option.id" name="i-lucide-check" class="ml-auto size-4 shrink-0 text-primary" />
        </span>
        <span class="mt-1 block text-xs leading-4 text-muted">{{ option.description }}</span>
      </button>
    </div>

    <template v-if="config?.type === 'solid'">
      <UFormField label="Background colour">
        <div class="grid gap-2">
          <UColorPicker :model-value="config.color" @update:model-value="updateCurrent({ color: $event })" />
          <UInput :model-value="config.color" placeholder="#FAFDF9" @update:model-value="updateCurrent({ color: String($event) })" />
        </div>
      </UFormField>
    </template>

    <template v-else-if="config?.type === 'gradient'">
      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Start colour">
          <div class="grid gap-2">
            <UColorPicker :model-value="config.from" @update:model-value="updateCurrent({ from: $event })" />
            <UInput :model-value="config.from" @update:model-value="updateCurrent({ from: String($event) })" />
          </div>
        </UFormField>
        <UFormField label="End colour">
          <div class="grid gap-2">
            <UColorPicker :model-value="config.to" @update:model-value="updateCurrent({ to: $event })" />
            <UInput :model-value="config.to" @update:model-value="updateCurrent({ to: String($event) })" />
          </div>
        </UFormField>
      </div>

      <UFormField label="Direction">
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="angle in gradientAngles"
            :key="angle.value"
            type="button"
            class="rounded-md border border-muted bg-default py-2 text-base text-default transition hover:border-primary"
            :class="config.angle === angle.value ? 'ring-2 ring-primary' : ''"
            :title="angle.title"
            @click="updateCurrent({ angle: angle.value })"
          >
            {{ angle.label }}
          </button>
        </div>
      </UFormField>
    </template>

    <template v-else-if="config?.type === 'image'">
      <ImagePicker
        :model-value="config.url"
        :tenant-id="tenantId"
        @update:model-value="updateCurrent({ url: $event })"
      />

      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Image fit">
          <USelect
            :model-value="config.fit"
            :items="[
              { label: 'Cover area', value: 'cover' },
              { label: 'Fit whole image', value: 'contain' },
              { label: 'Repeat / tile', value: 'tile' }
            ]"
            value-key="value"
            label-key="label"
            class="w-full"
            @update:model-value="updateCurrent({ fit: $event })"
          />
        </UFormField>

        <UFormField label="Position">
          <USelect
            :model-value="config.position"
            :items="[
              { label: 'Center', value: 'center' },
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' },
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' }
            ]"
            value-key="value"
            label-key="label"
            class="w-full"
            @update:model-value="updateCurrent({ position: $event })"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Darken / lighten">
          <USelect
            :model-value="config.overlayTone"
            :items="[
              { label: 'Darken', value: 'dark' },
              { label: 'Lighten', value: 'light' }
            ]"
            value-key="value"
            label-key="label"
            class="w-full"
            @update:model-value="updateCurrent({ overlayTone: $event })"
          />
        </UFormField>

        <UFormField :label="`Overlay strength ${Math.round(config.overlayOpacity * 100)}%`">
          <input
            :value="config.overlayOpacity"
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            class="mt-2 w-full accent-[var(--ui-primary)]"
            @input="updateCurrent({ overlayOpacity: Number(($event.target as HTMLInputElement).value) })"
          >
        </UFormField>
      </div>
      <p class="text-xs leading-4 text-muted">
        Add a dark overlay if you place light text over a busy photo — it keeps everything readable.
      </p>
    </template>

    <!-- ===== Pattern overlay — layers on top of ANY base above ===== -->
    <div class="rounded-md border border-muted">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 p-3 text-left"
        @click="togglePattern"
      >
        <span class="flex min-w-0 items-center gap-2">
          <UIcon name="i-lucide-sparkles" class="size-4 shrink-0 text-primary" />
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-default">Pattern overlay</span>
            <span class="block text-xs leading-4 text-muted">Islamic art &amp; nature motifs over the background</span>
          </span>
        </span>
        <USwitch :model-value="hasPattern" @update:model-value="togglePattern" @click.stop />
      </button>

      <div v-if="config?.pattern" class="grid gap-4 border-t border-muted p-3">
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in pageBackgroundPatterns"
            :key="preset.id"
            type="button"
            class="overflow-hidden rounded-md border border-muted bg-default text-left transition hover:border-primary"
            :class="config.pattern.presetId === preset.id ? 'ring-2 ring-primary' : ''"
            @click="updatePattern({ presetId: preset.id })"
          >
            <span class="relative block h-16 overflow-hidden bg-elevated">
              <span
                class="absolute inset-0 opacity-40 [mask-position:center] [mask-repeat:repeat] [mask-size:44px]"
                :style="patternPreviewStyle(preset.url)"
              />
            </span>
            <span class="block p-2">
              <span class="block truncate text-xs font-semibold text-default">{{ preset.name }}</span>
            </span>
          </button>
        </div>

        <UFormField label="Motif colour">
          <div class="grid gap-2">
            <UColorPicker :model-value="config.pattern.color || palette.primary" @update:model-value="updatePattern({ color: String($event) })" />
            <UInput :model-value="config.pattern.color || palette.primary" @update:model-value="updatePattern({ color: String($event) })" />
          </div>
        </UFormField>

        <UFormField :label="`Pattern size ${config.pattern.scale}px`">
          <input
            :value="config.pattern.scale"
            type="range"
            min="32"
            max="180"
            step="4"
            class="w-full accent-[var(--ui-primary)]"
            @input="updatePattern({ scale: Number(($event.target as HTMLInputElement).value) })"
          >
        </UFormField>

        <UFormField :label="`Motif strength ${Math.round(config.pattern.intensity * 100)}%`">
          <input
            :value="config.pattern.intensity"
            type="range"
            min="0.03"
            max="0.5"
            step="0.01"
            class="w-full accent-[var(--ui-primary)]"
            @input="updatePattern({ intensity: Number(($event.target as HTMLInputElement).value) })"
          >
        </UFormField>
      </div>
    </div>

    <UButton
      v-if="mode !== 'theme' || hasPattern"
      color="neutral"
      variant="outline"
      icon="i-lucide-rotate-ccw"
      :label="`Reset to ${themeLabel.toLowerCase()}`"
      block
      @click="emit('update:modelValue', null)"
    />
  </div>
</template>
