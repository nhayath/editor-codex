<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { pageBackgroundPatterns } from '~/composables/usePageBackground'

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
  texture?: string
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
  textTone: 'light',
  texture: 'eight-point-star'
})

interface HeroLink { label: string; to: string }

const links = computed<HeroLink[]>(() => {
  if (props.variant === 'simple') return []

  const all = [
    { label: props.primaryLabel, to: props.primaryUrl },
    { label: props.secondaryLabel, to: props.secondaryUrl }
  ].filter(link => link.label && link.to)

  // Banner shows a single action.
  return props.variant === 'banner' ? all.slice(0, 1) : all
})

// Background system (used by simple / action / banner).
const isPlain = computed(() => !['solid', 'gradient', 'image'].includes(props.background))
const useLightText = computed(() => !isPlain.value && props.textTone === 'light')
const overlayValue = computed(() => Math.min(Math.max(props.overlayOpacity, 0), 100) / 100)

const bgStyle = computed(() => {
  if (props.background === 'solid') return { backgroundColor: props.bgColor }
  if (props.background === 'gradient') return { backgroundImage: `linear-gradient(135deg, ${props.gradientFrom}, ${props.gradientTo})` }
  return {}
})

const bgWrapperClass = computed(() => [
  '@container relative isolate overflow-hidden rounded-lg',
  isPlain.value ? 'bg-[var(--color-surface)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]' : ''
])

const centered = computed(() => props.align === 'center')

const texturePattern = computed(() => {
  if (props.texture === 'none') return null
  return pageBackgroundPatterns.find(pattern => pattern.id === (props.texture || 'eight-point-star'))
    ?? pageBackgroundPatterns.find(pattern => pattern.id === 'eight-point-star')
    ?? null
})

const textureStyle = computed(() => {
  if (!texturePattern.value) return {}
  return {
    maskImage: `url("${texturePattern.value.url}")`,
    WebkitMaskImage: `url("${texturePattern.value.url}")`
  } satisfies CSSProperties
})

// Button styling shared across the non-immersive variants.
// `light` = sitting on a dark surface, so use light-on-dark button colors.
function buttonClass(index: number, light: boolean) {
  if (index === 0) {
    return light
      ? 'bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_90%,transparent)]'
      : 'bg-[var(--color-primary)] text-[var(--color-surface)] hover:opacity-90'
  }
  return light
    ? 'border border-[color:color-mix(in_srgb,var(--color-surface)_40%,transparent)] text-[var(--color-surface)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)]'
    : 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
}
</script>

