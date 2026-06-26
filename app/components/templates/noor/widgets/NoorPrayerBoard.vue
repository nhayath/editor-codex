<script setup lang="ts">
// Noor — "Illuminated" prayer board. The navy centerpiece of the page: gold
// per-prayer cells on a deep-navy panel, with the next prayer glowing and a
// live countdown. Reads data.prayerTimes and honours the merged-in global
// prayer-times props (showIqamah / showSunrise). Being a real component, the
// navy travels with the section regardless of order — no positional CSS band.
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  showIqamah?: boolean
  showSunrise?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Prayer Times',
  subtitle: '',
  showIqamah: true,
  showSunrise: false,
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

const prayerTimes = computed(() => props.data?.prayerTimes as Record<string, string | undefined> | undefined)

const rows = computed(() => {
  const p = prayerTimes.value ?? {}
  const base = [
    { name: 'Fajr', time: p.fajr, iqamah: p.fajrIqamah },
    { name: 'Sunrise', time: p.sunrise, iqamah: undefined },
    { name: 'Dhuhr', time: p.dhuhr, iqamah: p.dhuhrIqamah },
    { name: 'Asr', time: p.asr, iqamah: p.asrIqamah },
    { name: 'Maghrib', time: p.maghrib, iqamah: p.maghribIqamah },
    { name: 'Isha', time: p.isha, iqamah: p.ishaIqamah }
  ]
  return base
    .filter(row => props.showSunrise || row.name !== 'Sunrise')
    .map(row => ({ ...row, icon: ICONS[row.name] ?? 'i-lucide-clock-3', isPrayer: row.name !== 'Sunrise' }))
})

// Live clock (minute precision) for the next-prayer highlight + countdown.
const currentMinutes = ref<number | null>(null)
onMounted(() => {
  const update = () => {
    const now = new Date()
    currentMinutes.value = now.getHours() * 60 + now.getMinutes()
  }
  update()
  const interval = window.setInterval(update, 60_000)
  onBeforeUnmount(() => window.clearInterval(interval))
})

function toMinutes(value?: string) {
  if (!value) return null
  const [h, m] = value.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

const nextName = computed(() => {
  const minutesNow = currentMinutes.value
  const prayers = rows.value.filter(row => row.isPrayer && row.time)
  if (!prayers.length) return null
  if (minutesNow === null) return prayers[0]?.name ?? null
  for (const row of prayers) {
    const total = toMinutes(row.time)
    if (total !== null && total >= minutesNow) return row.name
  }
  return prayers[0]?.name ?? null
})

function isActive(name: string) {
  return name === nextName.value
}

// Minutes until the next prayer, wrapping past midnight, formatted "1h 12m".
const countdownLabel = computed(() => {
  const minutesNow = currentMinutes.value
  if (minutesNow === null || !nextName.value) return ''
  const next = rows.value.find(row => row.name === nextName.value)
  const target = toMinutes(next?.time)
  if (target === null) return ''
  let delta = target - minutesNow
  if (delta < 0) delta += 24 * 60
  const hours = Math.floor(delta / 60)
  const mins = delta % 60
  if (hours <= 0 && mins <= 0) return 'now'
  return `${hours > 0 ? `${hours}h ` : ''}${mins}m`
})
</script>

<template>
  <div class="noor-board @container relative isolate h-full overflow-hidden rounded-lg bg-[var(--color-primary)] p-6 text-white @lg:p-7">
    <!-- Layered navy backdrop + gold glow + arabesque wash -->
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_85%_0%,color-mix(in_srgb,var(--color-primary)_72%,black)_0%,var(--color-primary)_52%,color-mix(in_srgb,var(--color-primary)_86%,black)_100%)]" />
    <div class="pointer-events-none absolute -right-20 -top-24 -z-10 size-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-secondary)_34%,transparent)_0%,transparent_68%)] opacity-70" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.06] [mask-image:url(/backgrounds/rosette-bloom.svg)] [mask-position:top_right] [mask-repeat:repeat] [mask-size:200px]" />

    <!-- Header -->
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <p v-if="prayerTimes?.date || subtitle" class="text-sm font-semibold text-[var(--color-secondary)]">
          {{ subtitle || prayerTimes?.date }}
        </p>
        <h2 class="tenant-heading text-3xl font-bold text-white">
          {{ title }}
        </h2>
      </div>
      <div
        v-if="countdownLabel"
        class="flex shrink-0 items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_38%,transparent)] bg-[color:color-mix(in_srgb,black_24%,transparent)] px-3.5 py-1.5"
      >
        <span class="noor-board-pulse size-1.5 rounded-full bg-[var(--color-secondary)]" aria-hidden="true" />
        <span class="text-xs font-semibold text-white/75">Next in</span>
        <span class="text-xs font-bold tabular-nums text-[var(--color-secondary)]">{{ countdownLabel }}</span>
      </div>
    </div>

    <!-- Prayer cells -->
    <div class="grid grid-cols-2 gap-2.5 @sm:grid-cols-3">
      <div
        v-for="row in rows"
        :key="row.name"
        class="noor-cell relative flex flex-col gap-1 rounded-xl border p-3.5 transition-colors @lg:p-4"
        :class="isActive(row.name) ? 'noor-cell-active' : ''"
        :style="isActive(row.name)
          ? { borderColor: 'color-mix(in srgb, var(--color-secondary) 70%, transparent)', background: 'color-mix(in srgb, var(--color-secondary) 16%, transparent)' }
          : { borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.035)' }"
      >
        <div class="flex items-center justify-between gap-2">
          <span
            class="text-[11px] font-semibold uppercase tracking-[0.12em]"
            :style="{ color: isActive(row.name) ? 'var(--color-secondary)' : 'rgba(255,255,255,0.62)' }"
          >
            {{ row.name }}
          </span>
          <UIcon
            :name="row.icon"
            class="size-4 shrink-0"
            :style="{ color: isActive(row.name) ? 'var(--color-secondary)' : 'rgba(255,255,255,0.45)' }"
          />
        </div>
        <span class="text-2xl font-bold tabular-nums text-white @lg:text-[1.65rem]">{{ row.time || '--:--' }}</span>
        <span
          v-if="showIqamah && row.iqamah"
          class="text-xs font-medium tabular-nums"
          :style="{ color: isActive(row.name) ? 'color-mix(in srgb, var(--color-secondary) 85%, white)' : 'rgba(255,255,255,0.5)' }"
        >
          Iqamah {{ row.iqamah }}
        </span>
        <span
          v-if="isActive(row.name)"
          class="absolute -top-2 right-2.5 rounded-full bg-[var(--color-secondary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-primary)]"
        >
          Next
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .noor-board-pulse {
    animation: noor-board-pulse 2.4s ease-in-out infinite;
  }

  .noor-cell-active {
    animation: noor-cell-glow 3s ease-in-out infinite;
  }
}

@keyframes noor-board-pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
}

@keyframes noor-cell-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-secondary) 0%, transparent); }
  50% { box-shadow: 0 0 22px 0 color-mix(in srgb, var(--color-secondary) 28%, transparent); }
}
</style>
