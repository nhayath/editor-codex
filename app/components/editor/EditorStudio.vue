<script setup lang="ts">
const props = defineProps<{
  slug: string
}>()

const editor = useHomepageEditor()

onMounted(() => {
  editor.loadConfig(props.slug)
})
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-default text-default">
    <EditorTopBar />

    <div
      v-if="editor.loading.value"
      class="grid flex-1 place-items-center"
    >
      <div class="grid w-72 gap-4">
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-32 w-full" />
      </div>
    </div>

    <div
      v-else
      class="flex min-h-0 flex-1"
    >
      <EditorSidebar />
      <EditorPreview />
    </div>

    <footer class="flex h-8 shrink-0 items-center justify-between border-t border-muted bg-default px-4 text-xs text-muted">
      <span>{{ editor.isDirty.value ? 'Unsaved changes' : 'All changes saved' }}</span>
      <span v-if="editor.lastSavedAt.value">
        Last saved {{ new Date(editor.lastSavedAt.value).toLocaleTimeString() }}
      </span>
    </footer>
  </div>
</template>
