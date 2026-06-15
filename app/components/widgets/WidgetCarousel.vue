<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  slides?: string
  variant?: string
  autoplay?: boolean
}>(), {
  title: 'Community highlights',
  subtitle: '',
  slides: '',
  variant: 'single-slide',
  autoplay: true
})

const items = computed(() => {
  const parsed = parsePipeRows(props.slides, 3)

  return parsed.length
    ? parsed.map(([title, subtitle, imageUrl]) => ({ title, subtitle, imageUrl }))
    : [
        { title: 'Daily prayers', subtitle: 'Join the congregation throughout the day.', imageUrl: '/templates/mosque-hero-1.svg' }
      ]
})
</script>

<template>
  <div class="grid gap-6">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        Featured
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
      <p class="mt-3 text-[var(--color-text-muted)]">
        {{ subtitle }}
      </p>
    </div>

    <UCarousel
      :items="items"
      arrows
      dots
      :autoplay="autoplay ? { delay: 5000 } : false"
      :ui="{ item: variant === 'multi-slide' ? 'basis-full md:basis-1/2' : 'basis-full' }"
      class="overflow-hidden rounded-lg"
    >
      <template #default="{ item }">
        <article class="relative min-h-96 overflow-hidden rounded-lg bg-[var(--color-primary)]">
          <img
            :src="item.imageUrl"
            :alt="item.title"
            class="absolute inset-0 h-full w-full object-cover"
          >
          <div class="absolute inset-0 bg-[color:color-mix(in_srgb,var(--color-primary)_70%,transparent)]" />
          <div class="relative flex min-h-96 max-w-2xl flex-col justify-end p-8 text-white">
            <h3 class="tenant-heading text-4xl font-bold">
              {{ item.title }}
            </h3>
            <p class="mt-3 text-lg text-white/85">
              {{ item.subtitle }}
            </p>
          </div>
        </article>
      </template>
    </UCarousel>
  </div>
</template>
