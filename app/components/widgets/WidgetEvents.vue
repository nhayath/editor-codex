<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  variant?: string
  maxItems?: number
  accent?: string
  background?: string
  columns?: string
  align?: string
  imageRatio?: string
  showImage?: boolean
  showCategory?: boolean
  showDate?: boolean
  showLocation?: boolean
  showDescription?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Upcoming events',
  eyebrow: 'Programmes',
  variant: 'grid',
  maxItems: 3,
  accent: 'primary',
  background: 'surface',
  columns: '3',
  align: 'left',
  imageRatio: 'landscape',
  showImage: true,
  showCategory: true,
  showDate: true,
  showLocation: true,
  showDescription: true,
  data: () => ({})
})

interface EventItem {
  id?: string | number
  title?: string
  description?: string
  date?: string
  endDate?: string
  location?: string
  imageUrl?: string
  category?: string
}

const events = computed<EventItem[]>(() => (props.data?.events ?? []).slice(0, props.maxItems))
const hasEvents = computed(() => events.value.length > 0)

function hasImage(e: EventItem) {
  return props.showImage && !!e.imageUrl
}

function formatDate(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

function dateLabel(e: EventItem) {
  const start = formatDate(e.date)
  const end = e.endDate ? formatDate(e.endDate) : ''
  return end && end !== start ? `${start} – ${end}` : start
}

// Compact day/month badge for the agenda variant.
function dayPart(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(new Date(value))
}
function monthPart(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(value))
}

// Accent + background system, mirrored from the services/prayer/jummah widgets.
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

const imageTileStyle = computed(() => isFilled.value
  ? { background: 'rgba(255,255,255,0.16)', color: '#fff' }
  : { background: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))', color: accentVar.value })

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

