<script setup lang="ts">
import { parseLines } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  imageUrls?: string
  variant?: string
}>(), {
  title: 'Gallery',
  imageUrls: '',
  variant: 'grid'
})

const images = computed(() => {
  const lines = parseLines(props.imageUrls)
  return lines.length ? lines : ['/templates/mosque-hero-1.svg', '/templates/mosque-hero-2.svg', '/templates/mosque-hero-3.svg']
})
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        Moments
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
    </div>

    <div :class="variant === 'masonry' ? 'columns-1 gap-4 md:columns-3' : 'grid gap-4 md:grid-cols-3'">
      <img
        v-for="(image, index) in images"
        :key="image"
        :src="image"
        :alt="`${title} ${index + 1}`"
        class="mb-4 aspect-[4/3] w-full break-inside-avoid rounded-lg object-cover ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
      >
    </div>
  </div>
</template>
