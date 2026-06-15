<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  showIqamah?: boolean
  compact?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Next prayer',
  showIqamah: true,
  compact: false,
  data: () => ({})
})

const prayers = [
  ['Fajr', 'fajr', 'fajrIqamah'],
  ['Dhuhr', 'dhuhr', 'dhuhrIqamah'],
  ['Asr', 'asr', 'asrIqamah'],
  ['Maghrib', 'maghrib', 'maghribIqamah'],
  ['Isha', 'isha', 'ishaIqamah']
] as const

const nextPrayer = computed(() => {
  const data = (props.data?.prayerTimes ?? {}) as Record<string, string | undefined>
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const [name, adhanKey, iqamahKey] of prayers) {
    const value = props.showIqamah ? data[iqamahKey] || data[adhanKey] : data[adhanKey]
    if (!value) continue
    const parts = value.split(':').map(Number)
    const hours = parts[0] ?? 0
    const minutes = parts[1] ?? 0
    const total = hours * 60 + minutes
    if (total >= currentMinutes) {
      return { name, time: value, minutes: total - currentMinutes }
    }
  }

  const first = prayers[0]
  const time = data[first[2]] || data[first[1]] || '--:--'
  return { name: first[0], time, minutes: 0 }
})
</script>

<template>
  <div class="h-full rounded-lg bg-[var(--color-primary)] p-6 text-white">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-white/75">
          {{ title }}
        </p>
        <h3 class="tenant-heading mt-2 text-4xl font-bold">
          {{ nextPrayer.name }}
        </h3>
      </div>
      <UIcon name="i-lucide-timer" class="size-10 text-[var(--color-secondary)]" />
    </div>

    <div :class="compact ? 'mt-5' : 'mt-8'">
      <p class="text-5xl font-bold">
        {{ nextPrayer.time }}
      </p>
      <p class="mt-2 text-sm text-white/75">
        {{ nextPrayer.minutes > 0 ? `${nextPrayer.minutes} minutes remaining` : 'Starting soon' }}
      </p>
    </div>
  </div>
</template>