<template>
  <!-- IMMERSIVE: full-bleed background image, tall, text on top -->
  <div
    v-if="variant === 'immersive'"
    class="@container relative left-1/2 isolate min-h-[560px] w-screen -translate-x-1/2 overflow-hidden bg-[var(--color-primary)] text-[var(--color-surface)] @4xl:min-h-[720px]"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="title"
      class="absolute inset-0 -z-20 h-full w-full scale-[1.02] object-cover object-[72%_center]"
    >
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_28%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_34%),linear-gradient(90deg,color-mix(in_srgb,var(--color-primary)_90%,var(--color-text))_0%,color-mix(in_srgb,var(--color-primary)_58%,transparent)_38%,transparent_78%),linear-gradient(180deg,transparent_35%,color-mix(in_srgb,var(--color-primary)_72%,var(--color-text))_100%)]" />
    <div
      v-if="texturePattern"
      class="absolute inset-0 -z-10 bg-[color:color-mix(in_srgb,var(--color-surface)_60%,transparent)] opacity-12 mix-blend-soft-light [mask-position:center] [mask-repeat:repeat] [mask-size:92px]"
      :style="textureStyle"
      aria-hidden="true"
    />
    <div class="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/20 to-transparent" />

    <div class="mx-auto flex min-h-[560px] w-[min(1120px,calc(100%-2rem))] flex-col justify-end p-6 @lg:p-10 @2xl:p-14 @4xl:min-h-[720px]">
      <p
        v-if="eyebrow"
        class="mb-5 inline-flex w-fit items-center gap-2 rounded-md bg-[color:color-mix(in_srgb,var(--color-surface)_16%,transparent)] px-3 py-2 text-sm font-bold text-[var(--color-surface)] shadow-[0_12px_30px_rgba(0,0,0,0.18)] ring-1 ring-[color:color-mix(in_srgb,var(--color-surface)_26%,transparent)] backdrop-blur-md"
      >
        <IconGlyph name="islamic-mosque" class="size-4" />
        {{ eyebrow }}
      </p>
      <h1 class="tenant-heading max-w-3xl text-5xl font-bold leading-[1.02] tracking-normal text-[var(--color-surface)] @lg:text-6xl @2xl:text-7xl">
        {{ title }}
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-[color:color-mix(in_srgb,var(--color-surface)_78%,transparent)]">
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
          :class="index === 0 ? 'bg-[#8FD6C1] text-[#16213E] hover:bg-[var(--color-secondary)]' : 'border-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] text-[var(--color-surface)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)]'"
        >
          <template #leading>
            <IconGlyph :name="index === 0 ? 'islamic-prayer-times' : 'islamic-calendar'" class="size-5" />
          </template>
          {{ link.label }}
        </UButton>
      </div>
    </div>
  </div>

  <!-- SPLIT: balanced 50/50, image fills its half edge-to-edge -->
  <div
    v-else-if="variant === 'split'"
    class="@container overflow-hidden rounded-lg ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
  >
    <div class="grid @xl:grid-cols-2">
      <div class="flex flex-col justify-center gap-5 bg-[var(--color-surface)] p-6 @xl:p-10">
        <p v-if="eyebrow" class="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          {{ eyebrow }}
        </p>
        <h1 class="tenant-heading text-3xl font-bold tracking-normal text-[var(--color-text)] @xl:text-5xl">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="max-w-prose text-base leading-7 text-[var(--color-text-muted)]">
          {{ subtitle }}
        </p>
        <div v-if="links.length" class="mt-1 flex flex-wrap gap-3">
          <NuxtLink
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition"
            :class="buttonClass(index, false)"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
      <div class="relative order-first min-h-56 bg-[color:color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] @xl:order-none @xl:min-h-[440px]">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="title"
          class="absolute inset-0 h-full w-full object-cover"
        >
      </div>
    </div>
  </div>

  <!-- SPOTLIGHT: image-dominant with a floating text card -->
  <div
    v-else-if="variant === 'with-image'"
    class="@container relative isolate min-h-[460px] overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface))]"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="title"
      class="absolute inset-0 -z-10 h-full w-full object-cover"
    >
    <div class="flex min-h-[460px] items-center p-5 @lg:p-10">
      <div class="w-full max-w-md rounded-lg bg-[color:color-mix(in_srgb,var(--color-surface)_95%,transparent)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_10%,transparent)] backdrop-blur-sm @lg:p-8">
        <p v-if="eyebrow" class="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
          {{ eyebrow }}
        </p>
        <h1 class="tenant-heading mt-3 text-3xl font-bold tracking-normal text-[var(--color-text)] @lg:text-4xl">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-4 text-base leading-7 text-[var(--color-text-muted)]">
          {{ subtitle }}
        </p>
        <div v-if="links.length" class="mt-6 flex flex-wrap gap-3">
          <NuxtLink
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition"
            :class="buttonClass(index, false)"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- BANNER: short strip, headline + single action -->
  <div
    v-else-if="variant === 'banner'"
    :class="bgWrapperClass"
    :style="bgStyle"
  >
    <template v-if="background === 'image' && imageUrl">
      <img :src="imageUrl" :alt="title" class="absolute inset-0 -z-20 h-full w-full object-cover">
      <div v-if="overlay" class="absolute inset-0 -z-10 bg-black" :style="{ opacity: overlayValue }" />
    </template>
    <div class="flex flex-col items-start gap-4 px-6 py-7 @xl:flex-row @xl:items-center @xl:justify-between @xl:px-10">
      <div class="min-w-0">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-wide" :class="useLightText ? 'text-[color:color-mix(in_srgb,var(--color-surface)_80%,transparent)]' : 'text-[var(--color-primary)]'">
          {{ eyebrow }}
        </p>
        <h1 class="tenant-heading text-2xl font-bold tracking-normal @xl:text-3xl" :class="useLightText ? 'text-[var(--color-surface)]' : 'text-[var(--color-text)]'">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-1 text-sm leading-6" :class="useLightText ? 'text-[color:color-mix(in_srgb,var(--color-surface)_80%,transparent)]' : 'text-[var(--color-text-muted)]'">
          {{ subtitle }}
        </p>
      </div>
      <NuxtLink
        v-for="(link, index) in links"
        :key="link.to"
        :to="link.to"
        class="inline-flex shrink-0 items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition"
        :class="buttonClass(index, useLightText)"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
  </div>

  <!-- SIMPLE & ACTION: background-driven, centered/left text (Action has bold buttons) -->
  <div
    v-else
    :class="bgWrapperClass"
    :style="bgStyle"
  >
    <template v-if="background === 'image' && imageUrl">
      <img :src="imageUrl" :alt="title" class="absolute inset-0 -z-20 h-full w-full object-cover">
      <div v-if="overlay" class="absolute inset-0 -z-10 bg-black" :style="{ opacity: overlayValue }" />
    </template>

    <div class="px-6 py-12 @xl:py-16" :class="centered ? 'text-center' : ''">
      <div class="mx-auto flex max-w-3xl flex-col gap-5" :class="centered ? 'items-center' : 'items-start'">
        <template v-if="variant === 'with-buttons'">
          <span
            v-if="eyebrow"
            class="inline-flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold"
            :class="useLightText ? 'bg-[color:color-mix(in_srgb,var(--color-surface)_15%,transparent)] text-[var(--color-surface)]' : 'bg-[color:color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]'"
          >
            {{ eyebrow }}
          </span>
        </template>
        <p
          v-else-if="eyebrow"
          class="text-sm font-bold uppercase tracking-wide"
          :class="useLightText ? 'text-[color:color-mix(in_srgb,var(--color-surface)_80%,transparent)]' : 'text-[var(--color-primary)]'"
        >
          {{ eyebrow }}
        </p>

        <h1
          class="tenant-heading text-4xl font-bold tracking-normal @md:text-5xl @xl:text-6xl"
          :class="useLightText ? 'text-[var(--color-surface)]' : 'text-[var(--color-text)]'"
        >
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="max-w-2xl text-lg leading-8"
          :class="useLightText ? 'text-[color:color-mix(in_srgb,var(--color-surface)_80%,transparent)]' : 'text-[var(--color-text-muted)]'"
        >
          {{ subtitle }}
        </p>

        <div
          v-if="links.length"
          class="mt-2 flex flex-wrap gap-3"
          :class="centered ? 'justify-center' : ''"
        >
          <NuxtLink
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="inline-flex items-center justify-center rounded-md font-bold transition"
            :class="[
              variant === 'with-buttons' ? 'px-7 py-4 text-base' : 'px-5 py-3 text-sm',
              buttonClass(index, useLightText)
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
