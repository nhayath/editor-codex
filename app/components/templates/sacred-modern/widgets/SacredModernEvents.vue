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
  maxItems: 2,
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
  <div class="@container h-full rounded-[1.5rem] bg-[var(--color-surface)] p-6 shadow-[0_14px_32px_color-mix(in_srgb,var(--color-text)_10%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
    <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
      {{ eyebrow || title }}
    </h2>

    <div class="mt-7 grid gap-5">
      <article
        v-for="event in items"
        :key="event.id"
        class="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4"
      >
        <div class="grid aspect-square place-items-center rounded-lg bg-[color:color-mix(in_srgb,var(--color-text)_7%,transparent)] text-center">
          <span class="block text-[0.65rem] font-black uppercase tracking-normal text-[var(--color-text-muted)]">{{ dateParts(event.date).month }}</span>
          <span class="-mt-1 block text-lg font-black text-[var(--color-primary)]">{{ dateParts(event.date).day }}</span>
        </div>

        <div class="min-w-0">
          <h3 class="truncate font-bold text-[var(--color-text)]">
            {{ event.title }}
          </h3>
          <p class="mt-1 truncate text-sm font-semibold text-[var(--color-text-muted)]">
            {{ event.category || 'Event' }} / {{ event.location || 'Mosque' }}
          </p>
        </div>

        <UButton
          :to="`#${event.id}`"
          color="neutral"
          variant="soft"
          size="xs"
          class="rounded-md bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,white)] px-3 font-bold text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_20%,white)]"
          label="Details"
        />
      </article>
    </div>
  </div>
</template>
