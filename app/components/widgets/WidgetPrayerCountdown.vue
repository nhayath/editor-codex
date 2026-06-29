<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { pageBackgroundPatterns } from '~/composables/usePageBackground'

const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  accent?: string
  background?: string
  texture?: string
  align?: string
  precision?: string
  showIqamah?: boolean
  showIcon?: boolean
  showDate?: boolean
  showProgress?: boolean
  /** @deprecated kept for backward-compat with saved configs; maps to the `minimal` variant. */
  compact?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Next prayer',
  variant: 'card',
  accent: 'primary',
  background: 'solid',
  texture: 'girih-diamonds',
  align: 'left',
  precision: 'minutes',
  showIqamah: true,
  showIcon: true,
  showDate: false,
  showProgress: true,
  compact: false,
  data: () => ({})
})

const prayers = [
  ['Fajr', 'fajr', 'fajrIqamah', 'i-lucide-sunrise'],
  ['Dhuhr', 'dhuhr', 'dhuhrIqamah', 'i-lucide-sun'],
  ['Asr', 'asr', 'asrIqamah', 'i-lucide-cloud-sun'],
  ['Maghrib', 'maghrib', 'maghribIqamah', 'i-lucide-sunset'],
  ['Isha', 'isha', 'ishaIqamah', 'i-lucide-moon-star']
] as const

// Effective variant: a legacy `compact` config (from older templates/tenants)
// resolves to `minimal` unless an explicit non-default variant was chosen.
const effectiveVariant = computed(() =>
  props.variant === 'card' && props.compact ? 'minimal' : props.variant
)

// Live clock, refreshed every second so the countdown ticks.
const now = ref<Date | null>(null)
function tick() {
  now.value = new Date()
}
onMounted(() => {
  tick()
  const interval = window.setInterval(tick, 1000)
  onBeforeUnmount(() => window.clearInterval(interval))
})

const secondsNow = computed(() => {
  const d = now.value
  if (!d) return null
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
})

function toSeconds(value?: string) {
  if (!value) return null
  const parts = value.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0
  return hours * 3600 + minutes * 60
}

const prayerData = computed(() => (props.data?.prayerTimes ?? {}) as Record<string, string | undefined>)

const next = computed(() => {
  const data = prayerData.value
  const cur = secondsNow.value
  let prevSec: number | null = null

  for (const [name, adhanKey, iqamahKey, icon] of prayers) {
    const adhanTime = data[adhanKey]
    const iqamahTime = data[iqamahKey]
    const value = props.showIqamah ? iqamahTime || adhanTime : adhanTime
    const total = toSeconds(value)
    if (total === null) continue
    const isJamaah = props.showIqamah && !!iqamahTime
    if (cur === null || total >= cur) {
      return { name, time: value ?? '--:--', adhanTime, iqamahTime, icon, target: total, prevSec, isJamaah, wrapped: false }
    }
    prevSec = total
  }

  // All of today's prayers have passed → next is tomorrow's first prayer.
  const [name, adhanKey, iqamahKey, icon] = prayers[0]
  const adhanTime = data[adhanKey]
  const iqamahTime = data[iqamahKey]
  const value = (props.showIqamah ? iqamahTime || adhanTime : adhanTime) ?? '--:--'
  const isJamaah = props.showIqamah && !!iqamahTime
  return { name, time: value, adhanTime, iqamahTime, icon, target: toSeconds(value), prevSec, isJamaah, wrapped: true }
})

// Seconds until the next prayer (handles the wrap past midnight).
const remaining = computed(() => {
  const cur = secondsNow.value
  const target = next.value.target
  if (cur === null || target === null) return null
  let diff = target - cur
  if (diff < 0) diff += 24 * 3600
  return diff
})

const countdownLabel = computed(() => {
  const r = remaining.value
  if (r === null) return 'Today'
  const h = Math.floor(r / 3600)
  const m = Math.floor((r % 3600) / 60)
  const s = r % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (props.precision === 'seconds') {
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
  }
  if (r < 60) return 'Starting soon'
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
})

