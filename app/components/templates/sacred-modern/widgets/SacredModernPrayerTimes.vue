<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  showIqamah?: boolean
  showSunrise?: boolean
  hijriDate?: string
  showCountdown?: boolean
  countdownLabel?: string
  data?: Record<string, any>
}>(), {
  title: 'Prayer Times',
  variant: 'feature-board',
  showIqamah: true,
  showSunrise: false,
  hijriDate: '16 Dhul Qadah 1447',
  showCountdown: true,
  countdownLabel: 'time in',
  data: () => ({})
})

interface PrayerRow {
  name: string
  time?: string | null
  iqamah?: string | null
  icon: string
}

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

const prayerTimes = computed(() => props.data?.prayerTimes)
const rows = computed<PrayerRow[]>(() => {
  const prayer = prayerTimes.value ?? {}
  const base: PrayerRow[] = [
    { name: 'Fajr', time: prayer.fajr, iqamah: prayer.fajrIqamah, icon: 'islamic-fajr' },
    { name: 'Sunrise', time: prayer.sunrise, iqamah: null, icon: 'i-lucide-sunrise' },
    { name: 'Dhuhr', time: prayer.dhuhr, iqamah: prayer.dhuhrIqamah, icon: 'islamic-dhuhr' },
    { name: 'Asr', time: prayer.asr, iqamah: prayer.asrIqamah, icon: 'islamic-asr' },
    { name: 'Maghrib', time: prayer.maghrib, iqamah: prayer.maghribIqamah, icon: 'islamic-maghrib' },
    { name: 'Isha', time: prayer.isha, iqamah: prayer.ishaIqamah, icon: 'islamic-isha' }
  ]

  return base.filter(row => props.showSunrise || row.name !== 'Sunrise')
})

const featureRows = computed(() => rows.value.filter(row => row.name !== 'Sunrise'))

function secondsFromTime(time?: string | null) {
  if (!time) return null
  const [hoursRaw, minutesRaw] = time.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 3600 + minutes * 60
}

function secondsUntil(targetSeconds?: number | null) {
  const secondsNow = currentSeconds.value
  if (secondsNow === null || targetSeconds === null || targetSeconds === undefined) return null

  let diff = targetSeconds - secondsNow
  if (diff < 0) diff += 24 * 3600
  return diff
}

function formatRemaining(totalSeconds?: number | null) {
  if (totalSeconds === null || totalSeconds === undefined) return '--'
  if (totalSeconds < 60) return `${Math.max(0, Math.floor(totalSeconds))}s`

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  return `${minutes}m`
}

const nextPrayer = computed(() => {
  const secondsNow = currentSeconds.value
  const prayers = featureRows.value.filter(row => row.time || row.iqamah)
  if (!prayers.length) return featureRows.value[0]

  if (secondsNow === null) return prayers[0]

  return prayers.find((row) => {
    const targetSeconds = secondsFromTime(row.iqamah || row.time)
    return targetSeconds !== null && targetSeconds >= secondsNow
  }) ?? prayers[0]
})

const featureDate = computed(() => {
  const value = prayerTimes.value?.date
  if (!value) {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date())
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
})

const remainingLabel = computed(() => {
  const targetSeconds = secondsFromTime(nextPrayer.value?.iqamah || nextPrayer.value?.time)
  return formatRemaining(secondsUntil(targetSeconds))
})

const isFinalMinute = computed(() => {
  const targetSeconds = secondsFromTime(nextPrayer.value?.iqamah || nextPrayer.value?.time)
  const remaining = secondsUntil(targetSeconds)
  return remaining !== null && remaining < 60
})

const jummahRows = computed(() => {
  const rows = props.data?.jummahTimes ?? []
  if (rows.length) return rows.slice(0, 2)

  return [
    { id: 'first', label: "1st Jumu'ah", time: '1:15 PM' },
    { id: 'second', label: "2nd Jumu'ah", time: '2:15 PM' }
  ]
})
</script>

