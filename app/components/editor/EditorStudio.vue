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
      class="flex min-h-0 flex-1"
    >
      <aside class="flex w-[360px] shrink-0 flex-col border-r border-muted bg-elevated">
        <div class="border-b border-muted px-3 pt-3">
          <USkeleton class="h-10 w-full" />
        </div>

        <div class="grid gap-4 p-4">
          <USkeleton class="h-8 w-40" />
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
      </aside>

      <EditorPreview />
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