const contextLabel = computed(() => {
  const verb = next.value.isJamaah ? 'Jamaah' : 'Adhan'
  return `${verb} in`
})

// Progress between the previous prayer and the next one.
const progress = computed(() => {
  const cur = secondsNow.value
  const target = next.value.target
  const prev = next.value.prevSec
  if (cur === null || target === null || prev === null || next.value.wrapped) return 0
  const span = target - prev
  if (span <= 0) return 0
  return Math.min(100, Math.max(0, ((cur - prev) / span) * 100))
})

const dateLabel = computed(() => prayerData.value.date)
const isFinalMinute = computed(() => {
  const value = remaining.value
  return value !== null && value < 60
})

const texturePattern = computed(() => {
  if (props.texture === 'none') return null
  return pageBackgroundPatterns.find(pattern => pattern.id === (props.texture || 'girih-diamonds'))
    ?? pageBackgroundPatterns.find(pattern => pattern.id === 'girih-diamonds')
    ?? null
})

const textureStyle = computed(() => {
  if (!texturePattern.value) return {}
  return {
    maskImage: `url("${texturePattern.value.url}")`,
    WebkitMaskImage: `url("${texturePattern.value.url}")`
  } satisfies CSSProperties
})

// Accent + background system, mirrored from WidgetPrayerTimes for consistency.
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

// `solid`/`gradient` are filled (white text); `surface` is a light card (themed text).
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
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)')
const accentTextColor = computed(() => isFilled.value ? 'var(--color-secondary)' : accentVar.value)
const trackColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.25)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
const barColor = computed(() => isFilled.value ? '#fff' : accentVar.value)
const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')
const rootClass = computed(() => {
  if (effectiveVariant.value === 'iqamah-panel') {
    return [
      'classic-iqamah-panel @container relative isolate h-full overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--color-primary)_94%,var(--color-text))] p-4 text-[var(--color-surface)] shadow-[0_22px_56px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] @md:p-5',
      { 'classic-iqamah-panel-urgent': isFinalMinute.value }
    ]
  }

  return '@container h-full overflow-hidden rounded-lg p-6'
})
const rootStyle = computed(() => effectiveVariant.value === 'iqamah-panel' ? undefined : containerStyle.value)

