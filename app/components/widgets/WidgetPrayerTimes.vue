<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  showIqamah?: boolean
  showSunrise?: boolean
  showIcons?: boolean
  highlightNext?: boolean
  accent?: string
  background?: string
  align?: string
  scheduleLabel?: string
  scheduleHref?: string
  data?: Record<string, any>
}>(), {
  title: 'Today Prayer Times',
  variant: 'cards',
  showIqamah: true,
  showSunrise: true,
  showIcons: true,
  highlightNext: true,
  accent: 'primary',
  background: 'surface',
  align: 'left',
  scheduleLabel: 'Full schedule',
  scheduleHref: '',
  data: () => ({})
})

const ICONS: Record<string, string> = {
  Fajr: 'i-lucide-sunrise',
  Sunrise: 'i-lucide-sun-dim',
  Dhuhr: 'i-lucide-sun',
  Asr: 'i-lucide-cloud-sun',
  Maghrib: 'i-lucide-sunset',
  Isha: 'i-lucide-moon-star'
}

const prayerTimes = computed(() => props.data?.prayerTimes)

const rows = computed(() => {
  const prayer = (prayerTimes.value ?? {}) as Record<string, string | undefined>
  const base = [
    { name: 'Fajr', time: prayer.fajr, iqamah: prayer.fajrIqamah },
    { name: 'Sunrise', time: prayer.sunrise, iqamah: undefined },
    { name: 'Dhuhr', time: prayer.dhuhr, iqamah: prayer.dhuhrIqamah },
    { name: 'Asr', time: prayer.asr, iqamah: prayer.asrIqamah },
    { name: 'Maghrib', time: prayer.maghrib, iqamah: prayer.maghribIqamah },
    { name: 'Isha', time: prayer.isha, iqamah: prayer.ishaIqamah }
  ]
  return base
    .filter(row => props.showSunrise || row.name !== 'Sunrise')
    .map(row => ({ ...row, icon: ICONS[row.name] ?? 'i-lucide-clock-3', isPrayer: row.name !== 'Sunrise' }))
})

// Current time, refreshed every minute, to find the next upcoming prayer.
const currentMinutes = ref<number | null>(null)
function updateCurrentMinutes() {
  const now = new Date()
  currentMinutes.value = now.getHours() * 60 + now.getMinutes()
}
onMounted(() => {
  updateCurrentMinutes()
  const interval = window.setInterval(updateCurrentMinutes, 60_000)
  onBeforeUnmount(() => window.clearInterval(interval))
})

function toMinutes(value?: string) {
  if (!value) return null
  const parts = value.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0
  return hours * 60 + minutes
}

const nextName = computed(() => {
  if (!props.highlightNext) return null
  const minutesNow = currentMinutes.value
  if (minutesNow === null) return null
  const prayers = rows.value.filter(row => row.isPrayer)
  for (const row of prayers) {
    const total = toMinutes(row.time)
    if (total !== null && total >= minutesNow) return row.name
  }
  // All of today's prayers have passed → next is tomorrow's first prayer.
  return prayers[0]?.name ?? null
})

function isActive(name: string) {
  return name === nextName.value
}

// Accent + background system, mirrored from the sibling prayer widgets so the
// three read as one family. `solid`/`gradient` are filled (white text);
// `surface` is the legacy light themed card.
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

const isFilled = computed(() => props.background !== 'surface')

