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

const nextPrayer = computed(() => {
  const data = (props.data?.prayerTimes ?? {}) as Record<string, string | undefined>
  const minutesNow = currentMinutes.value

  for (const [name, adhanKey, iqamahKey] of prayers) {
    const value = props.showIqamah ? data[iqamahKey] || data[adhanKey] : data[adhanKey]
    if (!value) continue
    const parts = value.split(':').map(Number)
    const hours = parts[0] ?? 0
    const minutes = parts[1] ?? 0
    const total = hours * 60 + minutes
    if (minutesNow === null || total >= minutesNow) {
      return { name, time: value, minutes: minutesNow === null ? null : total - minutesNow }
    }
  }

  const first = prayers[0]
  const time = data[first[2]] || data[first[1]] || '--:--'
  return { name: first[0], time, minutes: currentMinutes.value === null ? null : 0 }
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
      <IconGlyph name="islamic-prayer-times" class="size-10 text-[var(--color-secondary)]" />
    </div>

    <div :class="compact ? 'mt-5' : 'mt-8'">
      <p class="text-5xl font-bold">
        {{ nextPrayer.time }}
      </p>
      <p class="mt-2 text-sm text-white/75">
        {{ nextPrayer.minutes === null ? 'Today' : nextPrayer.minutes > 0 ? `${nextPrayer.minutes} minutes remaining` : 'Starting soon' }}
      </p>
    </div>
  </div>
</template>
