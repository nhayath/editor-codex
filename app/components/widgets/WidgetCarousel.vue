<script setup lang="ts">
import type { SurfaceBackgroundConfig } from '~~/types/template'
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  slides?: string
  variant?: string
  accent?: string
  background?: SurfaceBackgroundConfig | string
  align?: string
  slidesPerView?: string
  imageRatio?: string
  showCta?: boolean
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
  autoplay?: boolean
  autoplaySpeed?: number
  data?: Record<string, any>
}>(), {
  eyebrow: 'Featured',
  title: 'Community highlights',
  subtitle: '',
  slides: '',
  variant: 'single-slide',
  accent: 'primary',
  background: () => ({ type: 'theme' }),
  align: 'left',
  slidesPerView: '1',
  imageRatio: 'landscape',
  showCta: true,
  showArrows: true,
  showDots: true,
  loop: true,
  autoplay: true,
  autoplaySpeed: 5000,
  data: () => ({})
})

interface Slide {
  title: string
  subtitle: string
  imageUrl: string
  link: string
  buttonLabel: string
}

// ----- Feature panels ---------------------------------------------------
// The `feature` variant pairs an ayah / message panel (left) with a live
// widget (right). Slide format, pipe-separated, one per line:
//   panel | eyebrow | title | arabic | translation | reference | link | button | bg | tint
// where panel ∈ prayer | donation | events | none, bg ∈ '' (auto) |
// 'pattern:<id>' | 'image:<url>', and tint ∈ '' (auto) | primary | gold | ink.
interface FeatureSlide {
  panel: string
  eyebrow: string
  title: string
  arabic: string
  translation: string
  reference: string
  link: string
  buttonLabel: string
  bg: string
  tint: string
  i?: number
}

const featureFallback: FeatureSlide[] = [
  {
    panel: 'prayer',
    eyebrow: 'The weight of salah',
    title: 'Anchor your day in prayer',
    arabic: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
    translation: 'Indeed, prayer restrains from shameful and unjust deeds.',
    reference: "Qur'an 29:45",
    link: '#prayer-times',
    buttonLabel: 'View timetable',
    bg: '',
    tint: ''
  },
  {
    panel: 'donation',
    eyebrow: 'Sadaqah jariyah',
    title: 'Give, and watch it multiply',
    arabic: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ',
    translation: 'The likeness of those who spend in the way of Allah is as a grain that grows seven ears.',
    reference: "Qur'an 2:261",
    link: '',
    buttonLabel: '',
    bg: '',
    tint: ''
  },
  {
    panel: 'events',
    eyebrow: 'This week',
    title: 'Happening at the mosque',
    arabic: '',
    translation: 'Classes, halaqas, and community gatherings throughout the week.',
    reference: '',
    link: '#events',
    buttonLabel: 'See all events',
    bg: '',
    tint: ''
  }
]

const featureItems = computed<FeatureSlide[]>(() => {
  const parsed = parsePipeRows(props.slides, 10)
  const base = !parsed.length
    ? featureFallback
    : parsed.map(row => ({
        panel: (row[0] ?? 'none').toLowerCase(),
        eyebrow: row[1] ?? '',
        title: row[2] ?? '',
        arabic: row[3] ?? '',
        translation: row[4] ?? '',
        reference: row[5] ?? '',
        link: row[6] ?? '',
        buttonLabel: row[7] ?? '',
        bg: row[8] ?? '',
        tint: row[9] ?? ''
      }))
  return base.map((slide, i) => ({ ...slide, i }))
})

