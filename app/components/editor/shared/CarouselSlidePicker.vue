<script setup lang="ts">
import Draggable from 'vuedraggable'
import { parsePipeRows } from '~~/utils/widget-content'

interface Slide {
  title: string
  subtitle: string
  src: string
  link: string
  buttonLabel: string
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

// Slides serialise to the 5-column pipe format the carousel widget parses:
// Title|Subtitle|Image URL|Link|Button label
const slides = computed<Slide[]>({
  get: () => parsePipeRows(model.value, 5)
    .map(row => ({
      title: row[0] ?? '',
      subtitle: row[1] ?? '',
      src: row[2] ?? '',
      link: row[3] ?? '',
      buttonLabel: row[4] ?? ''
    }))
    .filter(slide => !!slide.src),
  set: (next) => {
    model.value = next
      .map(slide => [slide.title, slide.subtitle, slide.src, slide.link, slide.buttonLabel]
        .map(part => sanitisePart(part))
        .join('|')
        .replace(/\|+$/, ''))
      .join('\n')
  }
})

function sanitisePart(value: string) {
  return value.replace(/[\r\n|]+/g, ' ').trim()
}

/* ------------------------------------------------------------------ edit */
const editOpen = ref(false)
const editingIndex = ref<number | null>(null)
const editDraft = reactive<Slide>({ title: '', subtitle: '', src: '', link: '', buttonLabel: '' })
const editError = ref('')
const editFile = ref<File | null>(null)
const editPreview = ref('')
const editUploading = ref(false)

function openEdit(index: number) {
  const slide = slides.value[index]
  if (!slide) return
  editingIndex.value = index
  Object.assign(editDraft, slide)
  editError.value = ''
  clearEditFile()
  editOpen.value = true
}

async function saveEdit() {
  if (editingIndex.value === null) return
  if (!editDraft.title.trim()) {
    editError.value = 'Title is required.'
    return
  }

  // A newly chosen replacement image is uploaded on save.
  if (editFile.value && props.tenantId) {
    editUploading.value = true
    try {
      const uploaded = await uploadFile(editFile.value, editDraft.title.trim())
      editDraft.src = uploaded.url
    } catch {
      editError.value = 'The replacement image could not be uploaded.'
      editUploading.value = false
      return
    }
    editUploading.value = false
  }

  if (!editDraft.src) {
    editError.value = 'An image is required.'
    return
  }

  const next = slides.value.map(slide => ({ ...slide }))
  next[editingIndex.value] = { ...editDraft }
  slides.value = next
  editOpen.value = false
}

function removeEditedSlide() {
  if (editingIndex.value === null) return
  slides.value = slides.value.filter((_, index) => index !== editingIndex.value)
  editOpen.value = false
}

function clearEditFile() {
  if (editPreview.value) URL.revokeObjectURL(editPreview.value)
  editPreview.value = ''
  editFile.value = null
}

watch(editFile, (file) => {
  if (editPreview.value) URL.revokeObjectURL(editPreview.value)
  editPreview.value = file ? URL.createObjectURL(file) : ''
})

/* ------------------------------------------------------------------- add */
const addOpen = ref(false)
const addMode = ref<'upload' | 'library'>('upload')
const addDraft = reactive({ title: '', subtitle: '', link: '', buttonLabel: '' })
const addFile = ref<File | null>(null)
const addPreview = ref('')
const selectedMediaId = ref<string | null>(null)
const media = ref<MediaAsset[]>([])
const loadingMedia = ref(false)
const uploading = ref(false)
const addError = ref('')

const addTabs = [
  { label: 'Upload', icon: 'i-lucide-upload', value: 'upload' },
  { label: 'Media library', icon: 'i-lucide-library', value: 'library' }
]

const availableMedia = computed(() => {
  const used = new Set(slides.value.map(slide => slide.src))
  return media.value.filter(asset => !used.has(asset.url))
})

const selectedMedia = computed(() => availableMedia.value.find(asset => asset.id === selectedMediaId.value) ?? null)

function resetAddModal() {
  if (addPreview.value) URL.revokeObjectURL(addPreview.value)
  addPreview.value = ''
  addFile.value = null
  addMode.value = 'upload'
  selectedMediaId.value = null
  addDraft.title = ''
  addDraft.subtitle = ''
  addDraft.link = ''
  addDraft.buttonLabel = ''
  addError.value = ''
}

function openAdd() {
  resetAddModal()
  addOpen.value = true
  loadMedia()
}

async function loadMedia() {
  if (!props.tenantId) return
  loadingMedia.value = true
  addError.value = ''
  try {
    media.value = await $fetch<MediaAsset[]>(`/api/media/${props.tenantId}`)
  } catch {
    addError.value = 'The tenant media library could not be loaded.'
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

async function confirmAdd() {
  if (!addDraft.title.trim()) {
    addError.value = 'Title is required.'
    return
  }

  let src = ''
  if (addMode.value === 'upload') {
    if (!addFile.value) {
      addError.value = 'Choose an image to upload.'
      return
    }
    if (!props.tenantId || uploading.value) return
    uploading.value = true
    addError.value = ''
    try {
      const uploaded = await uploadFile(addFile.value, addDraft.title.trim())
      src = uploaded.url
    } catch {
      addError.value = 'The image could not be uploaded. Please try again.'
      uploading.value = false
      return
    }
    uploading.value = false
  } else {
    if (!selectedMedia.value) {
      addError.value = 'Select an image first.'
      return
    }
    src = selectedMedia.value.url
  }

  slides.value = [
    ...slides.value,
    { title: addDraft.title, subtitle: addDraft.subtitle, src, link: addDraft.link, buttonLabel: addDraft.buttonLabel }
  ]
  addOpen.value = false
  resetAddModal()
  await loadMedia()
}

watch(addFile, (file) => {
  if (addPreview.value) URL.revokeObjectURL(addPreview.value)
  addPreview.value = file ? URL.createObjectURL(file) : ''
})
watch(() => props.tenantId, loadMedia)

onBeforeUnmount(() => {
  if (addPreview.value) URL.revokeObjectURL(addPreview.value)
  if (editPreview.value) URL.revokeObjectURL(editPreview.value)
})
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <Draggable
      v-if="slides.length"
      v-model="slides"
      item-key="src"
      tag="div"
      class="grid gap-2"
      handle=".slide-handle"
      ghost-class="opacity-40"
      :animation="160"
    >
      <template #item="{ element, index }">
        <div class="flex items-center gap-3 rounded-md border border-muted bg-default p-2 transition hover:border-primary">
          <UIcon name="i-lucide-grip-vertical" class="slide-handle size-4 shrink-0 cursor-grab text-muted" />
          <img
            :src="element.src"
            :alt="element.title"
            class="size-12 shrink-0 rounded bg-muted object-cover"
          >
          <button
            type="button"
            class="grid min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="`Edit slide ${index + 1}: ${element.title || 'Untitled'}`"
            @click="openEdit(index)"
          >
            <span class="truncate text-sm font-medium text-default">{{ element.title || 'Untitled slide' }}</span>
            <span class="truncate text-xs text-muted">{{ element.subtitle || 'No subtitle' }}</span>
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
      :disabled="!tenantId"
      @click="openAdd"
    />

    <!-- Edit slide -->
    <UModal
      v-model:open="editOpen"
      title="Edit slide"
      description="Update the slide content, link, and image."
      :ui="{ content: 'max-w-md', footer: 'justify-between' }"
    >
      <template #body>
        <div class="grid gap-4">
          <img
            :src="editPreview || editDraft.src"
            :alt="editDraft.title"
            class="aspect-video w-full rounded-lg bg-muted object-cover"
          >
          <UFileUpload
            v-model="editFile"
            accept="image/*"
            reset
            :preview="false"
            label="Replace image"
            description="Optional — upload to swap this slide's image."
            icon="i-lucide-image-up"
            :disabled="editUploading || !tenantId"
          />
          <UFormField label="Title" required :error="editError || undefined">
            <UInput v-model="editDraft.title" placeholder="Slide heading" @input="editError = ''" />
          </UFormField>
          <UFormField label="Subtitle" hint="Optional">
            <UInput v-model="editDraft.subtitle" placeholder="Supporting line" />
          </UFormField>
          <UFormField label="Link" hint="Optional">
            <UInput v-model="editDraft.link" type="url" placeholder="/programmes or https://…" />
          </UFormField>
          <UFormField label="Button label" hint="Optional">
            <UInput v-model="editDraft.buttonLabel" placeholder="Learn more" />
          </UFormField>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton label="Remove" icon="i-lucide-trash-2" color="error" variant="ghost" @click="removeEditedSlide" />
        <div class="flex items-center gap-2">
          <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
          <UButton label="Save changes" :loading="editUploading" @click="saveEdit" />
        </div>
      </template>
    </UModal>

    <!-- Add slide -->
    <UModal
      v-model:open="addOpen"
      title="Add a slide"
      description="Upload a new image or choose from this tenant's media library, then add the slide content."
      scrollable
      :ui="{ content: 'max-w-2xl', footer: 'justify-end' }"
      @after:leave="resetAddModal"
    >
      <template #body>
        <div class="grid gap-5">
          <UTabs v-model="addMode" :items="addTabs" :content="false" class="w-full" />

          <div v-if="addMode === 'upload'" class="grid gap-4">
            <UFileUpload
              v-model="addFile"
              accept="image/*"
              reset
              :preview="false"
              label="Choose an image"
              description="Required — up to 8 MB."
              icon="i-lucide-image-up"
              :disabled="uploading || !tenantId"
            />
            <img
              v-if="addPreview"
              :src="addPreview"
              :alt="addDraft.title"
              class="aspect-video w-full rounded-lg bg-muted object-cover"
            >
          </div>

          <div v-else class="grid gap-4">
            <div v-if="availableMedia.length" class="grid grid-cols-4 gap-2 sm:grid-cols-6">
              <button
                v-for="asset in availableMedia"
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
            <p
              v-else-if="!loadingMedia"
              class="rounded-lg border border-dashed border-muted p-4 text-center text-sm text-muted"
            >
              No other tenant images are available. Upload a new one instead.
            </p>
          </div>

          <div class="grid gap-3 border-t border-muted pt-4">
            <UFormField label="Title" required>
              <UInput v-model="addDraft.title" placeholder="Slide heading" @input="addError = ''" />
            </UFormField>
            <UFormField label="Subtitle" hint="Optional">
              <UInput v-model="addDraft.subtitle" placeholder="Supporting line" />
            </UFormField>
            <div class="grid gap-3 sm:grid-cols-2">
              <UFormField label="Link" hint="Optional">
                <UInput v-model="addDraft.link" type="url" placeholder="/programmes or https://…" />
              </UFormField>
              <UFormField label="Button label" hint="Optional">
                <UInput v-model="addDraft.buttonLabel" placeholder="Learn more" />
              </UFormField>
            </div>
          </div>

          <UAlert
            v-if="addError"
            color="error"
            variant="soft"
            icon="i-lucide-circle-alert"
            :description="addError"
          />
        </div>
      </template>

      <template #footer="{ close }">
        <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
        <UButton
          label="Add slide"
          :loading="uploading || loadingMedia"
          @click="confirmAdd"
        />
      </template>
    </UModal>
  </div>
</template>
