<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  showIqamah?: boolean
  showSunrise?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Today Prayer Times',
  variant: 'cards',
  showIqamah: true,
  showSunrise: true,
  data: () => ({})
})

const prayerTimes = computed(() => props.data?.prayerTimes)
const rows = computed(() => {
  const prayer = prayerTimes.value ?? {}
  const base = [
    ['Fajr', prayer.fajr, prayer.fajrIqamah],
    ['Sunrise', prayer.sunrise, null],
    ['Dhuhr', prayer.dhuhr, prayer.dhuhrIqamah],
    ['Asr', prayer.asr, prayer.asrIqamah],
    ['Maghrib', prayer.maghrib, prayer.maghribIqamah],
    ['Isha', prayer.isha, prayer.ishaIqamah]
  ]

  return base.filter(([name]) => props.showSunrise || name !== 'Sunrise')
})

const featureRows = computed(() => rows.value.filter(([name]) => name !== 'Sunrise'))
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

function minutesFromTime(time?: unknown) {
  if (typeof time !== 'string') return null
  const [hoursRaw, minutesRaw] = time.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 60 + minutes
}

const nextPrayer = computed(() => {
  const minutesNow = currentMinutes.value

  return featureRows.value.find(([, time]) => {
    if (minutesNow === null) return true
    const prayerMinutes = minutesFromTime(time)
    return prayerMinutes !== null && prayerMinutes > minutesNow
  }) ?? featureRows.value.find(([name]) => name === 'Asr') ?? featureRows.value[0]
})

const iconMap: Record<string, string> = {
  Fajr: 'islamic-fajr',
  Dhuhr: 'islamic-dhuhr',
  Asr: 'islamic-asr',
  Maghrib: 'islamic-maghrib',
  Isha: 'islamic-isha'
}

const nextPrayerName = computed(() => nextPrayer.value?.[0] ?? 'Asr')
const nextPrayerTime = computed(() => nextPrayer.value?.[1] ?? '--:--')
const featureDate = computed(() => {
  const value = prayerTimes.value?.date
  if (!value) return 'Wednesday, May 24, 2026'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
})

function meridiem(time?: unknown) {
  const prayerMinutes = minutesFromTime(time)
  if (prayerMinutes === null) return ''
  return prayerMinutes < 12 * 60 ? 'AM' : 'PM'
}
</script>

