<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  countdownLabel?: string
  data?: Record<string, any>
}>(), {
  label: 'Next salah',
  countdownLabel: 'Iqamah in',
  data: () => ({})
})

interface PrayerRow {
  name: string
  time?: string | null
  iqamah?: string | null
}

const prayerIcons: Record<string, string> = {
  Fajr: 'i-lucide-sunrise',
  Dhuhr: 'i-lucide-sun',
  Asr: 'i-lucide-cloud-sun',
  Maghrib: 'i-lucide-sunset',
  Isha: 'i-lucide-moon-star'
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

function secondsFromTime(value?: string | null) {
  if (!value) return null
  const [hoursRaw, minutesRaw] = value.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 3600 + minutes * 60
}

function secondsUntil(targetSeconds?: number | null) {
  const now = currentSeconds.value
  if (now === null || targetSeconds === null || targetSeconds === undefined) return null

  let diff = targetSeconds - now
  if (diff < 0) diff += 24 * 3600
  return diff
}

function formatTimeLeft(totalSeconds?: number | null) {
  if (totalSeconds === null || totalSeconds === undefined) return '--'
  if (totalSeconds < 60) return `${Math.max(0, Math.floor(totalSeconds))}s`

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  return `${minutes}m`
}

const prayerRows = computed<PrayerRow[]>(() => {
  const p = props.data?.prayerTimes ?? {}
  return [
    { name: 'Fajr', time: p.fajr, iqamah: p.fajrIqamah },
    { name: 'Dhuhr', time: p.dhuhr, iqamah: p.dhuhrIqamah },
    { name: 'Asr', time: p.asr, iqamah: p.asrIqamah },
    { name: 'Maghrib', time: p.maghrib, iqamah: p.maghribIqamah },
    { name: 'Isha', time: p.isha, iqamah: p.ishaIqamah }
  ].filter(row => row.time || row.iqamah)
})

const nextIqamah = computed(() => {
  const rows = prayerRows.value
  if (!rows.length) return null

  const now = currentSeconds.value
  if (now === null) return rows[0]

  for (const row of rows) {
    const target = secondsFromTime(row.iqamah || row.time)
    if (target !== null && target >= now) return row
  }

  return rows[0]
})

const iqamahSecondsLeft = computed(() => secondsUntil(secondsFromTime(nextIqamah.value?.iqamah || nextIqamah.value?.time)))
const iqamahCountdownLabel = computed(() => formatTimeLeft(iqamahSecondsLeft.value))
const isFinalMinute = computed(() => {
  const value = iqamahSecondsLeft.value
  return value !== null && value < 60
})
</script>

<template>
  <section
    v-if="nextIqamah"
    class="sacred-modern-iqamah-panel @container relative isolate overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--color-primary)_94%,var(--color-text))] p-4 text-[var(--color-surface)] shadow-[0_22px_56px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] @md:p-5"
    :class="{ 'sacred-modern-iqamah-panel-urgent': isFinalMinute }"
    aria-live="polite"
  >
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_8%_12%,color-mix(in_srgb,var(--color-secondary)_20%,transparent),transparent_32%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_95%,var(--color-text)),var(--color-primary))]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.08] [mask-image:url(/backgrounds/girih-diamonds.svg)] [mask-position:center] [mask-repeat:repeat] [mask-size:220px]" />

    <div class="grid gap-4 @md:grid-cols-[auto_1fr_auto] @md:items-center">
      <div class="flex items-center gap-3">
        <span class="sacred-modern-iqamah-live-dot grid size-12 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] text-[var(--color-secondary)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_42%,transparent)]">
          <UIcon :name="prayerIcons[nextIqamah.name] ?? 'i-lucide-clock-3'" class="size-6" />
        </span>
        <div>
          <p class="text-[0.68rem] font-black uppercase tracking-normal text-[var(--color-secondary)]">
            {{ label }}
          </p>
          <h2 class="tenant-heading mt-0.5 text-2xl font-bold leading-none text-[var(--color-surface)] @md:text-3xl">
            {{ nextIqamah.name }}
          </h2>
        </div>
      </div>

      <div class="grid gap-2 border-y border-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] py-4 @md:grid-cols-2 @md:border-x @md:border-y-0 @md:px-6 @md:py-0">
        <div>
          <p class="text-xs font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_50%,transparent)]">
            Prayer begins
          </p>
          <p class="mt-1 text-2xl font-black tabular-nums text-[var(--color-surface)]">
            {{ nextIqamah.time || '--:--' }}
          </p>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_50%,transparent)]">
            Iqamah
          </p>
          <p class="mt-1 text-2xl font-black tabular-nums text-[var(--color-secondary)]">
            {{ nextIqamah.iqamah || nextIqamah.time || '--:--' }}
          </p>
        </div>
      </div>

      <div class="rounded-md bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-4 py-3 ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] @md:min-w-44 @md:text-right">
        <p class="text-xs font-bold uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_64%,transparent)]">
          {{ countdownLabel }}
        </p>
        <p class="mt-1 text-3xl font-black tabular-nums text-[var(--color-secondary)] @md:text-4xl">
          {{ iqamahCountdownLabel }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .sacred-modern-iqamah-panel {
    animation: sacred-modern-iqamah-glow 4s ease-in-out infinite;
  }

  .sacred-modern-iqamah-live-dot {
    animation: sacred-modern-iqamah-pulse 3.2s ease-in-out infinite;
  }

  .sacred-modern-iqamah-panel-urgent,
  .sacred-modern-iqamah-panel-urgent .sacred-modern-iqamah-live-dot {
    animation: sacred-modern-heartbeat 0.85s ease-in-out infinite;
  }
}

@keyframes sacred-modern-iqamah-pulse {
  0%, 100% {
    opacity: 0.78;
    transform: scale(0.96);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes sacred-modern-iqamah-glow {
  0%, 100% {
    box-shadow: 0 22px 56px color-mix(in srgb, var(--color-primary) 18%, transparent);
  }

  50% {
    box-shadow: 0 24px 72px color-mix(in srgb, var(--color-secondary) 22%, transparent);
  }
}

@keyframes sacred-modern-heartbeat {
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
