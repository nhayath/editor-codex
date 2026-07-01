<script setup lang="ts">
import { colorPalettes, fontPairs } from '~~/types/theme'

type ThemePanel = 'root' | 'template' | 'palette' | 'fonts' | 'background'

const editor = useHomepageEditor()
const panelStack = ref<ThemePanel[]>(['root'])
const transitionName = ref('theme-slide-forward')

const currentPanel = computed(() => panelStack.value[panelStack.value.length - 1] ?? 'root')
const panelTitle = computed(() => {
  const titles: Record<ThemePanel, string> = {
    root: 'Theme',
    template: 'Template',
    palette: 'Palette',
    fonts: 'Fonts',
    background: 'Background'
  }

  return titles[currentPanel.value]
})

const paletteModel = computed({
  get: () => editor.draft.value?.paletteId ?? '',
  set: (value: string) => editor.setPalette(value)
})

const fontModel = computed({
  get: () => editor.draft.value?.fontPairId ?? '',
  set: (value: string) => editor.setFontPair(value)
})

const activeTemplate = computed(() => {
  return editor.availableTemplates.value.find(template => template.id === editor.draft.value?.templateId)
})

const activePalette = computed(() => {
  return colorPalettes.find(palette => palette.id === paletteModel.value)
})

const activeFontPair = computed(() => {
  return fontPairs.find(pair => pair.id === fontModel.value)
})

const backgroundModel = computed({
  get: () => editor.draft.value?.pageBackground ?? null,
  set: value => editor.setPageBackground(value)
})

const backgroundSummary = computed(() => {
  const background = migrateSurfaceBackground(backgroundModel.value)
  const suffix = background?.pattern ? ' · pattern' : ''
  if (!background || background.type === 'theme') return background?.pattern ? `Template default${suffix}` : 'Template default'
  if (background.type === 'solid') return `Solid color${suffix}`
  if (background.type === 'gradient') return `Gradient${suffix}`
  return `${background.url ? 'Custom image' : 'Choose an image'}${suffix}`
})

const backgroundPreview = computed(() => {
  return getPageBackgroundPresentation(
    backgroundModel.value,
    editor.draft.value?.paletteId,
    editor.draft.value?.customColors
  )
})

function openPanel(panel: ThemePanel) {
  transitionName.value = 'theme-slide-forward'
  panelStack.value.push(panel)
}

function goBack() {
  if (panelStack.value.length <= 1) return
  transitionName.value = 'theme-slide-back'
  panelStack.value.pop()
}
</script>

