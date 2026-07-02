<script setup lang="ts">
import type { SurfaceBackgroundConfig } from '~~/types/template'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  variant?: string
  accent?: string
  background?: SurfaceBackgroundConfig | string
  align?: string
  showIcon?: boolean
  showLabel?: boolean
  showLocation?: boolean
  highlightNext?: boolean
  countdown?: boolean
  data?: Record<string, any>
}>(), {
  title: "Jumu'ah prayers",
  subtitle: '',
  variant: 'card',
  accent: 'primary',
  background: () => ({ type: 'theme' }),
  align: 'left',
  showIcon: true,
  showLabel: true,
  showLocation: true,
  highlightNext: true,
  countdown: false,
  data: () => ({})
})

interface JummahRow {
  id: string
  label: string
  time: string
  location?: string
  sec: number | null
  isNext: boolean
  passed: boolean
}

// Live clock, refreshed every second so the countdown ticks and the
// "next" highlight stays current through Friday.
const now = ref<Date | null>(null)
function tick() {
  now.value = new Date()
}
onMounted(() => {
  tick()
  const interval = window.setInterval(tick, 1000)
  onBeforeUnmount(() => window.clearInterval(interval))
})

const isFriday = computed(() => now.value?.getDay() === 5)
const secondsNow = computed(() => {
  const d = now.value
  if (!d) return null
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
})

function toSeconds(value?: string) {
  if (!value) return null
  const parts = value.split(':').map(Number)
  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60
}

const rawRows = computed(() => (props.data?.jummahTimes ?? []) as Array<Record<string, any>>)

// Index of the next upcoming slot — only meaningful on Fridays.
const nextIndex = computed(() => {
  if (!props.highlightNext || !isFriday.value) return -1
  const cur = secondsNow.value
  if (cur === null) return -1
  let idx = -1
  rawRows.value.forEach((item, i) => {
    if (idx !== -1) return
    const sec = toSeconds(item.time)
    if (sec !== null && sec >= cur) idx = i
  })
  return idx
})

const rows = computed<JummahRow[]>(() =>
  rawRows.value.map((item, i) => {
    const sec = toSeconds(item.time)
    const cur = secondsNow.value
    const onFriday = props.highlightNext && isFriday.value
    return {
      id: item.id ?? String(i),
      label: item.label || 'Jumuah',
      time: item.time,
      location: item.location,
      sec,
      isNext: onFriday && i === nextIndex.value,
      passed: onFriday && cur !== null && sec !== null && sec < cur
    }
  })
)

const hasRows = computed(() => rows.value.length > 0)

// Featured slot for the `feature` variant: the next upcoming one on Friday,
// otherwise simply the first slot.
const featured = computed(() => {
  const list = rows.value
  if (!list.length) return null
  const next = list.find(r => r.isNext)
  return next ?? list[0]
})
const others = computed(() => rows.value.filter(r => r !== featured.value))

const remainingToNext = computed(() => {
  const cur = secondsNow.value
  const next = rows.value.find(r => r.isNext)
  if (!next || cur === null || next.sec === null) return null
  return next.sec - cur
})

const countdownLabel = computed(() => {
  const r = remainingToNext.value
  if (r === null) return null
  if (r < 60) return 'Starting soon'
  const h = Math.floor(r / 3600)
  const m = Math.floor((r % 3600) / 60)
  return h > 0 ? `in ${h}h ${m}m` : `in ${m} min`
})

// Quiet context note shown under the title.
const contextNote = computed(() => {
  if (props.subtitle) return props.subtitle
  if (!props.highlightNext) return ''
  if (isFriday.value) {
    return countdownLabel.value && props.countdown ? `Next ${countdownLabel.value}` : 'Today'
  }
  return 'This Friday'
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
  accentTextColor,
  hairlineColor
} = surface

const containerStyle = computed(() => {
  if (!isTheme.value) return presentation.value.style
  return {
    background: 'var(--color-surface)',
    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)',
    ...patternStyle.value
  }
})

const timeColor = computed(() => useLightText.value ? '#fff' : accentVar.value)
const railColor = computed(() => useLightText.value ? 'rgba(255,255,255,0.3)' : 'color-mix(in srgb, var(--color-text) 18%, transparent)')

const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')

function highlightStyle(row: JummahRow) {
  if (!row.isNext) return {}
  return {
    background: useLightText.value
      ? 'rgba(255,255,255,0.15)'
      : `color-mix(in srgb, ${accentVar.value} 8%, var(--color-surface))`
  }
}
</script>

