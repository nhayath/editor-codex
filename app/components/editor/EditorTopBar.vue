<script setup lang="ts">
const editor = useHomepageEditor()
const toast = useToast()

async function save() {
  try {
    await editor.saveConfig()
    toast.add({
      title: 'Saved',
      description: 'Homepage changes were saved.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Could not save',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  }
}

defineShortcuts({
  meta_s: {
    handler: save
  }
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-muted bg-default px-4">
    <div class="flex min-w-0 items-center gap-3">
      <UButton
        to="/"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        aria-label="Back"
      />
      <div class="min-w-0">
        <p class="truncate text-sm text-muted">
          Website editor
        </p>
        <h1 class="truncate text-base font-semibold text-default">
          {{ editor.tenant.value?.name }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <DeviceToggle v-model="editor.previewDevice.value" />
      <UButton
        :loading="editor.saving.value"
        :disabled="!editor.isDirty.value"
        icon="i-lucide-save"
        label="Save"
        @click="save"
      />
    </div>
  </header>
</template>
