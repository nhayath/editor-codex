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
  background?: string
  bgColor?: string
  gradientFrom?: string
  gradientTo?: string
  overlay?: boolean
  overlayOpacity?: number
  textTone?: string
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
  align: 'left',
  background: 'plain',
  bgColor: '#0f766e',
  gradientFrom: '#0f766e',
  gradientTo: '#134e4a',
  overlay: true,
  overlayOpacity: 50,
  textTone: 'light'
})

const links = computed(() => {
  if (props.variant === 'simple') return []

  return [
    { label: props.primaryLabel, to: props.primaryUrl, icon: 'i-lucide-clock-3' },
    { label: props.secondaryLabel, to: props.secondaryUrl, color: 'neutral' as const, variant: 'outline' as const, icon: 'i-lucide-calendar-days' }
  ].filter(link => link.label && link.to)
})

// Plain keeps the original surface card; solid/gradient/image use a styled background.
const isPlain = computed(() => !['solid', 'gradient', 'image'].includes(props.background))
const useLightText = computed(() => !isPlain.value && props.textTone === 'light')

// When the image is used as the full background, drop the side-by-side image panel.
const showSideImage = computed(() => Boolean(props.imageUrl) && props.variant !== 'simple' && props.background !== 'image')
const orientation = computed(() => showSideImage.value ? 'horizontal' : 'vertical')

const bgStyle = computed(() => {
  if (props.background === 'solid') return { backgroundColor: props.bgColor }
  if (props.background === 'gradient') return { backgroundImage: `linear-gradient(135deg, ${props.gradientFrom}, ${props.gradientTo})` }
  return {}
})

const wrapperClass = computed(() => [
  'relative isolate overflow-hidden rounded-lg',
  isPlain.value ? 'bg-[var(--color-surface)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]' : ''
])

const heroUi = computed(() => ({
  container: showSideImage.value
    ? '!flex !flex-col !gap-6 !px-4 !py-8 @xl:!grid @xl:!grid-cols-2 @xl:!items-center @xl:!gap-8 @xl:!py-12'
    : '!flex !flex-col !gap-6 !px-4 !py-8 @xl:!py-12',
  title: `tenant-heading !text-4xl @md:!text-5xl @xl:!text-6xl tracking-normal break-words ${useLightText.value ? '!text-white' : 'text-[var(--color-text)]'}`,
  description: useLightText.value ? 'text-white/80' : 'text-[var(--color-text-muted)]',
  headline: useLightText.value ? 'text-white' : 'text-[var(--color-primary)]'
}))

const heroClass = computed(() => [
  '@container',
  props.align === 'center' ? 'text-center' : ''
])
</script>

<template>
  <div
    v-if="variant === 'immersive'"
    class="relative isolate min-h-[620px] overflow-hidden rounded-lg bg-[var(--color-primary)] text-white"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="title"
      class="absolute inset-0 -z-20 h-full w-full object-cover"
    >
    <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-primary)_96%,black)_0%,color-mix(in_srgb,var(--color-primary)_76%,transparent)_48%,color-mix(in_srgb,var(--color-accent)_22%,transparent)_100%),linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--color-primary)_90%,black)_100%)]" />
    <div class="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(45deg,color-mix(in_srgb,var(--color-secondary)_28%,transparent)_25%,transparent_25%),linear-gradient(-45deg,color-mix(in_srgb,var(--color-secondary)_20%,transparent)_25%,transparent_25%)] [background-size:28px_28px]" />

    <div class="flex min-h-[620px] max-w-3xl flex-col justify-end p-6 @lg:p-10 @2xl:p-14">
      <p
        v-if="eyebrow"
        class="mb-5 inline-flex w-fit items-center gap-2 rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        <IconGlyph name="islamic-mosque" class="size-4" />
        {{ eyebrow }}
      </p>
      <h1 class="tenant-heading text-5xl font-bold leading-[1.02] tracking-normal text-white @lg:text-6xl @2xl:text-7xl">
        {{ title }}
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-white/78">
        {{ subtitle }}
      </p>
      <div
        v-if="links.length"
        class="mt-8 flex flex-wrap gap-3"
      >
        <UButton
          v-for="(link, index) in links"
          :key="link.to"
          :to="link.to"
          color="neutral"
          :variant="index === 0 ? 'solid' : 'outline'"
          size="lg"
          class="font-bold"
          :class="index === 0 ? 'bg-[#8FD6C1] text-[#16213E] hover:bg-[var(--color-secondary)]' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'"
        >
          <template #leading>
            <IconGlyph :name="index === 0 ? 'islamic-prayer-times' : 'islamic-calendar'" class="size-5" />
          </template>
          {{ link.label }}
        </UButton>
      </div>
    </div>
  </div>

  <div
    v-else
    :class="wrapperClass"
    :style="bgStyle"
  >
    <template v-if="background === 'image' && imageUrl">
      <img
        :src="imageUrl"
        :alt="title"
        class="absolute inset-0 -z-20 h-full w-full object-cover"
      >
      <div
        v-if="overlay"
        class="absolute inset-0 -z-10 bg-black"
        :style="{ opacity: Math.min(Math.max(overlayOpacity, 0), 100) / 100 }"
      />
    </template>

    <UPageHero
      :headline="eyebrow"
      :title="title"
      :description="subtitle"
      :links="links"
      :orientation="orientation"
      :ui="heroUi"
      :class="heroClass"
    >
      <div
        v-if="showSideImage"
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
