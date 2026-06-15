<script setup lang="ts">
withDefaults(defineProps<{
  imageUrl?: string
  alt?: string
  caption?: string
}>(), {
  imageUrl: '/templates/mosque-hero-1.svg',
  alt: 'Mosque image',
  caption: ''
})
</script>

<template>
  <figure class="overflow-hidden rounded-lg bg-[var(--color-surface)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
    <img
      :src="imageUrl"
      :alt="alt"
      class="aspect-[16/9] w-full object-cover"
    >
    <figcaption
      v-if="caption"
      class="p-3 text-sm text-[var(--color-text-muted)]"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
