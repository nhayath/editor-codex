<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  body?: string
  align?: string
}>(), {
  title: 'Text block',
  body: 'Add a focused message for visitors.',
  align: 'left'
})
</script>

<template>
  <div
    class="mx-auto max-w-3xl"
    :class="align === 'center' ? 'text-center' : ''"
  >
    <h2 class="tenant-heading text-3xl font-bold text-[var(--color-text)]">
      {{ title }}
    </h2>
    <p class="mt-4 whitespace-pre-line text-lg leading-8 text-[var(--color-text-muted)]">
      {{ body }}
    </p>
  </div>
</template>
