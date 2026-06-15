<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  body?: string
  imageUrl?: string
  imagePosition?: string
}>(), {
  title: 'About our mosque',
  body: '<p>Our mosque is a place of worship, learning, service, and community belonging.</p>',
  imageUrl: '',
  imagePosition: 'right'
})
</script>

<template>
  <div
    class="grid items-center gap-8 lg:grid-cols-2"
    :class="imagePosition === 'left' ? 'lg:[&>*:first-child]:order-2' : ''"
  >
    <div>
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        About
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
      <div
        class="rich-content mt-4"
        v-html="body"
      />
    </div>

    <div class="overflow-hidden rounded-lg bg-[var(--color-surface)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
      <img
        :src="imageUrl || '/templates/mosque-hero-2.svg'"
        :alt="title"
        class="aspect-[4/3] w-full object-cover"
      >
    </div>
  </div>
</template>
