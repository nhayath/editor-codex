<script setup lang="ts">
const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  imageUrl?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
  variant?: string
  align?: string
}>(), {
  eyebrow: 'Welcome to',
  title: 'Mosque',
  subtitle: '',
  imageUrl: '',
  primaryLabel: 'View prayer times',
  primaryUrl: '#prayer-times',
  secondaryLabel: 'Upcoming events',
  secondaryUrl: '#events',
  variant: 'with-buttons',
  align: 'left'
})

const links = computed(() => {
  if (props.variant === 'simple') return []

  return [
    { label: props.primaryLabel, to: props.primaryUrl, icon: 'i-lucide-clock-3' },
    { label: props.secondaryLabel, to: props.secondaryUrl, color: 'neutral' as const, variant: 'outline' as const, icon: 'i-lucide-calendar-days' }
  ].filter(link => link.label && link.to)
})

const orientation = computed(() => props.imageUrl && props.variant !== 'simple' ? 'horizontal' : 'vertical')

const heroClass = computed(() => [
  '@container',
  props.align === 'center' ? 'text-center' : ''
])
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-[var(--color-surface)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
    <UPageHero
      :headline="eyebrow"
      :title="title"
      :description="subtitle"
      :links="links"
      :orientation="orientation"
      :ui="{
        container: '!flex !flex-col !gap-6 !px-4 !py-8 @xl:!grid @xl:!grid-cols-2 @xl:!items-center @xl:!gap-8 @xl:!py-12',
        title: 'tenant-heading !text-4xl @md:!text-5xl @xl:!text-6xl tracking-normal break-words text-[var(--color-text)]',
        description: 'text-[var(--color-text-muted)]',
        headline: 'text-[var(--color-primary)]'
      }"
      :class="heroClass"
    >
      <div
        v-if="imageUrl && variant !== 'simple'"
        class="relative isolate min-h-72 overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--color-primary)_12%,white)]"
      >
        <img
          :src="imageUrl"
          :alt="title"
          class="h-full min-h-72 w-full object-cover"
        >
      </div>
    </UPageHero>
  </div>
</template>
