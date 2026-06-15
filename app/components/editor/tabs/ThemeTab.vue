<script setup lang="ts">
import { colorPalettes, fontPairs } from '~~/types/theme'

const editor = useHomepageEditor()

const paletteModel = computed({
  get: () => editor.draft.value?.paletteId ?? '',
  set: (value: string) => editor.setPalette(value)
})

const fontModel = computed({
  get: () => editor.draft.value?.fontPairId ?? '',
  set: (value: string) => editor.setFontPair(value)
})
</script>

<template>
  <div class="grid gap-6">
    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Template
        </h2>
      </div>

      <div class="grid gap-3">
        <button
          v-for="template in editor.availableTemplates.value"
          :key="template.id"
          type="button"
          class="overflow-hidden rounded-md border border-muted bg-default text-left transition hover:bg-muted"
          :class="editor.draft.value?.templateId === template.id ? 'ring-2 ring-primary' : ''"
          @click="editor.setTemplate(template.id)"
        >
          <img
            :src="template.thumbnail"
            :alt="template.name"
            class="aspect-[16/9] w-full object-cover"
          >
          <div class="p-3">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-default">
                {{ template.name }}
              </p>
              <UIcon
                v-if="editor.draft.value?.templateId === template.id"
                name="i-lucide-check"
                class="size-4 text-primary"
              />
            </div>
            <p class="mt-1 text-xs text-muted">
              {{ template.description }}
            </p>
          </div>
        </button>
      </div>
    </section>

    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Palette
        </h2>
      </div>

      <ColorSwatch
        v-for="palette in colorPalettes"
        :key="palette.id"
        v-model="paletteModel"
        :value="palette.id"
        :label="palette.name"
        :colors="[palette.primary, palette.secondary, palette.accent]"
      />
    </section>

    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Fonts
        </h2>
      </div>

      <USelect
        v-model="fontModel"
        :items="fontPairs.map(pair => ({ label: pair.name, value: pair.id }))"
        value-key="value"
        label-key="label"
      />

      <div class="grid gap-2">
        <button
          v-for="pair in fontPairs"
          :key="pair.id"
          type="button"
          class="rounded-md border border-muted bg-default p-3 text-left hover:bg-muted"
          :class="fontModel === pair.id ? 'ring-2 ring-primary' : ''"
          @click="fontModel = pair.id"
        >
          <p class="text-sm font-semibold text-default">
            {{ pair.heading }}
          </p>
          <p class="text-xs text-muted">
            {{ pair.body }} body text
          </p>
        </button>
      </div>
    </section>
  </div>
</template>
