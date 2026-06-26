<script setup lang="ts">
import Draggable from 'vuedraggable'
import { parsePipeRows } from '~~/utils/widget-content'
import { pageBackgroundPatterns } from '~/composables/usePageBackground'

// Feature slides serialise to the 10-column pipe format the carousel widget
// parses: panel|eyebrow|title|arabic|translation|reference|link|button|bg|tint
interface FeatureSlide {
  _k: string
  panel: string
  eyebrow: string
  title: string
  arabic: string
  translation: string
  reference: string
  link: string
  buttonLabel: string
  bg: string
  tint: string
}

interface MediaAsset {
  id: string
  url: string
  alt?: string | null
}

const model = defineModel<string>({ default: '' })

const props = defineProps<{
  tenantId?: string
}>()

const panelOptions = [
  { label: 'Prayer countdown', value: 'prayer' },
  { label: 'Donation box', value: 'donation' },
  { label: 'Latest event', value: 'events' },
  { label: 'Text only', value: 'none' }
]
const panelLabels: Record<string, string> = Object.fromEntries(panelOptions.map(o => [o.value, o.label]))

const tintOptions = [
  { label: 'Auto (cycle)', value: '' },
  { label: 'Deep primary', value: 'primary' },
  { label: 'Gold', value: 'gold' },
  { label: 'Ink', value: 'ink' }
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

const slides = computed<FeatureSlide[]>({
  get: () => parsePipeRows(model.value, 10).map(row => ({
    _k: uid(),
    panel: (row[0] || 'none').toLowerCase(),
    eyebrow: row[1] ?? '',
    title: row[2] ?? '',
    arabic: row[3] ?? '',
    translation: row[4] ?? '',
    reference: row[5] ?? '',
    link: row[6] ?? '',
    buttonLabel: row[7] ?? '',
    bg: row[8] ?? '',
    tint: row[9] ?? ''
  })),
  set: (next) => {
    model.value = next
      .map(s => [s.panel, s.eyebrow, s.title, s.arabic, s.translation, s.reference, s.link, s.buttonLabel, s.bg, s.tint]
        .map(part => sanitisePart(String(part ?? '')))
        .join('|')
        .replace(/\|+$/, ''))
      .join('\n')
  }
})

function sanitisePart(value: string) {
  return value.replace(/[\r\n|]+/g, ' ').trim()
}

/* ---------------------------------------------------------- background art */
function patternUrl(id: string) {
  return pageBackgroundPatterns.find(p => p.id === id)?.url ?? ''
}
function patternMaskStyle(url: string) {
  return {
    WebkitMaskImage: `url("${url}")`,
    maskImage: `url("${url}")`,
    WebkitMaskSize: '44px',
    maskSize: '44px',
    WebkitMaskRepeat: 'repeat',
    maskRepeat: 'repeat'
  }
}
function slideThumb(slide: FeatureSlide) {
  if (slide.bg.startsWith('image:')) return { kind: 'image', value: slide.bg.slice(6) }
  if (slide.bg.startsWith('pattern:')) return { kind: 'pattern', value: patternUrl(slide.bg.slice(8)) }
  return { kind: 'auto', value: '' }
}

/* --------------------------------------------------------------- edit/add */
const open = ref(false)
const editingKey = ref<string | null>(null) // null = adding a new slide
const draft = reactive({
  panel: 'prayer',
  eyebrow: '',
  title: '',
  arabic: '',
  translation: '',
  reference: '',
  link: '',
  buttonLabel: '',
  bgMode: 'auto' as 'auto' | 'pattern' | 'image',
  patternId: '',
  imageUrl: '',
  tint: ''
})
const error = ref('')

// image source within the editor
const imageTab = ref<'upload' | 'library'>('upload')
const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const media = ref<MediaAsset[]>([])
const loadingMedia = ref(false)
const uploading = ref(false)
const selectedMediaId = ref<string | null>(null)

const imageTabs = [
  { label: 'Upload', icon: 'i-lucide-upload', value: 'upload' },
  { label: 'Media library', icon: 'i-lucide-library', value: 'library' }
]

function decodeBg(bg: string) {
  if (bg.startsWith('image:')) return { bgMode: 'image' as const, patternId: '', imageUrl: bg.slice(6) }
  if (bg.startsWith('pattern:')) return { bgMode: 'pattern' as const, patternId: bg.slice(8), imageUrl: '' }
  return { bgMode: 'auto' as const, patternId: '', imageUrl: '' }
}
function encodeBg() {
  if (draft.bgMode === 'image') return draft.imageUrl ? `image:${draft.imageUrl}` : ''
  if (draft.bgMode === 'pattern') return draft.patternId ? `pattern:${draft.patternId}` : ''
  return ''
}

function resetImageState() {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = ''
  imageFile.value = null
  selectedMediaId.value = null
  imageTab.value = 'upload'
}

function openAdd() {
  editingKey.value = null
  Object.assign(draft, {
    panel: 'prayer', eyebrow: '', title: '', arabic: '', translation: '',
    reference: '', link: '', buttonLabel: '', bgMode: 'auto', patternId: '', imageUrl: '', tint: ''
  })
  error.value = ''
  resetImageState()
  open.value = true
  loadMedia()
}

function openEdit(slide: FeatureSlide) {
  editingKey.value = slide._k
  Object.assign(draft, {
    panel: slide.panel, eyebrow: slide.eyebrow, title: slide.title, arabic: slide.arabic,
    translation: slide.translation, reference: slide.reference, link: slide.link,
    buttonLabel: slide.buttonLabel, tint: slide.tint, ...decodeBg(slide.bg)
  })
  error.value = ''
  resetImageState()
  open.value = true
  loadMedia()
}

async function save() {
  if (!draft.title.trim()) {
    error.value = 'A title is required.'
    return
  }

  // Resolve a newly chosen image (upload or library) before serialising.
  if (draft.bgMode === 'image') {
    if (imageFile.value && props.tenantId) {
      uploading.value = true
      try {
        const uploaded = await uploadFile(imageFile.value, draft.title.trim())
        draft.imageUrl = uploaded.url
      } catch {
        error.value = 'The background image could not be uploaded.'
        uploading.value = false
        return
      }
      uploading.value = false
    } else if (imageTab.value === 'library' && selectedMediaId.value) {
      const asset = media.value.find(a => a.id === selectedMediaId.value)
      if (asset) draft.imageUrl = asset.url
    }
    if (!draft.imageUrl) {
      error.value = 'Choose or upload a background image, or pick a pattern instead.'
      return
    }
  }

  const next: FeatureSlide = {
    _k: editingKey.value ?? uid(),
    panel: draft.panel,
    eyebrow: draft.eyebrow,
    title: draft.title,
    arabic: draft.arabic,
    translation: draft.translation,
    reference: draft.reference,
    link: draft.link,
    buttonLabel: draft.buttonLabel,
    bg: encodeBg(),
    tint: draft.tint
  }

  const list = slides.value.map(s => ({ ...s }))
  if (editingKey.value === null) {
    list.push(next)
  } else {
    const idx = list.findIndex(s => s._k === editingKey.value)
    if (idx >= 0) list[idx] = next
  }
  slides.value = list
  open.value = false
}

function removeSlide() {
  if (editingKey.value === null) return
  slides.value = slides.value.filter(s => s._k !== editingKey.value)
  open.value = false
}

async function loadMedia() {
  if (!props.tenantId) return
  loadingMedia.value = true
  try {
    media.value = await $fetch<MediaAsset[]>(`/api/media/${props.tenantId}`)
  } catch {
    /* non-fatal — patterns still work without the library */
  } finally {
    loadingMedia.value = false
  }
}

async function uploadFile(file: File, alt: string) {
  const body = new FormData()
  body.append('tenantId', props.tenantId!)
  body.append('file', file)
  body.append('alt', alt)
  return $fetch<MediaAsset>('/api/media/upload', { method: 'POST', body })
}

watch(imageFile, (file) => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = file ? URL.createObjectURL(file) : ''
})

