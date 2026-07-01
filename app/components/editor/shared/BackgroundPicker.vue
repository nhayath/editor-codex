<script setup lang="ts">
import type { SurfaceBackgroundConfig } from '~~/types/template'
import { getPalette } from '~/composables/useTheme'

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

// null and an explicit `theme` config both mean "no fill".
const mode = computed(() => {
  const type = props.modelValue?.type
  return !type || type === 'theme' ? 'theme' : type
})

const modeOptions = computed(() => [
  { id: 'theme', label: props.themeLabel, icon: 'i-lucide-undo-2', description: props.themeDescription },
  { id: 'solid', label: 'Solid colour', icon: 'i-lucide-square', description: 'One clean background colour' },
  { id: 'gradient', label: 'Gradient', icon: 'i-lucide-blend', description: 'Blend two colours' },
  { id: 'image', label: 'Image', icon: 'i-lucide-image', description: 'Upload or choose a photo' },
  { id: 'pattern', label: 'Pattern', icon: 'i-lucide-sparkles', description: 'Islamic art & nature motifs' }
] as const)

const gradientAngles = [
  { label: '↘', value: 135, title: 'Diagonal' },
  { label: '↓', value: 180, title: 'Top to bottom' },
  { label: '→', value: 90, title: 'Left to right' },
  { label: '↗', value: 45, title: 'Diagonal up' }
]

function selectMode(nextMode: 'theme' | 'solid' | 'gradient' | 'image' | 'pattern') {
  if (nextMode === 'theme') {
    emit('update:modelValue', null)
    return
  }
  if (nextMode === mode.value) return

  if (nextMode === 'solid') {
    emit('update:modelValue', { type: 'solid', color: palette.value.background })
  } else if (nextMode === 'gradient') {
    emit('update:modelValue', { type: 'gradient', from: palette.value.background, to: palette.value.primary, angle: 135 })
  } else if (nextMode === 'image') {
    emit('update:modelValue', { type: 'image', url: '', fit: 'cover', position: 'center', overlayTone: 'dark', overlayOpacity: 0 })
  } else {
    emit('update:modelValue', { type: 'pattern', presetId: pageBackgroundPatterns[0]!.id, baseColor: palette.value.background, scale: 72, intensity: 0.12 })
  }
}

function updateCurrent(patch: Record<string, unknown>) {
  if (!props.modelValue || props.modelValue.type === 'theme') return
  emit('update:modelValue', { ...props.modelValue, ...patch } as SurfaceBackgroundConfig)
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

    <template v-if="modelValue?.type === 'solid'">
      <UFormField label="Background colour">
        <div class="grid gap-2">
          <UColorPicker :model-value="modelValue.color" @update:model-value="updateCurrent({ color: $event })" />
          <UInput :model-value="modelValue.color" placeholder="#FAFDF9" @update:model-value="updateCurrent({ color: String($event) })" />
        </div>
      </UFormField>
    </template>

    <template v-else-if="modelValue?.type === 'gradient'">
      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Start colour">
          <div class="grid gap-2">
            <UColorPicker :model-value="modelValue.from" @update:model-value="updateCurrent({ from: $event })" />
            <UInput :model-value="modelValue.from" @update:model-value="updateCurrent({ from: String($event) })" />
          </div>
        </UFormField>
        <UFormField label="End colour">
          <div class="grid gap-2">
            <UColorPicker :model-value="modelValue.to" @update:model-value="updateCurrent({ to: $event })" />
            <UInput :model-value="modelValue.to" @update:model-value="updateCurrent({ to: String($event) })" />
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
            :class="modelValue.angle === angle.value ? 'ring-2 ring-primary' : ''"
            :title="angle.title"
            @click="updateCurrent({ angle: angle.value })"
          >
            {{ angle.label }}
          </button>
        </div>
      </UFormField>
    </template>

    <template v-else-if="modelValue?.type === 'image'">
      <ImagePicker
        :model-value="modelValue.url"
        :tenant-id="tenantId"
        @update:model-value="updateCurrent({ url: $event })"
      />

      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Image fit">
          <USelect
            :model-value="modelValue.fit"
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
            :model-value="modelValue.position"
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
            :model-value="modelValue.overlayTone"
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

        <UFormField :label="`Overlay strength ${Math.round(modelValue.overlayOpacity * 100)}%`">
          <input
            :value="modelValue.overlayOpacity"
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

    <template v-else-if="modelValue?.type === 'pattern'">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="pattern in pageBackgroundPatterns"
          :key="pattern.id"
          type="button"
          class="overflow-hidden rounded-md border border-muted bg-default text-left transition hover:border-primary"
          :class="modelValue.presetId === pattern.id ? 'ring-2 ring-primary' : ''"
          @click="updateCurrent({ presetId: pattern.id })"
        >
          <span class="relative block h-20 overflow-hidden" :style="{ backgroundColor: modelValue.baseColor }">
            <span
              class="absolute inset-0 bg-primary opacity-20 [mask-position:center] [mask-repeat:repeat] [mask-size:52px]"
              :style="patternPreviewStyle(pattern.url)"
            />
          </span>
          <span class="block p-2">
            <span class="block truncate text-xs font-semibold text-default">{{ pattern.name }}</span>
            <span class="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-muted">{{ pattern.description }}</span>
          </span>
        </button>
      </div>

      <UFormField label="Base colour">
        <div class="grid gap-2">
          <UColorPicker :model-value="modelValue.baseColor" @update:model-value="updateCurrent({ baseColor: $event })" />
          <UInput :model-value="modelValue.baseColor" @update:model-value="updateCurrent({ baseColor: String($event) })" />
        </div>
      </UFormField>

      <UFormField :label="`Pattern size ${modelValue.scale}px`">
        <input
          :value="modelValue.scale"
          type="range"
          min="32"
          max="180"
          step="4"
          class="w-full accent-[var(--ui-primary)]"
          @input="updateCurrent({ scale: Number(($event.target as HTMLInputElement).value) })"
        >
      </UFormField>

      <UFormField :label="`Motif strength ${Math.round(modelValue.intensity * 100)}%`">
        <input
          :value="modelValue.intensity"
          type="range"
          min="0.03"
          max="0.5"
          step="0.01"
          class="w-full accent-[var(--ui-primary)]"
          @input="updateCurrent({ intensity: Number(($event.target as HTMLInputElement).value) })"
        >
      </UFormField>
    </template>

    <UButton
      v-if="mode !== 'theme'"
      color="neutral"
      variant="outline"
      icon="i-lucide-rotate-ccw"
      :label="`Reset to ${themeLabel.toLowerCase()}`"
      block
      @click="emit('update:modelValue', null)"
    />
  </div>
</template>