// Feature slides ride on dark, geometric-patterned (or image) panels so the
// carousel reads as a richer, prayer-forward band. Each slide can pin its own
// pattern/image + tint; blanks fall back to a cycle by slide index.
const FEATURE_PATTERNS = [
  '/backgrounds/rosette-bloom.svg',
  '/backgrounds/eight-point-star.svg',
  '/backgrounds/girih-diamonds.svg'
]
const FEATURE_TINTS = [
  'var(--color-primary)',
  'color-mix(in srgb, var(--color-primary) 68%, var(--color-secondary))',
  'color-mix(in srgb, var(--color-primary) 70%, var(--color-text))'
]
function resolveTint(tint: string, i: number) {
  switch (tint) {
    case 'primary': return 'var(--color-primary)'
    case 'gold': return 'color-mix(in srgb, var(--color-primary) 68%, var(--color-secondary))'
    case 'ink': return 'color-mix(in srgb, var(--color-primary) 70%, var(--color-text))'
    default: return FEATURE_TINTS[i % FEATURE_TINTS.length]
  }
}
function isImageBg(item: FeatureSlide) {
  return item.bg.startsWith('image:')
}
function featureRootStyle(item: FeatureSlide) {
  const i = item.i ?? 0
  if (isImageBg(item)) {
    const url = item.bg.slice(6)
    return {
      backgroundImage: `linear-gradient(120deg, rgba(6,13,24,0.86), rgba(6,13,24,0.55)), url("${url}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  const tint = resolveTint(item.tint, i)
  return {
    background: `linear-gradient(135deg, color-mix(in srgb, ${tint} 90%, #060d18), color-mix(in srgb, ${tint} 60%, #060d18))`
  }
}
function featurePatternStyle(item: FeatureSlide) {
  if (isImageBg(item)) return null
  const i = item.i ?? 0
  const url = item.bg.startsWith('pattern:')
    ? `/backgrounds/${item.bg.slice(8)}.svg`
    : FEATURE_PATTERNS[i % FEATURE_PATTERNS.length]
  return {
    maskImage: `url("${url}")`,
    WebkitMaskImage: `url("${url}")`,
    maskSize: '184px',
    WebkitMaskSize: '184px',
    maskRepeat: 'repeat',
    WebkitMaskRepeat: 'repeat'
  }
}

// The events panel shows only the latest event, as a compact thumbnail card.
const latestEvent = computed(() => {
  const list = (props.data?.events ?? []) as Array<Record<string, any>>
  return list[0] ?? null
})
function eventDate(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
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

const surface = useSurfaceBackground(normalizedBackground, { accent: accentVar })
const {
  presentation,
  isTheme,
  patternStyle,
  useLightText,
  headingColor,
  mutedColor,
  hairlineColor
} = surface

const containerStyle = computed(() => isTheme.value ? patternStyle.value : presentation.value.style)

const eyebrowColor = computed(() => useLightText.value ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)')
const cardBg = computed(() => useLightText.value ? 'rgba(255,255,255,0.1)' : 'var(--color-surface)')
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
  if (props.variant === 'single-slide' || props.variant === 'split' || props.variant === 'minimal' || props.variant === 'feature') {
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
    :class="[isTheme ? '' : 'rounded-2xl p-8', presentation.className]"
    :style="containerStyle"
    data-testid="carousel-widget"
    :data-carousel-variant="variant"
  >
    <div v-if="eyebrow || title || subtitle" :class="headerAlignClass">
      <p v-if="eyebrow" class="text-sm font-semibold" :style="{ color: eyebrowColor }">
        {{ eyebrow }}
      </p>
      <h2 v-if="title" class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-3 leading-7" :style="{ color: mutedColor }">
        {{ subtitle }}
      </p>
    </div>

    <UCarousel
      v-slot="{ item }"
      :items="variant === 'feature' ? featureItems : items"
      :arrows="showArrows"
      :dots="showDots"
      :loop="loop"
      :autoplay="autoplayConfig"
      :ui="variant === 'feature' ? { item: basisClass, container: 'items-stretch' } : { item: basisClass }"
      class="min-w-0 overflow-hidden rounded-lg"
    >
      <!-- Feature: ayah / message panel paired with a live widget, on an
           alternating dark, geometric-patterned panel (equal height). -->
      <div
        v-if="variant === 'feature'"
        class="relative isolate mx-2 flex h-full min-h-[22rem] overflow-hidden rounded-2xl @md:min-h-[24rem]"
        :style="featureRootStyle(item)"
      >
        <div
          v-if="featurePatternStyle(item)"
          class="pointer-events-none absolute inset-0 opacity-[0.08]"
          :style="{ background: 'rgba(255,255,255,0.92)', ...featurePatternStyle(item) }"
        />
        <div
          class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-40"
          :style="{ background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)' }"
        />

        <div
          class="relative grid w-full items-center gap-6 p-6 @md:p-9"
          :class="item.panel && item.panel !== 'none' ? '@2xl:grid-cols-2' : ''"
        >
          <!-- left: ayah / message -->
          <div class="flex flex-col gap-3">
            <p v-if="item.eyebrow" class="text-xs font-semibold uppercase tracking-[0.18em]" style="color: var(--color-secondary)">
              {{ item.eyebrow }}
            </p>
            <h3 v-if="item.title" class="tenant-heading text-2xl font-bold text-[var(--color-surface)] @xl:text-4xl">
              {{ item.title }}
            </h3>
            <p v-if="item.arabic" dir="rtl" lang="ar" class="tenant-heading text-2xl leading-loose text-[var(--color-surface)] @md:text-3xl">
              {{ item.arabic }}
            </p>
            <p v-if="item.translation" class="leading-7 text-[color:color-mix(in_srgb,var(--color-surface)_75%,transparent)]">
              &ldquo;{{ item.translation }}&rdquo;
            </p>
            <p v-if="item.reference" class="text-sm font-semibold" style="color: var(--color-secondary)">
              {{ item.reference }}
            </p>
            <a
              v-if="showCta && item.link"
              :href="item.link"
              class="mt-1 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-surface)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-surface)_25%,transparent)]"
              style="background: rgba(255,255,255,0.16)"
            >
              {{ item.buttonLabel || 'Learn more' }}
              <UIcon name="i-lucide-arrow-right" class="size-4" />
            </a>
          </div>

          <!-- right: live widget -->
          <div v-if="item.panel && item.panel !== 'none'" class="min-w-0">
            <WidgetPrayerCountdown
              v-if="item.panel === 'prayer'"
              variant="card"
              background="gradient"
              title="Next iqamah"
              :show-progress="true"
              :data="data"
            />
            <WidgetDonationCta
              v-else-if="item.panel === 'donation'"
              variant="compact"
              background="surface"
              :show-amounts="true"
              :data="data"
            />
            <!-- events: latest only, compact thumbnail card -->
            <div
              v-else-if="item.panel === 'events'"
              class="rounded-xl p-4"
              style="background: rgba(255,255,255,0.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16)"
            >
              <template v-if="latestEvent">
                <div class="flex items-center gap-4">
                  <img
                    v-if="latestEvent.imageUrl"
                    :src="latestEvent.imageUrl"
                    :alt="latestEvent.title"
                    class="size-16 shrink-0 rounded-lg object-cover @sm:size-20"
                  >
                  <div
                    v-else
                    class="grid size-16 shrink-0 place-items-center rounded-lg @sm:size-20"
                    style="background: rgba(255,255,255,0.16)"
                  >
                    <UIcon name="i-lucide-calendar-days" class="size-7 text-[var(--color-surface)]" />
                  </div>
                  <div class="min-w-0">
                    <p v-if="latestEvent.category" class="text-xs font-semibold uppercase tracking-wide" style="color: var(--color-secondary)">
                      {{ latestEvent.category }}
                    </p>
                    <h4 class="mt-0.5 truncate text-base font-bold text-[var(--color-surface)] @sm:text-lg">
                      {{ latestEvent.title }}
                    </h4>
                    <p v-if="latestEvent.description" class="mt-1 line-clamp-2 text-sm text-[color:color-mix(in_srgb,var(--color-surface)_70%,transparent)]">
                      {{ latestEvent.description }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:color-mix(in_srgb,var(--color-surface)_70%,transparent)]">
                  <span v-if="latestEvent.date" class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-calendar-days" class="size-4" style="color: var(--color-secondary)" />
                    {{ eventDate(latestEvent.date) }}
                  </span>
                  <span v-if="latestEvent.location" class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-map-pin" class="size-4" style="color: var(--color-secondary)" />
                    {{ latestEvent.location }}
                  </span>
                </div>
              </template>
              <p v-else class="text-sm text-[color:color-mix(in_srgb,var(--color-surface)_70%,transparent)]">
                No upcoming events.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards: image-topped content card -->
      <div
        v-else-if="variant === 'cards'"
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
            :style="{ color: useLightText ? '#fff' : accentVar }"
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
            :style="useLightText
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
          :style="useLightText
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
        <div class="relative flex min-h-96 max-w-2xl flex-col justify-end p-8 text-[var(--color-surface)]">
          <h3 class="tenant-heading text-4xl font-bold">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-lg text-[color:color-mix(in_srgb,var(--color-surface)_85%,transparent)]">
            {{ item.subtitle }}
          </p>
          <a
            v-if="slideHref(item)"
            :href="slideHref(item)"
            class="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--color-surface)] backdrop-blur transition hover:bg-[color:color-mix(in_srgb,var(--color-surface)_30%,transparent)]"
          >
            {{ item.buttonLabel || 'Learn more' }}
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </a>
        </div>
      </article>
    </UCarousel>
  </div>
</template>