onBeforeUnmount(() => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
})
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <Draggable
      v-if="slides.length"
      v-model="slides"
      item-key="_k"
      tag="div"
      class="grid gap-2"
      handle=".slide-handle"
      ghost-class="opacity-40"
      :animation="160"
    >
      <template #item="{ element }">
        <div class="flex items-center gap-3 rounded-md border border-muted bg-default p-2 transition hover:border-primary">
          <UIcon name="i-lucide-grip-vertical" class="slide-handle size-4 shrink-0 cursor-grab text-muted" />
          <!-- thumbnail: image, pattern swatch, or auto -->
          <div class="relative size-12 shrink-0 overflow-hidden rounded bg-[#13233b]">
            <img
              v-if="slideThumb(element).kind === 'image'"
              :src="slideThumb(element).value"
              alt=""
              class="size-full object-cover"
            >
            <div
              v-else-if="slideThumb(element).kind === 'pattern'"
              class="absolute inset-0 bg-white/30"
              :style="patternMaskStyle(slideThumb(element).value)"
            />
            <div v-else class="grid size-full place-items-center text-[9px] font-semibold uppercase tracking-wide text-white/55">
              Auto
            </div>
          </div>
          <button
            type="button"
            class="grid min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="`Edit slide: ${element.title || 'Untitled'}`"
            @click="openEdit(element)"
          >
            <span class="truncate text-sm font-medium text-default">{{ element.title || 'Untitled slide' }}</span>
            <span class="truncate text-xs text-muted">{{ panelLabels[element.panel] || 'Text only' }}</span>
          </button>
          <UIcon name="i-lucide-pencil" class="size-4 shrink-0 text-muted" />
        </div>
      </template>
    </Draggable>

    <p
      v-else
      class="rounded-lg border border-dashed border-muted p-3 text-center text-xs text-muted"
    >
      No slides yet.
    </p>

    <UButton
      label="Add a slide"
      icon="i-lucide-plus"
      color="neutral"
      variant="soft"
      block
      @click="openAdd"
    />

    <UModal
      v-model:open="open"
      :title="editingKey === null ? 'Add a slide' : 'Edit slide'"
      description="Set the panel type, the ayah / message, and the slide background."
      scrollable
      :ui="{ content: 'max-w-lg', footer: 'justify-between' }"
    >
      <template #body>
        <div class="grid gap-4">
          <UFormField label="Panel" hint="What shows on the right">
            <USelect v-model="draft.panel" :items="panelOptions" value-key="value" label-key="label" class="w-full" />
          </UFormField>

          <div class="grid gap-3 sm:grid-cols-2">
            <UFormField label="Eyebrow" hint="Optional">
              <UInput v-model="draft.eyebrow" placeholder="The weight of salah" />
            </UFormField>
            <UFormField label="Title" required :error="error || undefined">
              <UInput v-model="draft.title" placeholder="Anchor your day in prayer" @input="error = ''" />
            </UFormField>
          </div>

          <UFormField label="Arabic (ayah)" hint="Optional — rendered right-to-left">
            <UInput v-model="draft.arabic" dir="rtl" lang="ar" placeholder="آية" />
          </UFormField>
          <UFormField label="Translation" hint="Optional">
            <UTextarea v-model="draft.translation" autoresize :maxrows="3" placeholder="English translation" />
          </UFormField>
          <div class="grid gap-3 sm:grid-cols-2">
            <UFormField label="Reference" hint="Optional">
              <UInput v-model="draft.reference" placeholder="Qur'an 29:45" />
            </UFormField>
            <UFormField label="Link" hint="Optional">
              <UInput v-model="draft.link" placeholder="#prayer-times" />
            </UFormField>
          </div>
          <UFormField label="Button label" hint="Optional">
            <UInput v-model="draft.buttonLabel" placeholder="View timetable" />
          </UFormField>

          <!-- Background -->
          <div class="grid gap-3 border-t border-muted pt-4">
            <p class="text-sm font-semibold text-default">Background</p>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="mode in (['auto','pattern','image'] as const)"
                :key="mode"
                size="xs"
                :color="draft.bgMode === mode ? 'primary' : 'neutral'"
                :variant="draft.bgMode === mode ? 'solid' : 'outline'"
                class="capitalize"
                :label="mode"
                @click="draft.bgMode = mode"
              />
            </div>

            <p v-if="draft.bgMode === 'auto'" class="text-xs text-muted">
              A pattern and tint are chosen automatically based on the slide's position.
            </p>

            <div v-else-if="draft.bgMode === 'pattern'" class="grid grid-cols-3 gap-2 sm:grid-cols-6">
              <button
                v-for="p in pageBackgroundPatterns"
                :key="p.id"
                type="button"
                class="relative aspect-square overflow-hidden rounded-md bg-[#13233b] transition focus-visible:outline-2 focus-visible:outline-primary"
                :class="draft.patternId === p.id ? 'ring-2 ring-primary' : 'ring-1 ring-muted hover:ring-primary'"
                :title="p.name"
                :aria-label="p.name"
                @click="draft.patternId = p.id"
              >
                <div class="absolute inset-0 bg-white/30" :style="patternMaskStyle(p.url)" />
                <UIcon
                  v-if="draft.patternId === p.id"
                  name="i-lucide-check"
                  class="absolute right-1 top-1 size-4 rounded-full bg-primary p-0.5 text-inverted"
                />
              </button>
            </div>

            <div v-else class="grid gap-3">
              <UTabs v-model="imageTab" :items="imageTabs" :content="false" class="w-full" />
              <div v-if="imageTab === 'upload'" class="grid gap-3">
                <UFileUpload
                  v-model="imageFile"
                  accept="image/*"
                  reset
                  :preview="false"
                  label="Choose an image"
                  description="Used as the slide background (a dark overlay is added for legibility)."
                  icon="i-lucide-image-up"
                  :disabled="uploading || !tenantId"
                />
                <img
                  v-if="imagePreview || draft.imageUrl"
                  :src="imagePreview || draft.imageUrl"
                  alt=""
                  class="aspect-video w-full rounded-lg bg-muted object-cover"
                >
              </div>
              <div v-else class="grid grid-cols-4 gap-2 sm:grid-cols-6">
                <button
                  v-for="asset in media"
                  :key="asset.id"
                  type="button"
                  class="relative aspect-square overflow-hidden rounded-md border bg-muted transition focus-visible:outline-2 focus-visible:outline-primary"
                  :class="selectedMediaId === asset.id ? 'border-primary ring-2 ring-primary' : 'border-muted hover:border-primary'"
                  :aria-label="`Select ${asset.alt || 'image'}`"
                  @click="selectedMediaId = asset.id"
                >
                  <img :src="asset.url" :alt="asset.alt || ''" class="size-full object-cover">
                  <UIcon
                    v-if="selectedMediaId === asset.id"
                    name="i-lucide-check"
                    class="absolute right-1 top-1 size-5 rounded-full bg-primary p-1 text-inverted"
                  />
                </button>
              </div>
            </div>

            <UFormField v-if="draft.bgMode !== 'image'" label="Tint">
              <USelect v-model="draft.tint" :items="tintOptions" value-key="value" label-key="label" class="w-full" />
            </UFormField>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton
          v-if="editingKey !== null"
          label="Remove"
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          @click="removeSlide"
        />
        <span v-else />
        <div class="flex items-center gap-2">
          <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
          <UButton :label="editingKey === null ? 'Add slide' : 'Save changes'" :loading="uploading" @click="save" />
        </div>
      </template>
    </UModal>
  </div>
</template>