// Remaining prayers list for the `split` variant.
const upcoming = computed(() => {
  const data = prayerData.value
  const cur = secondsNow.value
  return prayers.map(([name, adhanKey, iqamahKey, icon]) => {
    const value = props.showIqamah ? data[iqamahKey] || data[adhanKey] : data[adhanKey]
    const total = toSeconds(value)
    return {
      name,
      icon,
      time: value || '--:--',
      isNext: name === next.value.name,
      passed: cur !== null && total !== null && total < cur && name !== next.value.name
    }
  })
})
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
  >
    <!-- Iqamah panel: Sacred Modern-inspired standalone board -->
    <template v-if="effectiveVariant === 'iqamah-panel'">
      <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_8%_12%,color-mix(in_srgb,var(--color-secondary)_20%,transparent),transparent_32%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_95%,var(--color-text)),var(--color-primary))]" />
      <div
        v-if="texturePattern"
        class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.08] [mask-position:center] [mask-repeat:repeat] [mask-size:220px]"
        :style="textureStyle"
      />

      <div class="grid gap-4 @md:grid-cols-[auto_1fr_auto] @md:items-center">
        <div class="flex items-center gap-3">
          <span class="classic-iqamah-live-dot grid size-12 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] text-[var(--color-secondary)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_42%,transparent)]">
            <UIcon
              v-if="showIcon"
              :name="next.icon"
              class="size-6"
            />
          </span>
          <div>
            <p class="text-[0.68rem] font-black uppercase tracking-normal text-[var(--color-secondary)]">
              {{ title }}
            </p>
            <h2 class="tenant-heading mt-0.5 text-2xl font-bold leading-none text-[var(--color-surface)] @md:text-3xl">
              {{ next.name }}
            </h2>
          </div>
        </div>

        <div class="grid gap-2 border-y border-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] py-4 @md:grid-cols-2 @md:border-x @md:border-y-0 @md:px-6 @md:py-0">
          <div>
            <p class="text-xs font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_50%,transparent)]">
              Prayer begins
            </p>
            <p class="mt-1 text-2xl font-black tabular-nums text-[var(--color-surface)]">
              {{ next.adhanTime || '--:--' }}
            </p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_50%,transparent)]">
              Iqamah
            </p>
            <p class="mt-1 text-2xl font-black tabular-nums text-[var(--color-secondary)]">
              {{ next.iqamahTime || next.adhanTime || '--:--' }}
            </p>
          </div>
        </div>

        <div class="rounded-md bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-4 py-3 ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] @md:min-w-44 @md:text-right">
          <p class="text-xs font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_64%,transparent)]">
            {{ contextLabel }}
          </p>
          <p class="mt-1 text-3xl font-black tabular-nums text-[var(--color-secondary)] @md:text-4xl">
            {{ countdownLabel }}
          </p>
        </div>
      </div>
    </template>

    <!-- Banner: centered hero strip -->
    <template v-else-if="effectiveVariant === 'banner'">
      <div class="text-center">
        <p
          v-if="showDate && dateLabel"
          class="text-xs font-semibold uppercase tracking-wide"
          :style="{ color: mutedColor }"
        >
          {{ dateLabel }}
        </p>
        <div class="mt-1 flex items-center justify-center gap-2">
          <UIcon
            v-if="showIcon"
            :name="next.icon"
            class="size-6"
            :style="{ color: accentTextColor }"
          />
          <p class="text-sm font-medium" :style="{ color: mutedColor }">
            {{ contextLabel }}
          </p>
        </div>
        <h3
          class="tenant-heading mt-2 text-3xl font-bold @md:text-4xl"
          :style="{ color: headingColor }"
        >
          {{ next.name }} · {{ next.time }}
        </h3>
        <p
          class="mt-3 font-bold tabular-nums"
          :class="precision === 'seconds' ? 'text-4xl @md:text-5xl' : 'text-3xl @md:text-4xl'"
          :style="{ color: headingColor }"
        >
          {{ countdownLabel }}
        </p>
        <div
          v-if="showProgress"
          class="mx-auto mt-4 h-1.5 max-w-md overflow-hidden rounded-full"
          :style="{ background: trackColor }"
        >
          <div
            class="h-full rounded-full transition-all duration-1000 ease-linear"
            :style="{ width: `${progress}%`, background: barColor }"
          />
        </div>
      </div>
    </template>

    <!-- Minimal: single inline row -->
    <template v-else-if="effectiveVariant === 'minimal'">
      <div class="flex items-center justify-between gap-3" :class="alignClass">
        <div class="flex items-center gap-2.5">
          <UIcon
            v-if="showIcon"
            :name="next.icon"
            class="size-5 shrink-0"
            :style="{ color: accentTextColor }"
          />
          <div>
            <p class="text-xs" :style="{ color: mutedColor }">
              {{ contextLabel }}
            </p>
            <p class="text-base font-semibold leading-tight" :style="{ color: headingColor }">
              {{ next.name }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xl font-bold tabular-nums leading-none" :style="{ color: headingColor }">
            {{ countdownLabel }}
          </p>
          <p class="mt-1 text-xs tabular-nums" :style="{ color: mutedColor }">
            {{ next.time }}
          </p>
        </div>
      </div>
    </template>

    <!-- Split: next prayer + remaining list -->
    <template v-else-if="effectiveVariant === 'split'">
      <div class="grid gap-6 @md:grid-cols-2 @md:items-center">
        <div :class="alignClass">
          <p
            v-if="showDate && dateLabel"
            class="text-xs font-semibold uppercase tracking-wide"
            :style="{ color: mutedColor }"
          >
            {{ dateLabel }}
          </p>
          <p class="text-sm font-medium" :style="{ color: mutedColor }">
            {{ contextLabel }}
          </p>
          <h3 class="tenant-heading mt-1 text-3xl font-bold" :style="{ color: headingColor }">
            {{ next.name }}
          </h3>
          <p class="mt-2 text-4xl font-bold tabular-nums" :style="{ color: headingColor }">
            {{ countdownLabel }}
          </p>
          <p class="mt-1 text-sm tabular-nums" :style="{ color: mutedColor }">
            at {{ next.time }}
          </p>
          <div
            v-if="showProgress"
            class="mt-4 h-1.5 overflow-hidden rounded-full"
            :style="{ background: trackColor }"
          >
            <div
              class="h-full rounded-full transition-all duration-1000 ease-linear"
              :style="{ width: `${progress}%`, background: barColor }"
            />
          </div>
        </div>
        <ul class="space-y-1">
          <li
            v-for="row in upcoming"
            :key="row.name"
            class="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm"
            :style="row.isNext
              ? { background: isFilled ? 'rgba(255,255,255,0.15)' : `color-mix(in srgb, ${accentVar} 8%, var(--color-surface))` }
              : {}"
          >
            <span class="flex items-center gap-2" :style="{ color: row.passed ? mutedColor : headingColor }">
              <UIcon
                v-if="showIcon"
                :name="row.icon"
                class="size-4 shrink-0"
                :style="{ color: row.isNext ? accentTextColor : mutedColor }"
              />
              {{ row.name }}
            </span>
            <span class="tabular-nums" :style="{ color: row.passed ? mutedColor : headingColor }">
              {{ row.time }}
            </span>
          </li>
        </ul>
      </div>
    </template>

    <!-- Card (default) -->
    <template v-else>
      <div class="flex items-center justify-between gap-4">
        <div :class="alignClass">
          <p
            v-if="showDate && dateLabel"
            class="text-xs font-semibold uppercase tracking-wide"
            :style="{ color: mutedColor }"
          >
            {{ dateLabel }}
          </p>
          <p class="text-sm font-medium" :style="{ color: mutedColor }">
            {{ title }}
          </p>
          <h3 class="tenant-heading mt-2 text-4xl font-bold" :style="{ color: headingColor }">
            {{ next.name }}
          </h3>
        </div>
        <UIcon
          v-if="showIcon"
          :name="next.icon"
          class="size-10 shrink-0"
          :style="{ color: accentTextColor }"
        />
      </div>

      <div class="mt-8" :class="alignClass">
        <p class="text-5xl font-bold tabular-nums" :style="{ color: headingColor }">
          {{ next.time }}
        </p>
        <p class="mt-2 text-sm" :style="{ color: mutedColor }">
          <template v-if="remaining === null">Today</template>
          <template v-else-if="remaining < 60">Starting soon</template>
          <template v-else>{{ contextLabel }} {{ countdownLabel }}</template>
        </p>
        <div
          v-if="showProgress"
          class="mt-4 h-1.5 overflow-hidden rounded-full"
          :style="{ background: trackColor }"
        >
          <div
            class="h-full rounded-full transition-all duration-1000 ease-linear"
            :style="{ width: `${progress}%`, background: barColor }"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .classic-iqamah-panel {
    animation: classic-iqamah-glow 4s ease-in-out infinite;
  }

  .classic-iqamah-live-dot {
    animation: classic-iqamah-pulse 3.2s ease-in-out infinite;
  }

  .classic-iqamah-panel-urgent,
  .classic-iqamah-panel-urgent .classic-iqamah-live-dot {
    animation: classic-iqamah-heartbeat 0.85s ease-in-out infinite;
  }
}

@keyframes classic-iqamah-pulse {
  0%, 100% {
    opacity: 0.78;
    transform: scale(0.96);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes classic-iqamah-glow {
  0%, 100% {
    box-shadow: 0 22px 56px color-mix(in srgb, var(--color-primary) 18%, transparent);
  }

  50% {
    box-shadow: 0 24px 72px color-mix(in srgb, var(--color-secondary) 22%, transparent);
  }
}

@keyframes classic-iqamah-heartbeat {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 22px 56px color-mix(in srgb, var(--color-secondary) 18%, transparent);
  }

  35% {
    transform: scale(1.018);
    box-shadow: 0 28px 84px color-mix(in srgb, var(--color-secondary) 32%, transparent);
  }

  58% {
    transform: scale(0.995);
  }
}
</style>
