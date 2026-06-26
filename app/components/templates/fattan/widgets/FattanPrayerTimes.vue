<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  variant?: string
  showIqamah?: boolean
  showSunrise?: boolean
  hijriDate?: string
  data?: Record<string, any>
}>(), {
  title: 'Prayer Times',
  subtitle: 'Today at the mosque',
  variant: 'feature-panel',
  showIqamah: true,
  showSunrise: false,
  hijriDate: '16 Dhul Qaadah 1447',
  data: () => ({})
})

interface PrayerRow {
  name: string
  key: string
  time?: string
  iqamah?: string
  icon: string
  isPrayer: boolean
}

const ICONS: Record<string, string> = {
  Fajr: 'islamic-fajr',
  Sunrise: 'islamic-dhuhr',
  Dhuhr: 'islamic-dhuhr',
  Asr: 'islamic-asr',
  Maghrib: 'islamic-maghrib',
  Isha: 'islamic-isha'
}

const prayerTimes = computed(() => props.data?.prayerTimes)

const rows = computed<PrayerRow[]>(() => {
  const p = prayerTimes.value ?? {}
  return [
    { name: 'Fajr', key: 'fajr', time: p.fajr, iqamah: p.fajrIqamah, icon: ICONS.Fajr, isPrayer: true },
    { name: 'Sunrise', key: 'sunrise', time: p.sunrise, iqamah: undefined, icon: ICONS.Sunrise, isPrayer: false },
    { name: 'Dhuhr', key: 'dhuhr', time: p.dhuhr, iqamah: p.dhuhrIqamah, icon: ICONS.Dhuhr, isPrayer: true },
    { name: 'Asr', key: 'asr', time: p.asr, iqamah: p.asrIqamah, icon: ICONS.Asr, isPrayer: true },
    { name: 'Maghrib', key: 'maghrib', time: p.maghrib, iqamah: p.maghribIqamah, icon: ICONS.Maghrib, isPrayer: true },
    { name: 'Isha', key: 'isha', time: p.isha, iqamah: p.ishaIqamah, icon: ICONS.Isha, isPrayer: true }
  ].filter(row => props.showSunrise || row.isPrayer)
})

const prayerRows = computed(() => rows.value.filter(row => row.isPrayer && row.time))
const currentSeconds = ref<number | null>(null)
let interval: ReturnType<typeof window.setInterval> | undefined

function updateCurrentSeconds() {
  const now = new Date()
  currentSeconds.value = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}

onMounted(() => {
  updateCurrentSeconds()
  interval = window.setInterval(updateCurrentSeconds, 1000)
})

onBeforeUnmount(() => {
  if (interval) window.clearInterval(interval)
})

function secondsFromTime(time?: unknown) {
  if (typeof time !== 'string') return null
  const [hoursRaw, minutesRaw] = time.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 3600 + minutes * 60
}

const nextPrayer = computed(() => {
  const now = currentSeconds.value
  const prayers = prayerRows.value
  if (!prayers.length) return null
  if (now === null) return { ...prayers[0], targetSeconds: secondsFromTime(prayers[0]?.time) ?? 0, dayOffset: 0 }

  for (const row of prayers) {
    const targetSeconds = secondsFromTime(row.time)
    if (targetSeconds !== null && targetSeconds >= now) {
      return { ...row, targetSeconds, dayOffset: 0 }
    }
  }

  return { ...prayers[0], targetSeconds: secondsFromTime(prayers[0]?.time) ?? 0, dayOffset: 1 }
})

const nextPrayerName = computed(() => nextPrayer.value?.name ?? '')

