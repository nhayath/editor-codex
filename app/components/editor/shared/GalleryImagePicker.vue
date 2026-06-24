<script setup lang="ts">
import Draggable from 'vuedraggable'
import { parsePipeRows } from '~~/utils/widget-content'

interface GalleryImage {
  src: string
  alt: string
  caption: string
}

interface MediaAsset {
  id: string
  url: string
  alt?: string | null
}

interface UploadDraft {
  file: File
  previewUrl: string
  alt: string
  caption: string
  error: string
}

const model = defineModel<string>({ default: '' })

const props = defineProps<{
  tenantId?: string
}>()

const editOpen = ref(false)
const editingIndex = ref<number | null>(null)
const editDraft = reactive({ alt: '', caption: '' })
const editError = ref('')

const addOpen = ref(false)
const addMode = ref<'upload' | 'library'>('upload')
const selectedFiles = ref<File[] | null>(null)
const uploadDrafts = ref<UploadDraft[]>([])
const uploading = ref(false)
const loadingMedia = ref(false)
const media = ref<MediaAsset[]>([])
const selectedMediaId = ref<string | null>(null)
const mediaDraft = reactive({ alt: '', caption: '' })
const mediaError = ref('')
const addError = ref('')

const addTabs = [
  { label: 'Upload', icon: 'i-lucide-upload', value: 'upload' },
  { label: 'Media library', icon: 'i-lucide-library', value: 'library' }
]

const images = computed<GalleryImage[]>({
  get: () => parsePipeRows(model.value, 3)
    .map(row => ({
      src: row[0] ?? '',
      alt: row[1] ?? '',
      caption: row[2] ?? ''
    }))
    .filter(image => !!image.src),
  set: next => {
    model.value = next
      .map(image => [image.src, image.alt, image.caption]
        .map(part => sanitisePart(part))
        .join('|')
        .replace(/\|+$/, ''))
      .join('\n')
  }
})

const availableMedia = computed(() => {
  const selectedUrls = new Set(images.value.map(image => image.src))
  return media.value.filter(asset => !selectedUrls.has(asset.url))
})

const selectedMedia = computed(() => {
  return availableMedia.value.find(asset => asset.id === selectedMediaId.value) ?? null
})

function sanitisePart(value: string) {
  return value.replace(/[\r\n|]+/g, ' ').trim()
}

function openEdit(index: number) {
  const image = images.value[index]
  if (!image) return

  editingIndex.value = index
  editDraft.alt = image.alt
  editDraft.caption = image.caption
  editError.value = ''
  editOpen.value = true
}

function saveEdit() {
  if (editingIndex.value === null) return
  if (!editDraft.alt.trim()) {
    editError.value = 'Alt text is required.'
    return
  }

  const next = images.value.map(image => ({ ...image }))
  const image = next[editingIndex.value]
  if (!image) return
  image.alt = editDraft.alt
  image.caption = editDraft.caption
  images.value = next
  editOpen.value = false
}

function removeEditedImage() {
  if (editingIndex.value === null) return
  images.value = images.value.filter((_, index) => index !== editingIndex.value)
  editOpen.value = false
}

function revokeUploadPreviews() {
  for (const draft of uploadDrafts.value) {
    URL.revokeObjectURL(draft.previewUrl)
  }
  uploadDrafts.value = []
}

function clearUploadDrafts() {
  revokeUploadPreviews()
  selectedFiles.value = null
}

function resetAddModal() {
  clearUploadDrafts()
  addMode.value = 'upload'
  selectedMediaId.value = null
  mediaDraft.alt = ''
  mediaDraft.caption = ''
  mediaError.value = ''
  addError.value = ''
}

function openAdd() {
  resetAddModal()
  addOpen.value = true
  loadMedia()
}

function selectMedia(asset: MediaAsset) {
  selectedMediaId.value = asset.id
  mediaDraft.alt = asset.alt ?? ''
  mediaDraft.caption = ''
  mediaError.value = ''
}

async function loadMedia() {
  if (!props.tenantId) return

  loadingMedia.value = true
  addError.value = ''
  try {
    const endpoint: string = `/api/media/${props.tenantId}`
    media.value = await $fetch<MediaAsset[]>(endpoint)
  } catch {
    addError.value = 'The tenant media library could not be loaded.'
  } finally {
    loadingMedia.value = false
  }
}

