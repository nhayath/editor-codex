<script setup lang="ts">
withDefaults(defineProps<{
  content?: string
}>(), {
  content: '<h2>Welcome</h2><p>Edit this section with the rich text editor.</p>'
})
</script>

<template>
  <div class="rich-content mx-auto max-w-3xl rounded-lg bg-[var(--color-surface)] p-6 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]" v-html="content" />
</template>
