<script setup lang="ts">
definePageMeta({ layout: 'editor' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
</script>

<template>
  <EditorStudio :slug="slug" />
</template>