function prepareFiles(files: File[] | null | undefined) {
  revokeUploadPreviews()
  if (!files?.length) return

  const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 8 * 1024 * 1024)
  if (validFiles.length !== files.length) {
    addError.value = 'Some files were skipped. Images must be 8 MB or smaller.'
  } else {
    addError.value = ''
  }

  uploadDrafts.value = validFiles.map(file => ({
    file,
    previewUrl: URL.createObjectURL(file),
    alt: '',
    caption: '',
    error: ''
  }))
}

async function addUploads() {
  if (!uploadDrafts.value.length || !props.tenantId || uploading.value) return

  let hasErrors = false
  for (const draft of uploadDrafts.value) {
    draft.error = draft.alt.trim() ? '' : 'Alt text is required.'
    hasErrors ||= !!draft.error
  }
  if (hasErrors) return

  uploading.value = true
  addError.value = ''
  try {
    const uploaded = await Promise.all(uploadDrafts.value.map(async (draft) => {
      const body = new FormData()
      body.append('tenantId', props.tenantId!)
      body.append('file', draft.file)
      body.append('alt', draft.alt.trim())

      const asset = await $fetch<MediaAsset>('/api/media/upload', {
        method: 'POST',
        body
      })

      return {
        src: asset.url,
        alt: draft.alt,
        caption: draft.caption
      }
    }))

    images.value = [...images.value, ...uploaded]
    addOpen.value = false
    resetAddModal()
    await loadMedia()
  } catch {
    addError.value = 'One or more images could not be uploaded. Please try again.'
  } finally {
    uploading.value = false
  }
}

function addLibraryImage() {
  if (!selectedMedia.value) {
    mediaError.value = 'Select an image first.'
    return
  }
  if (!mediaDraft.alt.trim()) {
    mediaError.value = 'Alt text is required.'
    return
  }

  images.value = [
    ...images.value,
    {
      src: selectedMedia.value.url,
      alt: mediaDraft.alt,
      caption: mediaDraft.caption
    }
  ]
  addOpen.value = false
  resetAddModal()
}