const containerStyle = computed(() => {
  if (props.background === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))`
    }
  }
  if (props.background === 'solid') {
    return { background: accentVar.value }
  }
  // surface = legacy light card (a faint accent tint when accent === 'soft').
  return {
    background: props.accent === 'soft'
      ? 'color-mix(in srgb, var(--color-secondary) 6%, var(--color-surface))'
      : 'var(--color-surface)',
    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)'
  }
})

const headingColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)')
const accentTextColor = computed(() => isFilled.value ? 'var(--color-secondary)' : accentVar.value)
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
const zebraColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.06)' : 'color-mix(in srgb, var(--color-text) 3%, transparent)')

// Highlight styling for the next prayer.
const activeBg = computed(() => isFilled.value
  ? 'rgba(255,255,255,0.16)'
  : `color-mix(in srgb, ${accentVar.value} 8%, var(--color-surface))`)
const activeBorder = computed(() => isFilled.value ? 'rgba(255,255,255,0.55)' : accentVar.value)
// "Next" pill: inverted so it stands out on either scheme.
const nextBadgeStyle = computed(() => isFilled.value
  ? { background: '#fff', color: accentVar.value }
  : { background: accentVar.value, color: '#fff' })

const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')

// Strip shows the five obligatory prayers only (no sunrise), to read as a clean
// top-of-page bar.
const stripRows = computed(() => rows.value.filter(row => row.isPrayer))
</script>

<template>
  <!-- Strip: slim full-width prayer bar, ideal as the lead element of a page -->
  <div
    v-if="variant === 'strip'"
    class="@container overflow-hidden rounded-lg px-4 py-3.5 @md:px-6"
    :style="containerStyle"
  >
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div class="-mx-1 flex flex-1 items-stretch gap-1.5 overflow-x-auto px-1 @sm:gap-2.5 @lg:gap-3">
        <div
          v-for="row in stripRows"
          :key="row.name"
          class="relative flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 transition-colors @md:px-3.5"
          :style="isActive(row.name)
            ? { background: 'color-mix(in srgb, var(--color-secondary) 20%, transparent)', boxShadow: `inset 0 0 0 1.5px ${accentTextColor}` }
            : {}"
        >
          <UIcon
            v-if="showIcons"
            :name="row.icon"
            class="size-5 shrink-0 @md:size-[22px]"
            :style="{ color: isActive(row.name) ? accentTextColor : mutedColor }"
          />
          <div class="flex flex-col leading-tight">
            <span
              class="text-[11px] font-semibold uppercase tracking-[0.14em]"
              :style="{ color: isActive(row.name) ? accentTextColor : mutedColor }"
            >
              {{ row.name }}
            </span>
            <span
              class="tabular-nums @md:text-xl"
              :class="isActive(row.name) ? 'text-xl font-bold' : 'text-lg font-semibold'"
              :style="{ color: headingColor }"
            >
              {{ row.time || '--:--' }}
            </span>
          </div>
        </div>
      </div>
      <a
        v-if="scheduleHref"
        :href="scheduleHref"
        class="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors"
        :style="{ color: accentTextColor }"
      >
        {{ scheduleLabel }}
        <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  </div>

  <div
    v-else
    class="@container h-full overflow-hidden rounded-lg p-6"
    :style="containerStyle"
  >
    <div class="mb-5 flex flex-wrap items-start justify-between gap-3" :class="alignClass">
      <div :class="{ 'mx-auto': align === 'center' }">
        <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
          {{ prayerTimes?.date }}
        </p>
        <h2 class="tenant-heading text-3xl font-bold" :style="{ color: headingColor }">
          {{ title }}
        </h2>
      </div>
      <span
        class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
        :style="{ background: hairlineColor, color: headingColor }"
      >
        Today
      </span>
    </div>

    <!-- Cards -->
    <div
      v-if="variant === 'cards'"
      class="grid gap-3 @sm:grid-cols-2 @lg:grid-cols-3"
    >
      <div
        v-for="row in rows"
        :key="row.name"
        class="relative rounded-md border p-4 transition-colors"
        :style="isActive(row.name)
          ? { borderColor: activeBorder, background: activeBg }
          : { borderColor: hairlineColor }"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm" :style="{ color: mutedColor }">
            {{ row.name }}
          </p>
          <UIcon
            v-if="showIcons"
            :name="row.icon"
            class="size-5 shrink-0"
            :style="{ color: isActive(row.name) ? accentTextColor : mutedColor }"
          />
        </div>
        <p class="mt-2 text-2xl font-semibold" :style="{ color: headingColor }">
          {{ row.time || '--:--' }}
        </p>
        <p
          v-if="showIqamah && row.iqamah"
          class="mt-1 text-xs"
          :style="{ color: accentTextColor }"
        >
          Iqamah {{ row.iqamah }}
        </p>
        <span
          v-if="isActive(row.name)"
          class="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          :style="nextBadgeStyle"
        >
          Next
        </span>
      </div>
    </div>

    <!-- Table -->
    <table
      v-else-if="variant === 'table'"
      class="w-full text-sm"
    >
      <thead>
        <tr
          class="text-left text-xs uppercase tracking-wide"
          :style="{ color: mutedColor, borderBottom: `1px solid ${hairlineColor}` }"
        >
          <th class="py-2 font-semibold">
            Prayer
          </th>
          <th class="py-2 text-right font-semibold">
            Adhan
          </th>
          <th
            v-if="showIqamah"
            class="py-2 text-right font-semibold"
          >
            Iqamah
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row.name"
          :style="isActive(row.name)
            ? { background: activeBg, boxShadow: `inset 3px 0 0 ${activeBorder}` }
            : (i % 2 === 1 ? { background: zebraColor } : {})"
        >
          <td class="py-3 pl-3 pr-2">
            <span class="flex items-center gap-2.5 font-medium" :style="{ color: headingColor }">
              <UIcon
                v-if="showIcons"
                :name="row.icon"
                class="size-4 shrink-0"
                :style="{ color: isActive(row.name) ? accentTextColor : mutedColor }"
              />
              {{ row.name }}
              <span
                v-if="isActive(row.name)"
                class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                :style="nextBadgeStyle"
              >
                Next
              </span>
            </span>
          </td>
          <td class="py-3 pr-2 text-right tabular-nums" :style="{ color: headingColor }">
            {{ row.time || '--:--' }}
          </td>
          <td
            v-if="showIqamah"
            class="py-3 pr-3 text-right tabular-nums"
            :style="{ color: mutedColor }"
          >
            {{ row.iqamah || '—' }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Compact -->
    <div
      v-else-if="variant === 'compact'"
      class="flex flex-wrap gap-2"
    >
      <div
        v-for="row in rows"
        :key="row.name"
        class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
        :style="isActive(row.name)
          ? { borderColor: activeBorder, background: activeBg }
          : { borderColor: hairlineColor }"
      >
        <UIcon
          v-if="showIcons"
          :name="row.icon"
          class="size-4 shrink-0"
          :style="{ color: isActive(row.name) ? accentTextColor : mutedColor }"
        />
        <span class="font-medium" :style="{ color: headingColor }">{{ row.name }}</span>
        <span class="tabular-nums" :style="{ color: mutedColor }">{{ row.time || '--:--' }}</span>
        <span
          v-if="showIqamah && row.iqamah"
          class="tabular-nums text-xs"
          :style="{ color: accentTextColor }"
        >· {{ row.iqamah }}</span>
      </div>
    </div>

    <!-- List (fallback, also used by template variants like 'feature-panel') -->
    <div
      v-else
      class="divide-y"
      :style="{ borderColor: hairlineColor }"
    >
      <div
        v-for="row in rows"
        :key="row.name"
        class="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-3 text-sm"
        :style="isActive(row.name)
          ? { background: activeBg, boxShadow: `inset 3px 0 0 ${activeBorder}` }
          : {}"
      >
        <span class="flex items-center gap-2.5 font-medium" :style="{ color: headingColor }">
          <UIcon
            v-if="showIcons"
            :name="row.icon"
            class="size-4 shrink-0"
            :style="{ color: isActive(row.name) ? accentTextColor : mutedColor }"
          />
          {{ row.name }}
          <span
            v-if="isActive(row.name)"
            class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
            :style="nextBadgeStyle"
          >
            Next
          </span>
        </span>
        <span class="tabular-nums" :style="{ color: headingColor }">{{ row.time || '--:--' }}</span>
        <span
          v-if="showIqamah"
          class="tabular-nums"
          :style="{ color: mutedColor }"
        >
          {{ row.iqamah || '' }}
        </span>
      </div>
    </div>
  </div>
</template>
