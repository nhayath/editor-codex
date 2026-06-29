<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  items?: string
  variant?: string
  featuredIcon?: string
  accent?: string
  background?: string
  align?: string
  columns?: string
  showHeaderIcon?: boolean
  showIcon?: boolean
  showDescription?: boolean
  showArrow?: boolean
}>(), {
  title: 'Start here',
  eyebrow: 'Community shortcuts',
  items: '',
  variant: 'tiles',
  featuredIcon: 'islamic-mosque',
  accent: 'primary',
  background: 'surface',
  align: 'left',
  columns: '2',
  showHeaderIcon: true,
  showIcon: true,
  showDescription: true,
  showArrow: true
})

const links = computed(() => parsePipeRows(props.items, 4).map(([title, description, href, icon]) => ({
  title,
  description,
  href: href || '#',
  icon: icon || 'islamic-community'
})))

const hasLinks = computed(() => links.value.length > 0)
const featuredLink = computed(() => links.value[0])
const otherLinks = computed(() => links.value.slice(1))

// ----- Shared accent / background system --------------------------------
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

// `solid`/`gradient` are filled (white text); `surface` is a light card.
const isFilled = computed(() => props.background !== 'surface')

const containerStyle = computed(() => {
  if (props.background === 'surface') {
    return {
      background: 'var(--color-surface)',
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)`
    }
  }
  if (props.background === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))`
    }
  }
  return { background: accentVar.value }
})

const headingColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.78)' : 'var(--color-text-muted)')
const accentTextColor = computed(() => isFilled.value ? 'var(--color-secondary)' : accentVar.value)
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')

// Header badge: legacy = tinted accent on white; filled = translucent white.
const headerBadgeStyle = computed(() =>
  isFilled.value
    ? { background: 'rgba(255,255,255,0.14)', color: '#fff' }
    : { background: `color-mix(in srgb, ${accentVar.value} 12%, var(--color-surface))`, color: accentVar.value }
)

// Per-link icon badge: legacy = solid accent + white; filled = translucent.
const iconBadgeStyle = computed(() =>
  isFilled.value
    ? { background: 'rgba(255,255,255,0.16)', color: '#fff' }
    : { background: accentVar.value, color: '#fff' }
)

