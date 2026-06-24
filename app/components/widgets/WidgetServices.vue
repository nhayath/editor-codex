<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  items?: string
  variant?: string
  accent?: string
  background?: string
  columns?: string
  align?: string
  imageRatio?: string
  showImage?: boolean
  showIcon?: boolean
  showDescription?: boolean
  showCta?: boolean
}>(), {
  title: 'Services',
  eyebrow: 'What we offer',
  items: '',
  variant: 'grid',
  accent: 'primary',
  background: 'surface',
  columns: '3',
  align: 'left',
  imageRatio: 'landscape',
  showImage: true,
  showIcon: true,
  showDescription: true,
  showCta: false
})

interface Service {
  title: string
  description: string
  icon: string
  image: string
  link: string
}

const services = computed<Service[]>(() =>
  parsePipeRows(props.items, 5).map(([title, description, icon, image, link]) => ({
    title,
    description,
    icon: icon || 'i-lucide-sparkles',
    image: image || '',
    link: link || ''
  }))
)
const hasServices = computed(() => services.value.length > 0)

function hasImage(s: Service) {
  return props.showImage && !!s.image
}

// Accent + background system, mirrored from the prayer/jummah widgets.
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

// `solid`/`gradient` fill the whole section (white text on an accent block).
// `surface` keeps the legacy transparent section so existing tenants are unchanged.
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
const accentTextColor = computed(() => isFilled.value ? 'var(--color-secondary)' : accentVar.value)
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')