// Feature variant: first event spotlighted, the rest beneath.
const featured = computed(() => events.value[0] ?? null)
const rest = computed(() => events.value.slice(1))
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
    <p v-if="!hasEvents" class="text-sm" :style="{ color: mutedColor }">
      No upcoming events.
    </p>

    <!-- Image cards -->
    <div v-else-if="variant === 'cards'" class="grid gap-5" :class="gridColsClass">
      <article
        v-for="event in events"
        :key="event.id ?? event.title"
        class="flex flex-col overflow-hidden rounded-xl"
        :style="cardStyle"
      >
        <img
          v-if="hasImage(event)"
          :src="event.imageUrl"
          :alt="event.title"
          class="w-full object-cover"
          :class="imageRatioClass"
        >
        <div
          v-else
          class="grid w-full place-items-center"
          :class="imageRatioClass"
          :style="imageTileStyle"
        >
          <UIcon name="i-lucide-calendar-days" class="size-10" />
        </div>
        <div class="flex flex-1 flex-col p-5">
          <UBadge v-if="showCategory" color="primary" variant="soft" class="w-fit">
            {{ event.category || 'Event' }}
          </UBadge>
          <h3 class="mt-3 text-lg font-semibold" :style="{ color: headingColor }">
            {{ event.title }}
          </h3>
          <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
            {{ event.description }}
          </p>
          <div class="mt-4 grid gap-2 text-sm" :style="{ color: mutedColor }">
            <span v-if="showDate && event.date" class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar-days" class="size-4" :style="{ color: accentTextColor }" />
              {{ dateLabel(event) }}
            </span>
            <span v-if="showLocation && event.location" class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="size-4" :style="{ color: accentTextColor }" />
              {{ event.location }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Feature: first event spotlighted, the rest in a grid -->
    <div v-else-if="variant === 'feature'" class="grid gap-5">
      <article
        v-if="featured"
        class="grid gap-0 overflow-hidden rounded-2xl @2xl:grid-cols-2"
        :style="cardStyle"
      >
        <img
          v-if="hasImage(featured)"
          :src="featured.imageUrl"
          :alt="featured.title"
          class="h-full min-h-48 w-full object-cover"
        >
        <div
          v-else
          class="grid min-h-48 w-full place-items-center"
          :style="imageTileStyle"
        >
          <UIcon name="i-lucide-calendar-days" class="size-14" />
        </div>
        <div class="flex flex-col justify-center p-7">
          <UBadge v-if="showCategory" color="primary" variant="soft" class="w-fit">
            {{ featured.category || 'Event' }}
          </UBadge>
          <h3 class="mt-3 text-2xl font-bold" :style="{ color: headingColor }">
            {{ featured.title }}
          </h3>
          <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
            {{ featured.description }}
          </p>
          <div class="mt-4 grid gap-2 text-sm" :style="{ color: mutedColor }">
            <span v-if="showDate && featured.date" class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar-days" class="size-4" :style="{ color: accentTextColor }" />
              {{ dateLabel(featured) }}
            </span>
            <span v-if="showLocation && featured.location" class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="size-4" :style="{ color: accentTextColor }" />
              {{ featured.location }}
            </span>
          </div>
        </div>
      </article>

      <div v-if="rest.length" class="grid gap-4" :class="gridColsClass">
        <article
          v-for="event in rest"
          :key="event.id ?? event.title"
          class="rounded-lg p-5"
          :style="cardStyle"
        >
          <UBadge v-if="showCategory" color="primary" variant="soft" class="w-fit">
            {{ event.category || 'Event' }}
          </UBadge>
          <h3 class="mt-3 font-semibold" :style="{ color: headingColor }">
            {{ event.title }}
          </h3>
          <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
            {{ event.description }}
          </p>
          <div class="mt-3 grid gap-2 text-sm" :style="{ color: mutedColor }">
            <span v-if="showDate && event.date" class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar-days" class="size-4" :style="{ color: accentTextColor }" />
              {{ dateLabel(event) }}
            </span>
            <span v-if="showLocation && event.location" class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="size-4" :style="{ color: accentTextColor }" />
              {{ event.location }}
            </span>
          </div>
        </article>
      </div>
    </div>

    <!-- Agenda: horizontal rows with a day/month badge -->
    <div v-else-if="variant === 'agenda'" class="grid gap-3">
      <article
        v-for="event in events"
        :key="event.id ?? event.title"
        class="flex items-start gap-4 rounded-lg p-4"
        :style="cardStyle"
      >
        <div
          class="grid size-16 shrink-0 place-items-center rounded-md leading-none"
          :style="imageTileStyle"
        >
          <span class="text-xl font-bold">{{ dayPart(event.date) }}</span>
          <span class="text-xs font-semibold uppercase">{{ monthPart(event.date) }}</span>
        </div>
        <img
          v-if="hasImage(event)"
          :src="event.imageUrl"
          :alt="event.title"
          class="size-16 shrink-0 rounded-md object-cover"
        >
        <div class="min-w-0 flex-1">
          <UBadge v-if="showCategory" color="primary" variant="soft" class="w-fit">
            {{ event.category || 'Event' }}
          </UBadge>
          <h3 class="mt-2 font-semibold" :style="{ color: headingColor }">
            {{ event.title }}
          </h3>
          <p v-if="showDescription" class="mt-1 text-sm leading-6" :style="{ color: mutedColor }">
            {{ event.description }}
          </p>
          <span v-if="showLocation && event.location" class="mt-2 flex items-center gap-2 text-sm" :style="{ color: mutedColor }">
            <UIcon name="i-lucide-map-pin" class="size-4" :style="{ color: accentTextColor }" />
            {{ event.location }}
          </span>
        </div>
      </article>
    </div>

    <!-- List -->
    <div v-else-if="variant === 'list'" class="grid gap-3">
      <article
        v-for="event in events"
        :key="event.id ?? event.title"
        class="rounded-lg p-5"
        :style="cardStyle"
      >
        <UBadge v-if="showCategory" color="primary" variant="soft" class="w-fit">
          {{ event.category || 'Event' }}
        </UBadge>
        <h3 class="mt-3 text-lg font-semibold" :style="{ color: headingColor }">
          {{ event.title }}
        </h3>
        <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
          {{ event.description }}
        </p>
        <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm" :style="{ color: mutedColor }">
          <span v-if="showDate && event.date" class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-days" class="size-4" :style="{ color: accentTextColor }" />
            {{ dateLabel(event) }}
          </span>
          <span v-if="showLocation && event.location" class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="size-4" :style="{ color: accentTextColor }" />
            {{ event.location }}
          </span>
        </div>
      </article>
    </div>

    <!-- Grid (default, legacy ring cards) -->
    <div v-else class="grid gap-4" :class="gridColsClass">
      <article
        v-for="event in events"
        :key="event.id ?? event.title"
        class="rounded-lg p-5"
        :style="cardStyle"
      >
        <UBadge v-if="showCategory" color="primary" variant="soft" class="w-fit">
          {{ event.category || 'Event' }}
        </UBadge>
        <h3 class="mt-4 text-lg font-semibold" :style="{ color: headingColor }">
          {{ event.title }}
        </h3>
        <p v-if="showDescription" class="mt-2 text-sm leading-6" :style="{ color: mutedColor }">
          {{ event.description }}
        </p>
        <div class="mt-4 grid gap-2 text-sm" :style="{ color: mutedColor }">
          <span v-if="showDate && event.date" class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-days" class="size-4" :style="{ color: accentTextColor }" />
            {{ dateLabel(event) }}
          </span>
          <span v-if="showLocation && event.location" class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="size-4" :style="{ color: accentTextColor }" />
            {{ event.location }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>