// Card surface for tiles/rail/featured rows.
const cardStyle = computed(() =>
  isFilled.value
    ? { background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' }
    : {
        background: 'color-mix(in srgb, var(--color-surface) 92%, var(--color-bg))',
        boxShadow: `inset 0 0 0 1px ${hairlineColor.value}`
      }
)

// Pill buttons.
const buttonStyle = computed(() =>
  isFilled.value
    ? { background: 'rgba(255,255,255,0.16)', color: '#fff' }
    : { background: `color-mix(in srgb, ${accentVar.value} 10%, var(--color-surface))`, color: accentVar.value, boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` }
)

const arrowColor = computed(() => isFilled.value ? '#fff' : accentVar.value)
const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')

const tilesGridClass = computed(() =>
  props.columns === '3'
    ? 'grid gap-3 @lg:grid-cols-2 @2xl:grid-cols-3'
    : 'grid gap-3 @lg:grid-cols-2'
)
</script>

<template>
  <div class="@container h-full overflow-hidden rounded-lg p-6" :style="containerStyle">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4" :class="align === 'center' ? 'flex-col items-center text-center' : ''">
      <div>
        <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
          {{ title }}
        </h2>
      </div>
      <div
        v-if="showHeaderIcon"
        class="grid size-12 shrink-0 place-items-center rounded-md"
        :style="headerBadgeStyle"
      >
        <IconGlyph :name="featuredIcon" class="size-6" />
      </div>
    </div>

    <!-- Empty state -->
    <p v-if="!hasLinks" class="mt-6 text-sm" :class="alignClass" :style="{ color: mutedColor }">
      No links yet.
    </p>

    <!-- LIST: compact divided rows -->
    <div v-else-if="variant === 'list'" class="mt-6">
      <NuxtLink
        v-for="(link, index) in links"
        :key="link.title"
        :to="link.href"
        class="group flex items-center gap-4 py-3.5 transition hover:opacity-90"
        :style="index > 0 ? { borderTop: `1px solid ${hairlineColor}` } : {}"
      >
        <span v-if="showIcon" class="grid size-9 shrink-0 place-items-center rounded-md" :style="iconBadgeStyle">
          <IconGlyph :name="link.icon" class="size-4.5" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-semibold" :style="{ color: headingColor }">{{ link.title }}</span>
          <span v-if="showDescription && link.description" class="mt-0.5 block text-sm leading-5" :style="{ color: mutedColor }">{{ link.description }}</span>
        </span>
        <UIcon v-if="showArrow" name="i-lucide-arrow-up-right" class="size-4 shrink-0 opacity-60 transition group-hover:opacity-100" :style="{ color: arrowColor }" />
      </NuxtLink>
    </div>

    <!-- BUTTONS: pill chips, title only -->
    <div v-else-if="variant === 'buttons'" class="mt-6 flex flex-wrap gap-3" :class="align === 'center' ? 'justify-center' : ''">
      <NuxtLink
        v-for="link in links"
        :key="link.title"
        :to="link.href"
        class="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
        :style="buttonStyle"
      >
        <IconGlyph v-if="showIcon" :name="link.icon" class="size-4" />
        {{ link.title }}
        <UIcon v-if="showArrow" name="i-lucide-arrow-up-right" class="size-3.5 opacity-70 transition group-hover:opacity-100" />
      </NuxtLink>
    </div>

    <!-- FEATURED: first link spotlighted, rest in a grid -->
    <div v-else-if="variant === 'featured'" class="mt-6 grid gap-3">
      <NuxtLink
        v-if="featuredLink"
        :to="featuredLink.href"
        class="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md p-5 transition hover:-translate-y-0.5"
        :style="cardStyle"
      >
        <span v-if="showIcon" class="grid size-14 place-items-center rounded-md" :style="iconBadgeStyle">
          <IconGlyph :name="featuredLink.icon" class="size-7" />
        </span>
        <span class="min-w-0">
          <span class="block text-lg font-bold" :style="{ color: headingColor }">{{ featuredLink.title }}</span>
          <span v-if="showDescription && featuredLink.description" class="mt-1 block text-sm leading-5" :style="{ color: mutedColor }">{{ featuredLink.description }}</span>
        </span>
        <UIcon v-if="showArrow" name="i-lucide-arrow-up-right" class="size-5 opacity-60 transition group-hover:opacity-100" :style="{ color: arrowColor }" />
      </NuxtLink>
      <div v-if="otherLinks.length" class="grid gap-3 @lg:grid-cols-2">
        <NuxtLink
          v-for="link in otherLinks"
          :key="link.title"
          :to="link.href"
          class="group flex items-center gap-3 rounded-md p-4 transition hover:-translate-y-0.5"
          :style="cardStyle"
        >
          <span v-if="showIcon" class="grid size-9 shrink-0 place-items-center rounded-md" :style="iconBadgeStyle">
            <IconGlyph :name="link.icon" class="size-4.5" />
          </span>
          <span class="min-w-0 flex-1 font-semibold" :style="{ color: headingColor }">{{ link.title }}</span>
          <UIcon v-if="showArrow" name="i-lucide-arrow-up-right" class="size-4 shrink-0 opacity-60 transition group-hover:opacity-100" :style="{ color: arrowColor }" />
        </NuxtLink>
      </div>
    </div>

    <!-- TILES (default) / RAIL: bordered cards -->
    <div v-else :class="variant === 'rail' ? 'mt-6 grid gap-3' : `mt-6 ${tilesGridClass}`">
      <NuxtLink
        v-for="link in links"
        :key="link.title"
        :to="link.href"
        class="group grid min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_color-mix(in_srgb,var(--color-text)_12%,transparent)]"
        :style="cardStyle"
      >
        <span v-if="showIcon" class="grid size-11 place-items-center rounded-md" :style="iconBadgeStyle">
          <IconGlyph :name="link.icon" class="size-5" />
        </span>
        <span class="min-w-0">
          <span class="block font-semibold" :style="{ color: headingColor }">{{ link.title }}</span>
          <span v-if="showDescription && link.description" class="mt-1 block text-sm leading-5" :style="{ color: mutedColor }">{{ link.description }}</span>
        </span>
        <UIcon v-if="showArrow" name="i-lucide-arrow-up-right" class="size-4 opacity-60 transition group-hover:opacity-100" :style="{ color: arrowColor }" />
      </NuxtLink>
    </div>
  </div>
</template>