<template>
  <div class="sacred-modern-prayer-board @container relative isolate flex h-full flex-col overflow-hidden rounded-lg bg-[var(--color-primary)] text-[var(--color-surface)] shadow-[0_22px_58px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_28%,transparent)]">
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_92%_0%,color-mix(in_srgb,var(--color-secondary)_20%,transparent),transparent_30%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_94%,var(--color-text)),var(--color-primary))]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.075] [mask-image:url(/backgrounds/girih-diamonds.svg)] [mask-position:top_right] [mask-repeat:repeat] [mask-size:240px]" />

    <div class="flex-1 p-5 @md:p-6 @2xl:p-9">
      <div class="grid gap-4 @3xl:grid-cols-[1fr_auto] @3xl:items-start">
        <div>
          <h2 class="tenant-heading text-3xl font-bold leading-tight text-[var(--color-secondary)] @md:text-4xl">
            {{ title }}
          </h2>
          <p class="mt-1 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-surface)_62%,transparent)] @md:text-base">
            {{ featureDate }} / {{ hijriDate }}
          </p>
        </div>

        <div
          v-if="showCountdown && nextPrayer"
          class="sacred-modern-countdown inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_36%,transparent)] bg-[color:color-mix(in_srgb,black_18%,transparent)] px-4 py-2 text-sm font-bold text-[color:color-mix(in_srgb,var(--color-surface)_90%,transparent)]"
          :class="{ 'sacred-modern-countdown-urgent': isFinalMinute }"
          aria-live="polite"
        >
          <UIcon name="i-lucide-clock-3" class="size-4 text-[var(--color-secondary)]" />
          <span>{{ nextPrayer.name }} {{ countdownLabel }}</span>
          <span class="text-[var(--color-secondary)]">{{ remainingLabel }}</span>
        </div>
      </div>

      <div class="mt-8 grid auto-rows-fr grid-cols-1 gap-3 @sm:grid-cols-2 @2xl:grid-cols-5 @2xl:gap-2.5 @5xl:gap-3">
        <article
          v-for="row in featureRows"
          :key="row.name"
          class="sacred-modern-prayer-cell relative grid min-h-32 place-items-center rounded-xl border p-4 text-center transition @2xl:min-h-36 @2xl:px-2 @5xl:px-3"
          :class="row.name === nextPrayer?.name ? 'sacred-modern-prayer-cell-active border-[color:color-mix(in_srgb,var(--color-secondary)_58%,transparent)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[0_18px_34px_rgba(0,0,0,0.2)]' : 'border-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_3.5%,transparent)] text-[color:color-mix(in_srgb,var(--color-surface)_82%,transparent)]'"
        >
          <span
            v-if="row.name === nextPrayer?.name"
            class="absolute right-3 top-3 rounded-full bg-[var(--color-secondary)] px-2 py-0.5 text-[0.62rem] font-black uppercase tracking-normal text-[var(--color-primary)]"
          >
            Next
          </span>
          <IconGlyph
            :name="row.icon"
            class="size-9 text-[var(--color-secondary)] @2xl:size-8"
          />
          <div>
            <h3 class="mt-2 text-base font-bold @2xl:text-sm @5xl:text-base">
              {{ row.name }}
            </h3>
            <p class="tenant-heading mt-2 text-3xl font-bold tabular-nums @2xl:text-2xl @5xl:text-3xl">
              {{ row.time || '--:--' }}
            </p>
            <p
              v-if="showIqamah && row.iqamah"
              class="mt-1 text-xs font-semibold opacity-70 @2xl:text-[0.65rem] @5xl:text-xs"
            >
              Iqamah {{ row.iqamah }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <div class="mt-auto grid gap-4 border-t border-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] p-5 @2xl:grid-cols-[1fr_auto] @2xl:items-center @2xl:px-9">
      <div class="flex items-center gap-4">
        <span class="grid size-12 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_24%,transparent)] text-[var(--color-secondary)]">
          <IconGlyph name="islamic-quran" class="size-6" />
        </span>
        <h3 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)] @md:text-3xl">
          Jumu'ah Prayers
        </h3>
      </div>

      <div class="grid gap-3 @md:grid-cols-2">
        <div
          v-for="item in jummahRows"
          :key="item.id ?? item.label"
          class="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-surface)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] px-5 py-4 text-center shadow-inner"
        >
          <p class="text-[0.65rem] font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_44%,transparent)]">
            {{ item.label || "Jumu'ah" }}
          </p>
          <p class="mt-1 text-xl font-bold text-[var(--color-surface)]">
            {{ item.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .sacred-modern-countdown,
  .sacred-modern-prayer-cell-active {
    animation: sacred-modern-prayer-glow 3s ease-in-out infinite;
  }

  .sacred-modern-countdown-urgent {
    animation: sacred-modern-prayer-heartbeat 0.85s ease-in-out infinite;
  }
}

@keyframes sacred-modern-prayer-glow {
  0%, 100% {
    box-shadow: 0 16px 30px color-mix(in srgb, var(--color-secondary) 6%, transparent);
  }

  50% {
    box-shadow: 0 18px 42px color-mix(in srgb, var(--color-secondary) 24%, transparent);
  }
}

@keyframes sacred-modern-prayer-heartbeat {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 16px 30px color-mix(in srgb, var(--color-secondary) 12%, transparent);
  }

  35% {
    transform: scale(1.035);
    box-shadow: 0 20px 46px color-mix(in srgb, var(--color-secondary) 32%, transparent);
  }

  58% {
    transform: scale(0.99);
  }
}
</style>
