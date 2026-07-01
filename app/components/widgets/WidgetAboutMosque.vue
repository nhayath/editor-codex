<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'
import type { SurfaceBackgroundConfig } from '~~/types/template'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  body?: string
  imageUrl?: string
  imagePosition?: string
  variant?: string
  accent?: string
  // Unified background config. Legacy string values ('surface'/'solid'/
  // 'gradient') from older saved drafts are normalised below.
  background?: SurfaceBackgroundConfig | string
  align?: string
  imageRatio?: string
  showImage?: boolean
  showStats?: boolean
  stats?: string
  ctaLabel?: string
  ctaUrl?: string
}>(), {
  title: 'About our mosque',
  eyebrow: 'About',
  body: '<p>Our mosque is a place of worship, learning, service, and community belonging.</p>',
  imageUrl: '',
  imagePosition: 'right',
  variant: 'split',
  accent: 'primary',
  background: () => ({ type: 'theme' }),
  align: 'left',
  imageRatio: 'landscape',
  showImage: true,
  showStats: false,
  stats: '',
  ctaLabel: '',
  ctaUrl: ''
})

const stats = computed(() => parsePipeRows(props.stats, 2)
  .map(([value, label]) => ({ value, label }))
  .filter(s => s.value || s.label))
const hasStats = computed(() => props.showStats && stats.value.length > 0)
const hasCta = computed(() => Boolean(props.ctaLabel && props.ctaUrl))
const resolvedImage = computed(() => props.imageUrl || '/templates/mosque-hero-2.svg')
const showImage = computed(() => props.showImage && props.variant !== 'statement')

const ratioClass = computed(() => {
  switch (props.imageRatio) {
    case 'square': return 'aspect-square'
    case 'portrait': return 'aspect-[3/4]'
    default: return 'aspect-[4/3]'
  }
})

// ----- Shared accent / background system --------------------------------
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

// Normalise legacy string backgrounds ('surface'/'solid'/'gradient') onto the
// unified SurfaceBackgroundConfig. 'surface' → theme (the legacy transparent
// section); the filled variants map to solid/gradient with the accent colour.
const normalizedBackground = computed<SurfaceBackgroundConfig>(() => {
  const bg = props.background
  if (bg && typeof bg === 'object') return bg
  switch (bg) {
    case 'solid':
      return { type: 'solid', color: accentVar.value }
    case 'gradient':
      return { type: 'gradient', from: accentVar.value, to: `color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary))`, angle: 135 }
    default:
      return { type: 'theme' }
  }
})

// Contrast-correct colour set shared with every unified-background widget.
const surface = useSurfaceBackground(normalizedBackground, { accent: accentVar })
const {
  presentation,
  isTheme,
  patternStyle,
  useLightText,
  headingColor,
  mutedColor,
  accentTextColor,
  hairlineColor
} = surface

// Theme keeps the legacy transparent section; any fill paints via the shared
// presentation (className carries the pattern layer when relevant). A pattern
// overlay must still show over the theme base, so merge its CSS vars there.
const containerStyle = computed(() => isTheme.value ? patternStyle.value : presentation.value.style)