const cardStyle = computed(() => isFilled.value
  ? { background: 'rgba(255,255,255,0.1)' }
  : { background: 'var(--color-surface)', boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` })

const iconTileStyle = computed(() => isFilled.value
  ? { background: 'rgba(255,255,255,0.16)', color: '#fff' }
  : { background: 'color-mix(in srgb, var(--color-primary) 12%, white)', color: accentVar.value })

// Overlay cards always render white text, so an image-less card needs a dark
// enough fill for that text to stay legible (a light icon tile would not).
const overlayFallbackStyle = computed(() => isFilled.value
  ? { background: 'rgba(255,255,255,0.12)' }
  : { background: accentVar.value })

const headerAlignClass = computed(() => props.align === 'center' ? 'text-center' : '')

const gridColsClass = computed(() => {
  switch (props.columns) {
    case '2': return '@xl:grid-cols-2'
    case '4': return '@md:grid-cols-2 @xl:grid-cols-4'
    default: return '@sm:grid-cols-2 @xl:grid-cols-3'
  }
})

const imageRatioClass = computed(() => {
  switch (props.imageRatio) {
    case 'square': return 'aspect-square'
    case 'portrait': return 'aspect-[3/4]'
    default: return 'aspect-[4/3]'
  }
})

// Feature variant: first service spotlighted, the rest beneath.
const featured = computed(() => services.value[0] ?? null)
const rest = computed(() => services.value.slice(1))
</script>

<template>
  <div
    class="@container grid gap-6"
    :class="isFilled ? 'rounded-2xl p-8' : ''"
    :style="containerStyle"
  >
    <!-- Header -->
    <div :class="headerAlignClass">
      <p v-if="eyebrow" class="text-sm font-semibold" :style="{ color: eyebrowColor }">
        {{ eyebrow }}
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
        {{ title }}
      </h2>
    </div>

    <!-- Empty state -->
    <p v-if="!hasServices" class="text-sm" :style="{ color: mutedColor }">
      No services have been added yet.
    </p>

    <!-- List -->
    <div v-else-if="variant === 'list'" class="grid gap-3">
      <article
        v-for="service in services"
        :key="service.title"
        class="flex items-start gap-4 rounded-lg p-4"
        :style="cardStyle"
      >
        <img
          v-if="hasImage(service)"
          :src="service.image"
          :alt="service.title"
          class="size-14 shrink-0 rounded-md object-cover"
        >
        <div
          v-else-if="showIcon"
          class="grid size-12 shrink-0 place-items-center rounded-md"
          :style="iconTileStyle"
        >
          <IconGlyph :name="service.icon" class="size-5" />
        </div>
        <div class="min-w-0">
          <h3 class="font-semibold" :style="{ color: headingColor }">
            {{ service.title }}
          </h3>
          <p v-if="showDescription" class="mt-1 text-sm leading-6" :style="{ color: mutedColor }">
            {{ service.description }}
          </p>
          <a
            v-if="showCta && service.link"
            :href="service.link"
            class="mt-2 inline-flex items-center gap-1 text-sm font-semibold"
            :style="{ color: accentTextColor }"
          >
            Learn more
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </article>
    </div>

    <!-- Image cards -->
    <div v-else-if="variant === 'cards'" class="grid gap-5" :class="gridColsClass">
      <article
        v-for="service in services"
        :key="service.title"
        class="flex flex-col overflow-hidden rounded-xl"
        :style="cardStyle"
      >
        <img
          v-if="hasImage(service)"
          :src="service.image"
          :alt="service.title"
          class="w-full object-cover"
          :class="imageRatioClass"
        >
        <div
          v-else
          class="grid w-full place-items-center"
          :class="imageRatioClass"
          :style="iconTileStyle"
        >
          <IconGlyph :name="service.icon" class="size-10" />
        </div>
        <div class="flex flex-1 flex-col p-5">
          <div class="flex items-center gap-3">
            <div
              v-if="showIcon && hasImage(service)"
              class="grid size-9 shrink-0 place-items-center rounded-md"
              :style="iconTileStyle"
            >
              <IconGlyph :name="service.icon" class="size-4" />
            </div>
            <h3 class="font-semibold" :style="{ color: headingColor }">
              {{ service.title }}
            </h3>
          </div>
          <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
            {{ service.description }}
          </p>
          <a
            v-if="showCta && service.link"
            :href="service.link"
            class="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
            :style="{ color: accentTextColor }"
          >
            Learn more
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </article>
    </div>

    <!-- Feature: first service spotlighted, the rest in a grid -->
    <div v-else-if="variant === 'feature'" class="grid gap-5">
      <article
        v-if="featured"
        class="grid gap-0 overflow-hidden rounded-2xl @2xl:grid-cols-2"
        :style="cardStyle"
      >
        <img
          v-if="hasImage(featured)"
          :src="featured.image"
          :alt="featured.title"
          class="h-full min-h-48 w-full object-cover"
        >
        <div
          v-else
          class="grid min-h-48 w-full place-items-center"
          :style="iconTileStyle"
        >
          <IconGlyph :name="featured.icon" class="size-14" />
        </div>
        <div class="flex flex-col justify-center p-7">
          <div
            v-if="showIcon && hasImage(featured)"
            class="grid size-11 place-items-center rounded-lg"
            :style="iconTileStyle"
          >
            <IconGlyph :name="featured.icon" class="size-5" />
          </div>
          <h3 class="mt-4 text-2xl font-bold" :style="{ color: headingColor }">
            {{ featured.title }}
          </h3>
          <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
            {{ featured.description }}
          </p>
          <a
            v-if="showCta && featured.link"
            :href="featured.link"
            class="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
            :style="{ color: accentTextColor }"
          >
            Learn more
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </article>

      <div v-if="rest.length" class="grid gap-4" :class="gridColsClass">
        <article
          v-for="service in rest"
          :key="service.title"
          class="rounded-lg p-5"
          :style="cardStyle"
        >
          <div
            v-if="showIcon"
            class="grid size-10 place-items-center rounded-md"
            :style="iconTileStyle"
          >
            <IconGlyph :name="service.icon" class="size-5" />
          </div>
          <h3 class="mt-4 font-semibold" :style="{ color: headingColor }">
            {{ service.title }}
          </h3>
          <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
            {{ service.description }}
          </p>
        </article>
      </div>
    </div>

    <!-- Overlay: image-background cards with a scrim and overlaid text -->
    <div v-else-if="variant === 'overlay'" class="grid gap-5" :class="gridColsClass">
      <article
        v-for="service in services"
        :key="service.title"
        class="relative flex flex-col justify-end overflow-hidden rounded-xl"
        :class="imageRatioClass"
        :style="hasImage(service) ? {} : overlayFallbackStyle"
      >
        <img
          v-if="hasImage(service)"
          :src="service.image"
          :alt="service.title"
          class="absolute inset-0 size-full object-cover"
        >
        <div
          v-if="hasImage(service)"
          class="absolute inset-0"
          style="background: linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.15) 60%, transparent)"
        />
        <div class="relative p-5">
          <div
            v-if="showIcon"
            class="grid size-9 place-items-center rounded-md"
            style="background: rgba(255,255,255,0.2); color: #fff"
          >
            <IconGlyph :name="service.icon" class="size-4" />
          </div>
          <h3 class="mt-3 font-semibold text-white">
            {{ service.title }}
          </h3>
          <p v-if="showDescription" class="mt-1 text-sm leading-6 text-white/80">
            {{ service.description }}
          </p>
          <a
            v-if="showCta && service.link"
            :href="service.link"
            class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-white"
          >
            Learn more
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </article>
    </div>

    <!-- Grid (default, legacy icon tiles) -->
    <div v-else class="grid gap-4" :class="gridColsClass">
      <article
        v-for="service in services"
        :key="service.title"
        class="rounded-lg p-5"
        :style="cardStyle"
      >
        <div
          v-if="showIcon"
          class="grid size-10 place-items-center rounded-md"
          :style="iconTileStyle"
        >
          <IconGlyph :name="service.icon" class="size-5" />
        </div>
        <h3 class="mt-4 font-semibold" :style="{ color: headingColor }">
          {{ service.title }}
        </h3>
        <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
          {{ service.description }}
        </p>
        <a
          v-if="showCta && service.link"
          :href="service.link"
          class="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
          :style="{ color: accentTextColor }"
        >
          Learn more
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </a>
      </article>
    </div>
  </div>
</template>