<template>
  <div
    class="@container h-full overflow-hidden rounded-lg p-6"
    :class="presentation.className"
    :style="containerStyle"
  >
    <!-- Header -->
    <div class="mb-5 flex items-start justify-between gap-4" :class="alignClass">
      <div :class="{ 'mx-auto': align === 'center' }">
        <h3 class="tenant-heading text-2xl font-bold" :style="{ color: headingColor }">
          {{ title }}
        </h3>
        <p v-if="contextNote" class="mt-0.5 text-sm" :style="{ color: mutedColor }">
          {{ contextNote }}
        </p>
      </div>
      <UIcon
        v-if="showIcon"
        name="i-lucide-calendar-clock"
        class="size-6 shrink-0"
        :style="{ color: accentTextColor }"
      />
    </div>

    <!-- Empty state -->
    <p v-if="!hasRows" class="text-sm" :style="{ color: mutedColor }">
      No Jumu'ah times have been added yet.
    </p>

    <!-- Feature: first/next slot large, the rest as chips -->
    <template v-else-if="variant === 'feature'">
      <div
        class="rounded-lg p-5"
        :style="useLightText
          ? { background: 'rgba(255,255,255,0.12)' }
          : { background: `color-mix(in srgb, ${accentVar} 7%, var(--color-surface))`, boxShadow: `inset 0 0 0 1px ${hairlineColor}` }"
      >
        <div class="flex items-center justify-between gap-3">
          <p v-if="showLabel" class="font-semibold" :style="{ color: headingColor }">
            {{ featured?.label }}
          </p>
          <span
            v-if="featured?.isNext"
            class="rounded-full px-2 py-0.5 text-xs font-semibold"
            :style="{ background: hairlineColor, color: headingColor }"
          >
            {{ countdown && countdownLabel ? countdownLabel : 'Next' }}
          </span>
        </div>
        <p class="mt-1 text-4xl font-bold tabular-nums" :style="{ color: timeColor }">
          {{ featured?.time }}
        </p>
        <p
          v-if="showLocation && featured?.location"
          class="mt-1 text-sm"
          :style="{ color: mutedColor }"
        >
          {{ featured.location }}
        </p>
      </div>
      <div v-if="others.length" class="mt-3 flex flex-wrap gap-2">
        <div
          v-for="row in others"
          :key="row.id"
          class="rounded-md px-3 py-2 text-sm"
          :style="{ boxShadow: `inset 0 0 0 1px ${hairlineColor}`, opacity: row.passed ? 0.55 : 1 }"
        >
          <span v-if="showLabel" :style="{ color: mutedColor }">{{ row.label }} · </span>
          <span class="font-semibold tabular-nums" :style="{ color: headingColor }">{{ row.time }}</span>
        </div>
      </div>
    </template>

    <!-- Timeline: vertical rail with a dot marker per slot -->
    <template v-else-if="variant === 'timeline'">
      <ul class="space-y-0">
        <li
          v-for="(row, i) in rows"
          :key="row.id"
          class="relative flex gap-4 pb-5 last:pb-0"
        >
          <!-- rail -->
          <span
            v-if="i < rows.length - 1"
            class="absolute left-[7px] top-5 h-full w-px"
            :style="{ background: railColor }"
          />
          <span
            class="relative mt-1 size-3.5 shrink-0 rounded-full"
            :style="row.isNext
              ? { background: timeColor, boxShadow: `0 0 0 4px ${hairlineColor}` }
              : { background: 'transparent', boxShadow: `inset 0 0 0 2px ${railColor}`, opacity: row.passed ? 0.5 : 1 }"
          />
          <div class="flex-1" :style="{ opacity: row.passed ? 0.6 : 1 }">
            <div class="flex items-center justify-between gap-3">
              <p v-if="showLabel" class="font-semibold" :style="{ color: headingColor }">
                {{ row.label }}
                <span
                  v-if="row.isNext && countdown && countdownLabel"
                  class="ml-1 text-xs font-medium"
                  :style="{ color: mutedColor }"
                >{{ countdownLabel }}</span>
              </p>
              <p class="text-lg font-bold tabular-nums" :style="{ color: timeColor }">
                {{ row.time }}
              </p>
            </div>
            <p
              v-if="showLocation && row.location"
              class="mt-0.5 text-sm"
              :style="{ color: mutedColor }"
            >
              {{ row.location }}
            </p>
          </div>
        </li>
      </ul>
    </template>

    <!-- List: lightweight divided rows -->
    <template v-else-if="variant === 'list'">
      <ul>
        <li
          v-for="(row, i) in rows"
          :key="row.id"
          class="flex items-center justify-between gap-3 py-3"
          :class="i > 0 ? 'border-t' : ''"
          :style="{
            borderColor: hairlineColor,
            opacity: row.passed ? 0.55 : 1
          }"
        >
          <div>
            <p v-if="showLabel" class="font-semibold leading-tight" :style="{ color: headingColor }">
              {{ row.label }}
            </p>
            <p
              v-if="showLocation && row.location"
              class="text-sm"
              :style="{ color: mutedColor }"
            >
              {{ row.location }}
            </p>
          </div>
          <div class="flex items-center gap-2 text-right">
            <span
              v-if="row.isNext"
              class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :style="{ background: hairlineColor, color: headingColor }"
            >
              {{ countdown && countdownLabel ? countdownLabel : 'Next' }}
            </span>
            <p class="text-xl font-bold tabular-nums" :style="{ color: timeColor }">
              {{ row.time }}
            </p>
          </div>
        </li>
      </ul>
    </template>

    <!-- Card (default) -->
    <template v-else>
      <div class="grid gap-3">
        <div
          v-for="row in rows"
          :key="row.id"
          class="rounded-md p-4"
          :style="{ boxShadow: `inset 0 0 0 1px ${hairlineColor}`, ...highlightStyle(row), opacity: row.passed ? 0.6 : 1 }"
        >
          <div class="flex items-center justify-between gap-3">
            <p v-if="showLabel" class="font-semibold" :style="{ color: headingColor }">
              {{ row.label }}
              <span
                v-if="row.isNext"
                class="ml-1 rounded-full px-2 py-0.5 align-middle text-[11px] font-semibold"
                :style="{ background: hairlineColor, color: headingColor }"
              >
                {{ countdown && countdownLabel ? countdownLabel : 'Next' }}
              </span>
            </p>
            <p class="text-xl font-bold tabular-nums" :style="{ color: timeColor }">
              {{ row.time }}
            </p>
          </div>
          <p
            v-if="showLocation && row.location"
            class="mt-1 text-sm"
            :style="{ color: mutedColor }"
          >
            {{ row.location }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
