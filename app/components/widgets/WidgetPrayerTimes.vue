<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  showIqamah?: boolean
  showSunrise?: boolean
  showIcons?: boolean
  highlightNext?: boolean
  accent?: string
  data?: Record<string, any>
}>(), {
  title: 'Today Prayer Times',
  variant: 'cards',
  showIqamah: true,
  showSunrise: true,
  showIcons: true,
  highlightNext: true,
  accent: 'primary',
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

// Accent maps to a single themed colour used for icons + the active highlight.
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})
const activeTint = computed(() => `color-mix(in srgb, ${accentVar.value} 8%, var(--color-surface))`)
const hairline = 'color-mix(in srgb, var(--color-text) 12%, transparent)'

const containerClass = computed(() =>
  props.accent === 'soft'
    ? 'bg-[color:color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface))]'
    : 'bg-[var(--color-surface)]'
)
</script>

<template>
  <div
    class="@container rounded-lg p-6 ring-1"
    :class="containerClass"
    :style="{ '--hairline': hairline, '--accent': accentVar, '--active-tint': activeTint, boxShadow: 'none' }"
    style="--tw-ring-color: var(--hairline)"
  >
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold" :style="{ color: 'var(--accent)' }">
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
          ? { borderColor: 'var(--accent)', background: 'var(--active-tint)', boxShadow: 'inset 0 0 0 1px var(--accent)' }
          : { borderColor: 'var(--hairline)' }"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-[var(--color-text-muted)]">
            {{ row.name }}
          </p>
          <UIcon
            v-if="showIcons"
            :name="row.icon"
            class="size-5 shrink-0"
            :style="{ color: isActive(row.name) ? 'var(--accent)' : 'var(--color-text-muted)' }"
          />
        </div>
        <p class="mt-2 text-2xl font-semibold text-[var(--color-text)]">
          {{ row.time || '--:--' }}
        </p>
        <p
          v-if="showIqamah && row.iqamah"
          class="mt-1 text-xs"
          :style="{ color: 'var(--accent)' }"
        >
          Iqamah {{ row.iqamah }}
        </p>
        <span
          v-if="isActive(row.name)"
          class="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
          :style="{ background: 'var(--accent)' }"
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
          class="text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]"
          style="border-bottom: 1px solid var(--hairline)"
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
            ? { background: 'var(--active-tint)', boxShadow: 'inset 3px 0 0 var(--accent)' }
            : (i % 2 === 1 ? { background: 'color-mix(in srgb, var(--color-text) 3%, transparent)' } : {})"
        >
          <td class="py-3 pl-3 pr-2">
            <span class="flex items-center gap-2.5 font-medium text-[var(--color-text)]">
              <UIcon
                v-if="showIcons"
                :name="row.icon"
                class="size-4 shrink-0"
                :style="{ color: isActive(row.name) ? 'var(--accent)' : 'var(--color-text-muted)' }"
              />
              {{ row.name }}
              <span
                v-if="isActive(row.name)"
                class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
                :style="{ background: 'var(--accent)' }"
              >
                Next
              </span>
            </span>
          </td>
          <td class="py-3 pr-2 text-right tabular-nums text-[var(--color-text)]">
            {{ row.time || '--:--' }}
          </td>
          <td
            v-if="showIqamah"
            class="py-3 pr-3 text-right tabular-nums text-[var(--color-text-muted)]"
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
          ? { borderColor: 'var(--accent)', background: 'var(--active-tint)' }
          : { borderColor: 'var(--hairline)' }"
      >
        <UIcon
          v-if="showIcons"
          :name="row.icon"
          class="size-4 shrink-0"
          :style="{ color: isActive(row.name) ? 'var(--accent)' : 'var(--color-text-muted)' }"
        />
        <span class="font-medium text-[var(--color-text)]">{{ row.name }}</span>
        <span class="tabular-nums text-[var(--color-text-muted)]">{{ row.time || '--:--' }}</span>
        <span
          v-if="showIqamah && row.iqamah"
          class="tabular-nums text-xs"
          :style="{ color: 'var(--accent)' }"
        >· {{ row.iqamah }}</span>
      </div>
    </div>

    <!-- List (fallback, also used by template variants like 'feature-panel') -->
    <div
      v-else
      class="divide-y"
      style="border-color: var(--hairline)"
    >
      <div
        v-for="row in rows"
        :key="row.name"
        class="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-3 text-sm"
        :style="isActive(row.name)
          ? { background: 'var(--active-tint)', boxShadow: 'inset 3px 0 0 var(--accent)' }
          : {}"
      >
        <span class="flex items-center gap-2.5 font-medium text-[var(--color-text)]">
          <UIcon
            v-if="showIcons"
            :name="row.icon"
            class="size-4 shrink-0"
            :style="{ color: isActive(row.name) ? 'var(--accent)' : 'var(--color-text-muted)' }"
          />
          {{ row.name }}
          <span
            v-if="isActive(row.name)"
            class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
            :style="{ background: 'var(--accent)' }"
          >
            Next
          </span>
        </span>
        <span class="tabular-nums text-[var(--color-text)]">{{ row.time || '--:--' }}</span>
        <span
          v-if="showIqamah"
          class="tabular-nums text-[var(--color-text-muted)]"
        >
          {{ row.iqamah || '' }}
        </span>
      </div>
    </div>
  </div>
</template>