const countdownLabel = computed(() => {
  const next = nextPrayer.value
  const now = currentSeconds.value
  if (!next || now === null) return ''

  let delta = next.targetSeconds - now
  if (next.dayOffset > 0 || delta < 0) delta += 24 * 3600

  if (delta <= 0) return 'now'
  const hours = Math.floor(delta / 3600)
  const minutes = Math.floor((delta % 3600) / 60)
  if (hours <= 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
})

const featureDate = computed(() => {
  const value = prayerTimes.value?.date
  if (!value) return ''

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
})

function meridiem(time?: unknown) {
  const prayerSeconds = secondsFromTime(time)
  if (prayerSeconds === null) return ''
  return prayerSeconds < 12 * 3600 ? 'AM' : 'PM'
}

function isActive(name: string) {
  return name === nextPrayerName.value
}
</script>

<template>
  <div class="fattan-prayer-board @container relative isolate overflow-hidden rounded-[1.35rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_46%,transparent)] bg-[var(--color-primary)] p-5 text-white shadow-[0_24px_70px_color-mix(in_srgb,var(--color-primary)_28%,transparent)] @lg:p-8">
    <div class="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(115%_100%_at_88%_0%,color-mix(in_srgb,var(--color-secondary)_22%,transparent)_0%,transparent_36%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_94%,black)_0%,color-mix(in_srgb,var(--color-primary)_82%,var(--color-accent))_100%)]" />
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[var(--color-secondary)] opacity-[0.075] [mask-image:url(/backgrounds/rosette-bloom.svg)] [mask-position:top_right] [mask-repeat:repeat] [mask-size:230px]" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--color-primary)_86%,black))]" />

    <div class="grid gap-5 @3xl:grid-cols-[1fr_auto] @3xl:items-start">
      <div class="min-w-0">
        <p v-if="subtitle" class="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-secondary)]">
          {{ subtitle }}
        </p>
        <h2 class="tenant-heading mt-2 text-4xl font-black leading-none text-white @lg:text-5xl">
          {{ title }}
        </h2>
        <p class="mt-3 text-sm font-semibold leading-6 text-white/70 @lg:text-base">
          <span v-if="featureDate">{{ featureDate }}</span>
          <span v-if="featureDate && hijriDate" class="px-2 text-[var(--color-secondary)]">|</span>
          <span v-if="hijriDate">{{ hijriDate }}</span>
        </p>
      </div>

      <div
        v-if="nextPrayer"
        class="w-full rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_36%,transparent)] bg-white/[0.075] p-4 shadow-inner backdrop-blur @3xl:w-auto @3xl:min-w-64"
      >
        <div class="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/58">
          <span class="fattan-countdown-dot size-2 rounded-full bg-[var(--color-secondary)]" aria-hidden="true" />
          Next prayer
        </div>
        <div class="mt-3 flex items-end justify-between gap-5">
          <div>
            <p class="tenant-heading text-3xl font-black text-[var(--color-secondary)]">
              {{ nextPrayer.name }}
            </p>
            <p class="mt-1 text-sm font-semibold text-white/62">
              {{ nextPrayer.dayOffset ? 'Tomorrow' : 'Today' }}
            </p>
          </div>
          <div class="text-right">
            <p class="tenant-heading text-4xl font-black tabular-nums text-white">
              {{ nextPrayer.time }}
            </p>
            <p class="mt-1 text-sm font-black text-[var(--color-secondary)]">
              in {{ countdownLabel }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-8 grid gap-3 rounded-2xl bg-white/[0.045] p-3 backdrop-blur @md:grid-cols-2 @4xl:gap-3"
      :class="showSunrise ? '@4xl:grid-cols-6' : '@4xl:grid-cols-5'"
    >
      <article
        v-for="row in rows"
        :key="row.name"
        class="fattan-prayer-cell relative min-h-40 rounded-2xl border p-4 transition @lg:min-h-44 @lg:p-5"
        :class="isActive(row.name) ? 'fattan-prayer-cell-active bg-[color:color-mix(in_srgb,var(--color-surface)_96%,white)] text-[var(--color-primary)]' : 'border-white/10 bg-white/[0.035] text-white'"
        :style="isActive(row.name) ? { borderColor: 'color-mix(in srgb, var(--color-secondary) 76%, white)' } : undefined"
      >
        <div class="flex items-start justify-between gap-3">
          <IconGlyph
            :name="row.icon"
            class="size-11 shrink-0 text-[var(--color-secondary)] drop-shadow"
          />
          <span
            v-if="isActive(row.name)"
            class="rounded-full bg-[var(--color-secondary)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-primary)]"
          >
            Next
          </span>
        </div>
        <h3 class="tenant-heading mt-4 text-2xl font-black">
          {{ row.name }}
        </h3>
        <p class="tenant-heading mt-3 text-4xl font-black tabular-nums text-[var(--color-secondary)]">
          {{ row.time || '--:--' }}
        </p>
        <p
          class="mt-1 text-sm font-black"
          :class="isActive(row.name) ? 'text-[var(--color-primary)]/68' : 'text-white/60'"
        >
          {{ meridiem(row.time) }}
        </p>
        <p
          v-if="showIqamah && row.iqamah"
          class="mt-3 text-xs font-semibold"
          :class="isActive(row.name) ? 'text-[var(--color-primary)]/58' : 'text-white/46'"
        >
          Iqamah {{ row.iqamah }}
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .fattan-countdown-dot {
    animation: fattan-countdown-pulse 2.25s ease-in-out infinite;
  }

  .fattan-prayer-cell-active {
    animation: fattan-prayer-glow 3.2s ease-in-out infinite;
  }
}

@keyframes fattan-countdown-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.12); }
}

@keyframes fattan-prayer-glow {
  0%, 100% { box-shadow: 0 18px 42px color-mix(in srgb, var(--color-secondary) 0%, transparent); }
  50% { box-shadow: 0 20px 48px color-mix(in srgb, var(--color-secondary) 28%, transparent); }
}
</style>
