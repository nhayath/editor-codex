<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  slides?: string
  variant?: string
  accent?: string
  background?: string
  align?: string
  slidesPerView?: string
  imageRatio?: string
  showCta?: boolean
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
  autoplay?: boolean
  autoplaySpeed?: number
}>(), {
  eyebrow: 'Featured',
  title: 'Community highlights',
  subtitle: '',
  slides: '',
  variant: 'single-slide',
  accent: 'primary',
  background: 'surface',
  align: 'left',
  slidesPerView: '1',
  imageRatio: 'landscape',
  showCta: true,
  showArrows: true,
  showDots: true,
  loop: true,
  autoplay: true,
  autoplaySpeed: 5000
})

interface Slide {
  title: string
  subtitle: string
  imageUrl: string
  link: string
  buttonLabel: string
}

const items = computed<Slide[]>(() => {
  const parsed = parsePipeRows(props.slides, 5)

  const rows = parsed.length
    ? parsed
    : [['Daily prayers', 'Join the congregation throughout the day.', '/templates/mosque-hero-1.svg', '', '']]

  return rows.map((row) => ({
    title: row[0] ?? '',
    subtitle: row[1] ?? '',
    imageUrl: row[2] ?? '',
    link: row[3] ?? '',
    buttonLabel: row[4] ?? ''
  }))
})

const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

const isFilled = computed(() => props.background !== 'surface')

const containerStyle = computed(() => {
  if (!isFilled.value) return {}
  if (props.background === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))`
    }
  }
  return { background: accentVar.value }
})

const eyebrowColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)')
const headingColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.78)' : 'var(--color-text-muted)')
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
const cardBg = computed(() => isFilled.value ? 'rgba(255,255,255,0.1)' : 'var(--color-surface)')
const headerAlignClass = computed(() => props.align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl')

const imageRatioClass = computed(() => {
  switch (props.imageRatio) {
    case 'square': return 'aspect-square'
    case 'portrait': return 'aspect-[3/4]'
    default: return 'aspect-[4/3]'
  }
})

const basisClass = computed(() => {
  // Hero / split / minimal are always one slide at a time.
  if (props.variant === 'single-slide' || props.variant === 'split' || props.variant === 'minimal') {
    return 'basis-full'
  }
  switch (props.slidesPerView) {
    case '3': return 'basis-full @md:basis-1/2 @2xl:basis-1/3'
    case '2': return 'basis-full @xl:basis-1/2'
    default: return 'basis-full'
  }
})

const autoplayConfig = computed(() => props.autoplay ? { delay: Math.max(1500, props.autoplaySpeed) } : false)

function slideHref(item: Slide) {
  return props.showCta && item.link ? item.link : undefined
}
</script>

<template>
  <div
    class="@container grid h-full gap-6 overflow-hidden"
    :class="isFilled ? 'rounded-2xl p-8' : ''"
    :style="containerStyle"
    data-testid="carousel-widget"
    :data-carousel-variant="variant"
  >
    <div :class="headerAlignClass">
      <p v-if="eyebrow" class="text-sm font-semibold" :style="{ color: eyebrowColor }">
        {{ eyebrow }}
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-3 leading-7" :style="{ color: mutedColor }">
        {{ subtitle }}
      </p>
    </div>

    <UCarousel
      v-slot="{ item }"
      :items="items"
      :arrows="showArrows"
      :dots="showDots"
      :loop="loop"
      :autoplay="autoplayConfig"
      :ui="{ item: basisClass }"
      class="min-w-0 overflow-hidden rounded-lg"
    >
      <!-- Cards: image-topped content card -->
      <div
        v-if="variant === 'cards'"
        class="mx-2 flex h-full flex-col overflow-hidden rounded-xl"
        :style="{ background: cardBg, boxShadow: `inset 0 0 0 1px ${hairlineColor}` }"
      >
        <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="w-full object-cover" :class="imageRatioClass">
        <div class="flex flex-1 flex-col gap-2 p-5">
          <h3 class="tenant-heading text-lg font-bold" :style="{ color: headingColor }">
            {{ item.title }}
          </h3>
          <p class="text-sm leading-6" :style="{ color: mutedColor }">
            {{ item.subtitle }}
          </p>
          <a
            v-if="slideHref(item)"
            :href="slideHref(item)"
            class="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold"
            :style="{ color: isFilled ? '#fff' : accentVar }"
          >
            {{ item.buttonLabel || 'Learn more' }}
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </div>

      <!-- Split: image one side, text + CTA the other -->
      <div
        v-else-if="variant === 'split'"
        class="grid items-center gap-6 @2xl:grid-cols-2"
      >
        <div v-if="item.imageUrl" class="overflow-hidden rounded-xl">
          <img :src="item.imageUrl" :alt="item.title" class="w-full object-cover" :class="imageRatioClass">
        </div>
        <div class="flex flex-col gap-3 p-2">
          <h3 class="tenant-heading text-2xl font-bold @xl:text-3xl" :style="{ color: headingColor }">
            {{ item.title }}
          </h3>
          <p class="leading-7" :style="{ color: mutedColor }">
            {{ item.subtitle }}
          </p>
          <a
            v-if="slideHref(item)"
            :href="slideHref(item)"
            class="mt-2 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
            :style="isFilled
              ? { background: 'rgba(255,255,255,0.16)', color: '#fff' }
              : { background: accentVar, color: '#fff' }"
          >
            {{ item.buttonLabel || 'Learn more' }}
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </div>

      <!-- Minimal: text-forward, no image -->
      <div
        v-else-if="variant === 'minimal'"
        class="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-12 text-center"
      >
        <h3 class="tenant-heading text-2xl font-bold @xl:text-3xl" :style="{ color: headingColor }">
          {{ item.title }}
        </h3>
        <p class="text-lg leading-8" :style="{ color: mutedColor }">
          {{ item.subtitle }}
        </p>
        <a
          v-if="slideHref(item)"
          :href="slideHref(item)"
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          :style="isFilled
            ? { background: 'rgba(255,255,255,0.16)', color: '#fff' }
            : { background: accentVar, color: '#fff' }"
        >
          {{ item.buttonLabel || 'Learn more' }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </a>
      </div>

      <!-- Hero / Multi slide: legacy full-bleed overlay (default fallback).
           single-slide = one at a time, multi-slide = same card at half/third basis. -->
      <article v-else class="relative min-h-96 overflow-hidden rounded-lg bg-[var(--color-primary)]">
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
          <a
            v-if="slideHref(item)"
            :href="slideHref(item)"
            class="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30"
          >
            {{ item.buttonLabel || 'Learn more' }}
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </article>
    </UCarousel>
  </div>
</template>