// Image frame ring/card.
const frameStyle = computed(() =>
  useLightText.value
    ? { background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' }
    : { background: 'var(--color-surface)', boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` }
)

// Stat chip surface.
const statStyle = computed(() =>
  useLightText.value
    ? { background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' }
    : { background: 'color-mix(in srgb, var(--color-surface) 92%, var(--color-bg))', boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` }
)

const ctaStyle = computed(() =>
  useLightText.value
    ? { background: '#fff', color: accentVar.value }
    : { background: accentVar.value, color: '#fff' }
)

const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')
const orderClass = computed(() => props.imagePosition === 'left' ? '@xl:[&>*:first-child]:order-2' : '')
const padded = computed(() => isTheme.value ? '' : 'rounded-lg p-6')
</script>

<template>
  <div class="@container h-full overflow-hidden" :class="[padded, presentation.className]" :style="containerStyle">
    <!-- ===== STACKED ===== -->
    <div v-if="variant === 'stacked'" :class="alignClass">
      <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
        {{ eyebrow }}
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
        {{ title }}
      </h2>
      <div
        class="rich-content mx-auto mt-4 max-w-2xl"
        :class="align === 'center' ? '' : 'mx-0'"
        :style="{ color: mutedColor }"
        v-html="body"
      />
      <div
        v-if="hasStats"
        class="mt-6 flex flex-wrap gap-3"
        :class="align === 'center' ? 'justify-center' : ''"
      >
        <div v-for="(s, i) in stats" :key="i" class="rounded-lg px-4 py-3 text-center" :style="statStyle">
          <div class="text-xl font-bold" :style="{ color: headingColor }">
            {{ s.value }}
          </div>
          <div class="text-xs" :style="{ color: mutedColor }">
            {{ s.label }}
          </div>
        </div>
      </div>
      <a
        v-if="hasCta"
        :href="ctaUrl"
        class="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :style="ctaStyle"
      >
        {{ ctaLabel }}
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </a>
      <div
        v-if="showImage"
        class="mt-8 overflow-hidden rounded-lg"
        :style="frameStyle"
      >
        <img :src="resolvedImage" :alt="title" class="w-full object-cover" :class="ratioClass">
      </div>
    </div>

    <!-- ===== OVERLAY ===== -->
    <div
      v-else-if="variant === 'overlay'"
      class="relative overflow-hidden rounded-lg"
    >
      <img :src="resolvedImage" :alt="title" class="absolute inset-0 size-full object-cover" :class="showImage ? '' : 'hidden'">
      <div class="absolute inset-0" :style="{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-text) 20%, transparent), color-mix(in srgb, var(--color-text) 78%, transparent))' }" />
      <div class="relative p-8 @xl:p-12" :class="alignClass">
        <p class="text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-surface)_80%,transparent)]">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-surface)] @xl:text-4xl">
          {{ title }}
        </h2>
        <div class="rich-content mt-4 max-w-2xl text-[color:color-mix(in_srgb,var(--color-surface)_85%,transparent)]" :class="align === 'center' ? 'mx-auto' : ''" v-html="body" />
        <div
          v-if="hasStats"
          class="mt-6 flex flex-wrap gap-3"
          :class="align === 'center' ? 'justify-center' : ''"
        >
          <div v-for="(s, i) in stats" :key="i" class="rounded-lg bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] px-4 py-3 text-center ring-1 ring-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)]">
            <div class="text-xl font-bold text-[var(--color-surface)]">
              {{ s.value }}
            </div>
            <div class="text-xs text-[color:color-mix(in_srgb,var(--color-surface)_75%,transparent)]">
              {{ s.label }}
            </div>
          </div>
        </div>
        <a
          v-if="hasCta"
          :href="ctaUrl"
          class="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-5 py-2.5 text-sm font-semibold"
          :style="{ color: accentVar }"
        >
          {{ ctaLabel }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </a>
      </div>
    </div>

    <!-- ===== STATEMENT ===== -->
    <div v-else-if="variant === 'statement'" class="mx-auto max-w-3xl" :class="alignClass">
      <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
        {{ eyebrow }}
      </p>
      <h2 class="tenant-heading mt-3 text-3xl font-bold @xl:text-4xl" :style="{ color: headingColor }">
        {{ title }}
      </h2>
      <div
        class="rich-content mt-5 text-lg @xl:text-xl"
        :class="align === 'center' ? 'mx-auto' : ''"
        :style="{ color: mutedColor }"
        v-html="body"
      />
      <div
        v-if="hasStats"
        class="mt-7 flex flex-wrap gap-3"
        :class="align === 'center' ? 'justify-center' : ''"
      >
        <div v-for="(s, i) in stats" :key="i" class="rounded-lg px-5 py-4 text-center" :style="statStyle">
          <div class="text-2xl font-bold" :style="{ color: headingColor }">
            {{ s.value }}
          </div>
          <div class="text-xs" :style="{ color: mutedColor }">
            {{ s.label }}
          </div>
        </div>
      </div>
      <a
        v-if="hasCta"
        :href="ctaUrl"
        class="mt-7 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        :style="ctaStyle"
      >
        {{ ctaLabel }}
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </a>
    </div>

    <!-- ===== SPLIT (default/legacy) + FEATURE ===== -->
    <div
      v-else
      class="grid items-center gap-8"
      :class="[showImage ? '@xl:grid-cols-2' : '', showImage ? orderClass : '']"
    >
      <div :class="alignClass">
        <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
          {{ title }}
        </h2>
        <div
          class="rich-content mt-4"
          :class="align === 'center' ? 'mx-auto' : ''"
          :style="{ color: mutedColor }"
          v-html="body"
        />
        <div
          v-if="hasStats"
          class="mt-6 grid grid-cols-3 gap-3"
        >
          <div v-for="(s, i) in stats" :key="i" class="rounded-lg px-3 py-3 text-center" :style="statStyle">
            <div class="text-lg font-bold" :style="{ color: variant === 'feature' ? accentTextColor : headingColor }">
              {{ s.value }}
            </div>
            <div class="text-xs" :style="{ color: mutedColor }">
              {{ s.label }}
            </div>
          </div>
        </div>
        <a
          v-if="hasCta"
          :href="ctaUrl"
          class="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
          :style="ctaStyle"
        >
          {{ ctaLabel }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </a>
      </div>

      <div
        v-if="showImage"
        class="overflow-hidden rounded-lg"
        :style="frameStyle"
      >
        <img :src="resolvedImage" :alt="title" class="w-full object-cover" :class="ratioClass">
      </div>
    </div>
  </div>
</template>
