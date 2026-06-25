<script setup lang="ts">
import type { PageBackgroundConfig } from '~~/types/template'
import { getPalette } from '~/composables/useTheme'

const props = defineProps<{
  modelValue?: PageBackgroundConfig | null
  tenantId?: string
  paletteId?: string
  customColors?: Record<string, string> | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PageBackgroundConfig | null]
}>()

const palette = computed(() => ({
  ...getPalette(props.paletteId),
  ...(props.customColors ?? {})
}))

const mode = computed(() => props.modelValue?.type ?? 'default')

const modeOptions = [
  { id: 'default', label: 'Default', icon: 'i-lucide-undo-2', description: 'Use the template background' },
  { id: 'solid', label: 'Solid', icon: 'i-lucide-square', description: 'One clean background color' },
  { id: 'gradient', label: 'Gradient', icon: 'i-lucide-blend', description: 'Blend two colors' },
  { id: 'image', label: 'Image', icon: 'i-lucide-image', description: 'Upload or choose an image' },
  { id: 'pattern', label: 'Pattern', icon: 'i-lucide-sparkles', description: 'Islamic art and nature motifs' }
] as const

const gradientAngles = [
  { label: '↘', value: 135, title: 'Diagonal' },
  { label: '↓', value: 180, title: 'Top to bottom' },
  { label: '→', value: 90, title: 'Left to right' },
  { label: '↗', value: 45, title: 'Diagonal up' }
]

function selectMode(nextMode: typeof modeOptions[number]['id']) {
  if (nextMode === 'default') {
    emit('update:modelValue', null)
    return
  }

  if (nextMode === props.modelValue?.type) return

  if (nextMode === 'solid') {
    emit('update:modelValue', {
      type: 'solid',
      color: palette.value.background
    })
  } else if (nextMode === 'gradient') {
    emit('update:modelValue', {
      type: 'gradient',
      from: palette.value.background,
      to: palette.value.primary,
      angle: 135
    })
  } else if (nextMode === 'image') {
    emit('update:modelValue', {
      type: 'image',
      url: '',
      fit: 'cover',
      position: 'center',
      overlayTone: 'dark',
      overlayOpacity: 0
    })
  } else {
    emit('update:modelValue', {
      type: 'pattern',
      presetId: pageBackgroundPatterns[0]!.id,
      baseColor: palette.value.background,
      scale: 72,
      intensity: 0.12
    })
  }
}

function updateCurrent(patch: Record<string, unknown>) {
  if (!props.modelValue) return
  emit('update:modelValue', {
    ...props.modelValue,
    ...patch
  } as PageBackgroundConfig)
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
          <UIcon
            :name="option.icon"
            class="size-4 shrink-0 text-primary"
          />
          <span class="truncate text-sm font-semibold text-default">{{ option.label }}</span>
          <UIcon
            v-if="mode === option.id"
            name="i-lucide-check"
            class="ml-auto size-4 shrink-0 text-primary"
          />
        </span>
        <span class="mt-1 block text-xs leading-4 text-muted">{{ option.description }}</span>
      </button>
    </div>

    <template v-if="modelValue?.type === 'solid'">
      <UFormField label="Background color">
        <div class="grid gap-2">
          <UColorPicker
            :model-value="modelValue.color"
            @update:model-value="updateCurrent({ color: $event })"
          />
          <UInput
            :model-value="modelValue.color"
            placeholder="#FAFDF9"
            @update:model-value="updateCurrent({ color: String($event) })"
          />
        </div>
      </UFormField>
    </template>

    <template v-else-if="modelValue?.type === 'gradient'">
      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Start color">
          <div class="grid gap-2">
            <UColorPicker
              :model-value="modelValue.from"
              @update:model-value="updateCurrent({ from: $event })"
            />
            <UInput
              :model-value="modelValue.from"
              @update:model-value="updateCurrent({ from: String($event) })"
            />
          </div>
        </UFormField>
        <UFormField label="End color">
          <div class="grid gap-2">
            <UColorPicker
              :model-value="modelValue.to"
              @update:model-value="updateCurrent({ to: $event })"
            />
            <UInput
              :model-value="modelValue.to"
              @update:model-value="updateCurrent({ to: String($event) })"
            />
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

      <UFormField label="Custom angle">
        <UInput
          :model-value="modelValue.angle"
          type="number"
          min="0"
          max="360"
          @update:model-value="updateCurrent({ angle: Number($event) })"
        />
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
              { label: 'Cover page', value: 'cover' },
              { label: 'Contain image', value: 'contain' },
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
        <UFormField label="Overlay tone">
          <USelect
            :model-value="modelValue.overlayTone"
            :items="[
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' }
            ]"
            value-key="value"
            label-key="label"
            class="w-full"
            @update:model-value="updateCurrent({ overlayTone: $event })"
          />
        </UFormField>

        <UFormField :label="`Overlay ${Math.round(modelValue.overlayOpacity * 100)}%`">
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
          <span
            class="relative block h-20 overflow-hidden"
            :style="{ backgroundColor: modelValue.baseColor }"
          >
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

      <UFormField label="Base color">
        <div class="grid gap-2">
          <UColorPicker
            :model-value="modelValue.baseColor"
            @update:model-value="updateCurrent({ baseColor: $event })"
          />
          <UInput
            :model-value="modelValue.baseColor"
            @update:model-value="updateCurrent({ baseColor: String($event) })"
          />
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

      <UFormField :label="`Motif intensity ${Math.round(modelValue.intensity * 100)}%`">
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
      v-if="modelValue"
      color="neutral"
      variant="outline"
      icon="i-lucide-rotate-ccw"
      label="Reset to template default"
      block
      @click="emit('update:modelValue', null)"
    />
  </div>
</template>