<template>
  <div class="theme-panel-shell">
    <div
      v-if="currentPanel !== 'root'"
      class="mb-4 flex items-center gap-2"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-chevron-left"
        aria-label="Back"
        @click="goBack"
      />
      <h2 class="truncate text-sm font-semibold text-default">
        {{ panelTitle }}
      </h2>
    </div>

    <Transition
      :name="transitionName"
      mode="out-in"
    >
      <section
        v-if="currentPanel === 'root'"
        key="root"
        class="grid w-full min-w-0 gap-2 overflow-hidden"
      >
        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('template')"
        >
          <UIcon
            name="i-lucide-layout-template"
            class="size-4 shrink-0 text-muted"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Template</span>
            <span class="block truncate text-xs text-muted">{{ activeTemplate?.name ?? 'Choose a template' }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('palette')"
        >
          <UIcon
            name="i-lucide-palette"
            class="size-4 shrink-0 text-muted"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Palette</span>
            <span class="block truncate text-xs text-muted">{{ activePalette?.name ?? 'Choose colors' }}</span>
          </span>
          <span
            v-if="activePalette"
            class="flex shrink-0 overflow-hidden rounded-full border border-muted"
          >
            <span
              v-for="color in [activePalette.primary, activePalette.secondary, activePalette.accent]"
              :key="color"
              class="size-4"
              :style="{ backgroundColor: color }"
            />
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('fonts')"
        >
          <UIcon
            name="i-lucide-type"
            class="size-4 shrink-0 text-muted"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Fonts</span>
            <span class="block truncate text-xs text-muted">{{ activeFontPair?.name ?? 'Choose typography' }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('background')"
        >
          <UIcon
            name="i-lucide-wallpaper"
            class="size-4 shrink-0 text-muted"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Background</span>
            <span class="block truncate text-xs text-muted">{{ backgroundSummary }}</span>
          </span>
          <span
            class="tenant-site block size-9 shrink-0 overflow-hidden rounded-md border border-muted"
            :class="backgroundPreview.className"
            :style="backgroundModel ? backgroundPreview.style : { background: 'var(--color-bg)' }"
          />
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>
      </section>

      <section
        v-else-if="currentPanel === 'template'"
        key="template"
        class="grid w-full min-w-0 gap-3 overflow-hidden"
      >
        <button
          v-for="template in editor.availableTemplates.value"
          :key="template.id"
          type="button"
          class="w-full min-w-0 overflow-hidden rounded-md border border-muted bg-default text-left transition hover:bg-muted"
          :class="editor.draft.value?.templateId === template.id ? 'ring-2 ring-primary' : ''"
          @click="editor.setTemplate(template.id)"
        >
          <img
            :src="template.thumbnail"
            :alt="template.name"
            class="aspect-[16/9] w-full object-cover"
          >
          <div class="min-w-0 p-3">
            <div class="flex min-w-0 items-center justify-between gap-3">
              <p class="truncate text-sm font-semibold text-default">
                {{ template.name }}
              </p>
              <UIcon
                v-if="editor.draft.value?.templateId === template.id"
                name="i-lucide-check"
                class="size-4 shrink-0 text-primary"
              />
            </div>
            <p class="mt-1 line-clamp-2 text-xs text-muted">
              {{ template.description }}
            </p>
          </div>
        </button>
      </section>

      <section
        v-else-if="currentPanel === 'palette'"
        key="palette"
        class="grid w-full min-w-0 gap-3 overflow-hidden"
      >
        <ColorSwatch
          v-for="palette in colorPalettes"
          :key="palette.id"
          v-model="paletteModel"
          :value="palette.id"
          :label="palette.name"
          :colors="[palette.primary, palette.secondary, palette.accent]"
        />
      </section>

      <section
        v-else-if="currentPanel === 'fonts'"
        key="fonts"
        class="grid w-full min-w-0 gap-3 overflow-hidden"
      >
        <USelect
          v-model="fontModel"
          :items="fontPairs.map(pair => ({ label: pair.name, value: pair.id }))"
          value-key="value"
          label-key="label"
        />

        <div class="grid w-full min-w-0 gap-2 overflow-hidden">
          <button
            v-for="pair in fontPairs"
            :key="pair.id"
            type="button"
            class="w-full min-w-0 overflow-hidden rounded-md border border-muted bg-default p-3 text-left hover:bg-muted"
            :class="fontModel === pair.id ? 'ring-2 ring-primary' : ''"
            @click="fontModel = pair.id"
          >
            <p class="truncate text-sm font-semibold text-default">
              {{ pair.heading }}
            </p>
            <p class="truncate text-xs text-muted">
              {{ pair.body }} body text
            </p>
          </button>
        </div>
      </section>

      <section
        v-else
        key="background"
        class="w-full min-w-0 overflow-hidden"
      >
        <BackgroundPicker
          v-model="backgroundModel"
          theme-label="Template default"
          theme-description="Use the template background"
          :tenant-id="typeof editor.tenant.value?.id === 'string' ? editor.tenant.value.id : undefined"
          :palette-id="editor.draft.value?.paletteId"
          :custom-colors="editor.draft.value?.customColors"
        />
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.theme-panel-shell {
  max-width: 100%;
  overflow: hidden;
}

.theme-slide-forward-enter-active,
.theme-slide-forward-leave-active,
.theme-slide-back-enter-active,
.theme-slide-back-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.theme-slide-forward-enter-from,
.theme-slide-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.theme-slide-forward-leave-to,
.theme-slide-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