watch(selectedFiles, files => prepareFiles(files))
watch(() => props.tenantId, loadMedia)
onMounted(loadMedia)
onBeforeUnmount(clearUploadDrafts)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <Draggable
      v-if="images.length"
      v-model="images"
      item-key="src"
      tag="div"
      class="grid grid-cols-4 gap-2"
      ghost-class="opacity-40"
      :animation="160"
    >
      <template #item="{ element, index }">
        <button
          type="button"
          class="group relative aspect-square overflow-hidden rounded-md border border-muted bg-muted transition hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
          :aria-label="`Edit image ${index + 1}: ${element.alt || 'No alt text'}`"
          @click="openEdit(index)"
        >
          <img
            :src="element.src"
            :alt="element.alt"
            class="size-full object-cover"
          >
          <span class="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100 group-focus-visible:bg-black/35 group-focus-visible:opacity-100">
            <UIcon name="i-lucide-pencil" class="size-4" />
          </span>
          <UIcon
            name="i-lucide-grip"
            class="absolute bottom-1 right-1 size-3.5 text-white drop-shadow"
          />
        </button>
      </template>
    </Draggable>

    <p
      v-else
      class="rounded-lg border border-dashed border-muted p-3 text-center text-xs text-muted"
    >
      No gallery images yet.
    </p>

    <UButton
      label="Add Images"
      icon="i-lucide-plus"
      color="neutral"
      variant="soft"
      block
      :disabled="!tenantId"
      @click="openAdd"
    />

    <UModal
      v-model:open="editOpen"
      title="Edit image"
      description="Update the image description and optional caption."
      :ui="{ content: 'max-w-md', footer: 'justify-between' }"
    >
      <template #body>
        <div class="grid gap-4">
          <img
            v-if="editingIndex !== null && images[editingIndex]"
            :src="images[editingIndex]?.src"
            :alt="editDraft.alt"
            class="aspect-video w-full rounded-lg bg-muted object-cover"
          >
          <UFormField
            label="Alt text"
            description="Describe the image for visitors using assistive technology."
            required
            :error="editError || undefined"
          >
            <UInput
              v-model="editDraft.alt"
              placeholder="Describe what is shown"
              @input="editError = ''"
            />
          </UFormField>
          <UFormField
            label="Caption"
            hint="Optional"
          >
            <UInput
              v-model="editDraft.caption"
              placeholder="Add a visible caption"
            />
          </UFormField>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton
          label="Remove"
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          @click="removeEditedImage"
        />
        <div class="flex items-center gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            @click="close"
          />
          <UButton
            label="Save changes"
            @click="saveEdit"
          />
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="addOpen"
      title="Add images"
      description="Upload new images or choose from this tenant's media library."
      scrollable
      :ui="{ content: 'max-w-2xl', footer: 'justify-end' }"
      @after:leave="resetAddModal"
    >
      <template #body>
        <div class="grid gap-5">
          <UTabs
            v-model="addMode"
            :items="addTabs"
            :content="false"
            class="w-full"
          />

          <div
            v-if="addMode === 'upload'"
            class="grid gap-4"
          >
            <UFileUpload
              v-model="selectedFiles"
              accept="image/*"
              multiple
              reset
              :preview="false"
              label="Choose images"
              description="Select one or more images, up to 8 MB each."
              icon="i-lucide-images"
              :disabled="uploading || !tenantId"
            />

            <div
              v-if="uploadDrafts.length"
              class="grid gap-4"
            >
              <article
                v-for="(draft, index) in uploadDrafts"
                :key="`${draft.file.name}-${draft.file.size}-${index}`"
                class="grid gap-4 rounded-lg border border-muted p-3 sm:grid-cols-[8rem_1fr]"
              >
                <img
                  :src="draft.previewUrl"
                  :alt="draft.alt"
                  class="aspect-square w-full rounded-md bg-muted object-cover"
                >
                <div class="grid content-start gap-3">
                  <p class="truncate text-sm font-medium text-default">
                    {{ draft.file.name }}
                  </p>
                  <UFormField
                    label="Alt text"
                    required
                    :error="draft.error || undefined"
                  >
                    <UInput
                      v-model="draft.alt"
                      placeholder="Describe what is shown"
                      @input="draft.error = ''"
                    />
                  </UFormField>
                  <UFormField
                    label="Caption"
                    hint="Optional"
                  >
                    <UInput
                      v-model="draft.caption"
                      placeholder="Add a visible caption"
                    />
                  </UFormField>
                </div>
              </article>
            </div>
          </div>

          <div
            v-else
            class="grid gap-4"
          >
            <div
              v-if="availableMedia.length"
              class="grid grid-cols-4 gap-2 sm:grid-cols-6"
            >
              <button
                v-for="asset in availableMedia"
                :key="asset.id"
                type="button"
                class="relative aspect-square overflow-hidden rounded-md border bg-muted transition focus-visible:outline-2 focus-visible:outline-primary"
                :class="selectedMediaId === asset.id ? 'border-primary ring-2 ring-primary' : 'border-muted hover:border-primary'"
                :aria-label="`Select ${asset.alt || 'image'}`"
                @click="selectMedia(asset)"
              >
                <img
                  :src="asset.url"
                  :alt="asset.alt || ''"
                  class="size-full object-cover"
                >
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
              No other tenant images are available.
            </p>

            <div
              v-if="selectedMedia"
              class="grid gap-4 rounded-lg border border-muted p-3 sm:grid-cols-[8rem_1fr]"
            >
              <img
                :src="selectedMedia.url"
                :alt="mediaDraft.alt"
                class="aspect-square w-full rounded-md bg-muted object-cover"
              >
              <div class="grid content-start gap-3">
                <UFormField
                  label="Alt text"
                  required
                  :error="mediaError || undefined"
                >
                  <UInput
                    v-model="mediaDraft.alt"
                    placeholder="Describe what is shown"
                    @input="mediaError = ''"
                  />
                </UFormField>
                <UFormField
                  label="Caption"
                  hint="Optional"
                >
                  <UInput
                    v-model="mediaDraft.caption"
                    placeholder="Add a visible caption"
                  />
                </UFormField>
              </div>
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
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          @click="close"
        />
        <UButton
          v-if="addMode === 'upload'"
          :label="uploadDrafts.length > 1 ? `Add ${uploadDrafts.length} images` : 'Add image'"
          :loading="uploading"
          :disabled="!uploadDrafts.length"
          @click="addUploads"
        />
        <UButton
          v-else
          label="Add image"
          :loading="loadingMedia"
          :disabled="!selectedMedia"
          @click="addLibraryImage"
        />
      </template>
    </UModal>
  </div>
</template>
