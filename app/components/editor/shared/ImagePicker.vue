<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = defineProps<{
  tenantId?: string
}>()

const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const media = ref<Array<{ id: string, url: string, alt?: string | null }>>([])

async function loadMedia() {
  if (!props.tenantId) return
  const endpoint: string = `/api/media/${props.tenantId}`
  media.value = await $fetch<Array<{ id: string, url: string, alt?: string | null }>>(endpoint)
}

async function uploadFile(file: File | null | undefined) {
  if (!file || !props.tenantId) return

  uploading.value = true
  try {
    const body = new FormData()
    body.append('tenantId', props.tenantId)
    body.append('file', file)

    const asset = await $fetch<{ url: string }>('/api/media/upload', {
      method: 'POST',
      body
    })

    model.value = asset.url
    await loadMedia()
  } finally {
    uploading.value = false
    selectedFile.value = null
  }
}

watch(selectedFile, file => uploadFile(file))
onMounted(loadMedia)
</script>

<template>
  <div class="grid gap-3">
    <div
      v-if="model"
      class="overflow-hidden rounded-md border border-muted bg-muted"
    >
      <img
        :src="model"
        alt=""
        class="aspect-video w-full object-cover"
      >
    </div>

    <UInput
      v-model="model"
      icon="i-lucide-link"
      placeholder="/uploads/tenant/image.jpg"
    />

    <UFileUpload
      v-model="selectedFile"
      accept="image/*"
      variant="button"
      label="Upload image"
      icon="i-lucide-upload"
      :disabled="uploading || !tenantId"
      :loading="uploading"
    />

    <div
      v-if="media.length"
      class="grid grid-cols-3 gap-2"
    >
      <button
        v-for="asset in media"
        :key="asset.id"
        type="button"
        class="overflow-hidden rounded-md border border-muted bg-muted"
        :class="model === asset.url ? 'ring-2 ring-primary' : ''"
        @click="model = asset.url"
      >
        <img
          :src="asset.url"
          :alt="asset.alt || ''"
          class="aspect-square w-full object-cover"
        >
      </button>
    </div>
  </div>
</template>
