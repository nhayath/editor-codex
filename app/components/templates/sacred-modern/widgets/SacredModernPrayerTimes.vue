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

function updateCurrentSeconds() {
  const now = new Date()
  currentSeconds.value = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}

onMounted(() => {
  updateCurrentSeconds()
  const interval = window.setInterval(updateCurrentSeconds, 1000)
  onBeforeUnmount(() => window.clearInterval(interval))
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

const nextPrayer = computed(() => {
  const secondsNow = currentSeconds.value

  return featureRows.value.find((row) => {
    if (secondsNow === null) return row.time
    const prayerSeconds = secondsFromTime(row.time)
    return prayerSeconds !== null && prayerSeconds > secondsNow
  }) ?? featureRows.value.find(row => row.name === 'Asr') ?? featureRows.value[0]
})

const featureDate = computed(() => {
  const value = prayerTimes.value?.date
  if (!value) return 'Wednesday, May 24, 2026'

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
  const secondsNow = currentSeconds.value
  const prayerSeconds = secondsFromTime(nextPrayer.value?.time)
  if (secondsNow === null || prayerSeconds === null) return nextPrayer.value?.time ?? '--:--'

  const diff = Math.max(0, prayerSeconds - secondsNow)
  const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
  const seconds = Math.floor(diff % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
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
  <div class="@container flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-[var(--color-primary)] text-white shadow-[0_18px_42px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]">
    <div class="flex-1 p-6 @2xl:p-9">
      <div class="grid gap-4 @3xl:grid-cols-[1fr_auto] @3xl:items-start">
        <div>
          <h2 class="tenant-heading text-4xl font-bold leading-tight text-[var(--color-secondary)]">
            {{ title }}
          </h2>
          <p class="mt-1 text-sm font-semibold text-white/62 @md:text-base">
            {{ featureDate }} / {{ hijriDate }}
          </p>
        </div>

        <div
          v-if="showCountdown && nextPrayer"
          class="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-bold text-white/90"
        >
          <UIcon name="i-lucide-clock-3" class="size-4 text-[var(--color-secondary)]" />
          <span>{{ nextPrayer.name }} {{ countdownLabel }}</span>
          <span class="text-[var(--color-secondary)]">{{ remainingLabel }}</span>
        </div>
      </div>

      <div class="mt-10 grid gap-3 @md:grid-cols-2 @xl:grid-cols-5">
        <article
          v-for="row in featureRows"
          :key="row.name"
          class="grid min-h-36 place-items-center rounded-2xl p-4 text-center @xl:min-h-32 @xl:px-2 @2xl:px-3"
          :class="row.name === nextPrayer?.name ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[0_18px_34px_rgba(0,0,0,0.2)]' : 'text-white/82'"
        >
          <IconGlyph
            :name="row.icon"
            class="size-9 text-[var(--color-secondary)] @xl:size-8"
          />
          <div>
            <h3 class="mt-2 text-base font-bold @xl:text-sm @2xl:text-base">
              {{ row.name }}
            </h3>
            <p class="tenant-heading mt-2 text-3xl font-bold @xl:text-2xl @2xl:text-3xl">
              {{ row.time || '--:--' }}
            </p>
            <p
              v-if="showIqamah && row.iqamah"
              class="mt-1 text-xs font-semibold opacity-70 @xl:text-[0.65rem] @2xl:text-xs"
            >
              Iqamah {{ row.iqamah }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <div class="mt-auto grid gap-4 border-t border-white/10 bg-white/10 p-5 @2xl:grid-cols-[1fr_auto] @2xl:items-center @2xl:px-9">
      <div class="flex items-center gap-4">
        <span class="grid size-12 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_24%,transparent)] text-[var(--color-secondary)]">
          <IconGlyph name="islamic-quran" class="size-6" />
        </span>
        <h3 class="tenant-heading text-3xl font-bold text-[var(--color-secondary)]">
          Jumu'ah Prayers
        </h3>
      </div>

      <div class="grid gap-3 @md:grid-cols-2">
        <div
          v-for="item in jummahRows"
          :key="item.id ?? item.label"
          class="rounded-2xl border border-white/12 bg-white/10 px-5 py-4 text-center shadow-inner"
        >
          <p class="text-[0.65rem] font-bold uppercase tracking-normal text-white/44">
            {{ item.label || "Jumu'ah" }}
          </p>
          <p class="mt-1 text-xl font-bold text-white">
            {{ item.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
