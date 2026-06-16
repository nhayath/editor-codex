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
</script>

<template>
  <div class="@container rounded-lg bg-[var(--color-surface)] p-6 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
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