<template>
  <div
    v-if="variant === 'feature-panel'"
    class="@container relative isolate overflow-hidden rounded-[1.75rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_62%,transparent)] bg-[var(--color-primary)] p-5 text-white shadow-[0_24px_70px_color-mix(in_srgb,var(--color-primary)_28%,transparent)] @lg:p-8"
  >
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,color-mix(in_srgb,var(--color-secondary)_18%,transparent),transparent_24%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_96%,black),color-mix(in_srgb,var(--color-primary)_82%,var(--color-accent)))]" />
    <div class="absolute inset-0 -z-10 bg-[url('/templates/mosque-hero-3.svg')] bg-cover bg-center opacity-[0.08] mix-blend-screen" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 opacity-35">
      <div class="absolute bottom-0 left-0 h-12 w-full bg-[color:color-mix(in_srgb,var(--color-primary)_78%,black)]" />
      <div class="absolute bottom-8 left-[8%] size-20 rounded-t-full bg-[color:color-mix(in_srgb,var(--color-primary)_82%,black)]" />
      <div class="absolute bottom-8 left-[20%] h-24 w-8 rounded-t-full bg-[color:color-mix(in_srgb,var(--color-primary)_82%,black)]" />
      <div class="absolute bottom-8 left-[31%] size-24 rounded-t-full bg-[color:color-mix(in_srgb,var(--color-primary)_82%,black)]" />
      <div class="absolute bottom-8 right-[13%] size-24 rounded-t-full bg-[color:color-mix(in_srgb,var(--color-primary)_82%,black)]" />
      <div class="absolute bottom-8 right-[4%] h-28 w-9 rounded-t-full bg-[color:color-mix(in_srgb,var(--color-primary)_82%,black)]" />
    </div>

    <div class="grid gap-5 @lg:grid-cols-[1fr_auto] @lg:items-start">
      <div>
        <h2 class="tenant-heading text-4xl font-bold text-[var(--color-secondary)] drop-shadow-sm @lg:text-5xl">
          {{ title }}
        </h2>
        <p class="mt-2 text-sm font-medium text-white/75 @lg:text-base">
          {{ featureDate }} <span class="px-2 text-[var(--color-secondary)]">•</span> 16 Dhul Qaadah 1447
        </p>
      </div>

      <div class="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner backdrop-blur @lg:px-5">
        <span class="text-2xl text-[var(--color-secondary)]">◴</span>
        <span class="text-sm font-semibold text-white"> {{ nextPrayerName }} time in </span>
        <span class="tenant-heading text-3xl font-bold text-[var(--color-secondary)]">{{ nextPrayerTime }}</span>
      </div>
    </div>

    <div class="mt-8 grid gap-3 rounded-2xl bg-white/[0.045] p-3 backdrop-blur @sm:grid-cols-2 @2xl:grid-cols-5 @2xl:gap-0 @2xl:p-0">
      <article
        v-for="[name, time, iqamah] in featureRows"
        :key="name"
        class="relative grid min-h-44 place-items-center rounded-2xl p-5 text-center @2xl:rounded-none"
        :class="name === nextPrayerName ? 'z-10 border border-[color:color-mix(in_srgb,var(--color-secondary)_70%,white)] bg-[color:color-mix(in_srgb,var(--color-surface)_98%,white)] text-[var(--color-primary)] shadow-[0_18px_40px_rgba(0,0,0,0.25)] @2xl:-my-6 @2xl:rounded-2xl' : 'text-white @2xl:border-l @2xl:border-white/10'"
      >
        <IconGlyph
          :name="iconMap[name] ?? 'islamic-prayer-times'"
          class="size-12 text-[var(--color-secondary)] drop-shadow"
        />
        <h3 class="tenant-heading mt-3 text-2xl font-bold">
          {{ name }}
        </h3>
        <p class="tenant-heading mt-4 text-4xl font-bold text-[var(--color-secondary)]">
          {{ time || '--:--' }}
        </p>
        <p class="mt-1 text-sm font-semibold" :class="name === nextPrayerName ? 'text-[var(--color-primary)]/70' : 'text-white/72'">
          {{ meridiem(time) }}
        </p>
        <p
          v-if="showIqamah && iqamah"
          class="mt-2 text-xs"
          :class="name === nextPrayerName ? 'text-[var(--color-primary)]/55' : 'text-white/48'"
        >
          Iqamah {{ iqamah }}
        </p>
        <span
          v-if="name === nextPrayerName"
          class="absolute -bottom-3 left-1/2 size-6 -translate-x-1/2 rotate-45 bg-[color:color-mix(in_srgb,var(--color-secondary)_86%,white)]"
          aria-hidden="true"
        />
      </article>
    </div>
  </div>

  <div
    v-else
    class="@container rounded-lg bg-[var(--color-surface)] p-6 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
  >
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-[var(--color-primary)]">
          {{ prayerTimes?.date }}
        </p>
        <h2 class="tenant-heading text-3xl font-bold text-[var(--color-text)]">
          {{ title }}
        </h2>
      </div>
      <UBadge color="primary" variant="soft">
        Today
      </UBadge>
    </div>

    <div
      v-if="variant === 'cards'"
      class="grid gap-3 @sm:grid-cols-2 @lg:grid-cols-3"
    >
      <div
        v-for="[name, time, iqamah] in rows"
        :key="name"
        class="rounded-md border border-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] p-4"
      >
        <p class="text-sm text-[var(--color-text-muted)]">
          {{ name }}
        </p>
        <p class="mt-1 text-2xl font-semibold text-[var(--color-text)]">
          {{ time || '--:--' }}
        </p>
        <p
          v-if="showIqamah && iqamah"
          class="mt-1 text-xs text-[var(--color-primary)]"
        >
          Iqamah {{ iqamah }}
        </p>
      </div>
    </div>

    <div
      v-else
      class="divide-y divide-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
    >
      <div
        v-for="[name, time, iqamah] in rows"
        :key="name"
        class="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-sm"
      >
        <span class="font-medium text-[var(--color-text)]">{{ name }}</span>
        <span class="text-[var(--color-text)]">{{ time || '--:--' }}</span>
        <span
          v-if="showIqamah"
          class="text-[var(--color-text-muted)]"
        >
          {{ iqamah || '' }}
        </span>
      </div>
    </div>
  </div>
</template>
