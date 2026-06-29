<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  variant?: string
  maxItems?: number
  data?: Record<string, any>
}>(), {
  title: 'Upcoming Events',
  eyebrow: 'Upcoming Events',
  variant: 'compact-list',
  maxItems: 3,
  data: () => ({})
})

const fallbackEvents = [
  { id: 'youth', title: 'Youth Halaqah', date: '2026-05-25', location: 'Main Hall', category: '09:30 AM' },
  { id: 'quran', title: "Qur'an Reading", date: '2026-05-31', location: 'Library', category: '07:00 PM' }
]

const items = computed(() => {
  const events = props.data?.events?.length ? props.data.events : fallbackEvents
  return events.slice(0, props.maxItems)
})

function dateParts(value?: string) {
  if (!value) return { month: 'May', day: '--' }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { month: '', day: value }

  return {
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date),
    day: new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date)
  }
}
</script>

<template>
  <div class="@container h-full rounded-lg bg-[var(--color-surface)] p-5 shadow-[0_14px_32px_color-mix(in_srgb,var(--color-text)_8%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] @lg:p-7">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-black uppercase tracking-normal text-[var(--color-primary)]">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-primary)] @md:text-4xl">
          {{ title }}
        </h2>
      </div>
      <span class="hidden h-px min-w-24 flex-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-secondary)_46%,transparent),transparent)] @md:block" />
    </div>

    <div class="mt-7 grid gap-4">
      <article
        v-for="event in items"
        :key="event.id"
        class="grid gap-4 rounded-lg border border-[color:color-mix(in_srgb,var(--color-text)_8%,transparent)] bg-[color:color-mix(in_srgb,var(--color-bg)_58%,var(--color-surface))] p-4 @md:grid-cols-[3.75rem_1fr_auto] @md:items-center"
      >
        <div class="grid aspect-square w-16 place-items-center rounded-lg bg-[color:color-mix(in_srgb,var(--color-secondary)_16%,var(--color-surface))] text-center ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] @md:w-auto">
          <span>
            <span class="block text-[0.65rem] font-black uppercase tracking-normal text-[var(--color-text-muted)]">{{ dateParts(event.date).month }}</span>
            <span class="-mt-1 block text-xl font-black text-[var(--color-primary)]">{{ dateParts(event.date).day }}</span>
          </span>
        </div>

        <div class="min-w-0">
          <h3 class="font-bold leading-6 text-[var(--color-text)]">
            {{ event.title }}
          </h3>
          <p class="mt-1 text-sm font-semibold leading-5 text-[var(--color-text-muted)]">
            {{ event.category || 'Event' }} / {{ event.location || 'Mosque' }}
          </p>
        </div>

        <UButton
          :to="`#${event.id}`"
          color="neutral"
          variant="soft"
          size="xs"
          class="w-fit rounded-md bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,var(--color-surface))] px-3 font-bold text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_22%,var(--color-surface))]"
          label="Details"
          trailing-icon="i-lucide-arrow-up-right"
        />
      </article>
    </div>
  </div>
</template>
