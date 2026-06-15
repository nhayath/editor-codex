<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  maxItems?: number
  data?: Record<string, any>
}>(), {
  title: 'Upcoming events',
  variant: 'grid',
  maxItems: 3,
  data: () => ({})
})

const items = computed(() => (props.data?.events ?? []).slice(0, props.maxItems))

function formatDate(value?: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}
</script>

<template>
  <div class="grid gap-6">
    <div>
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        Programmes
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
    </div>

    <div :class="variant === 'list' ? 'grid gap-3' : 'grid gap-4 md:grid-cols-3'">
      <article
        v-for="event in items"
        :key="event.id"
        class="rounded-lg bg-[var(--color-surface)] p-5 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
      >
        <UBadge color="primary" variant="soft">
          {{ event.category || 'Event' }}
        </UBadge>
        <h3 class="mt-4 text-lg font-semibold text-[var(--color-text)]">
          {{ event.title }}
        </h3>
        <p class="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {{ event.description }}
        </p>
        <div class="mt-4 grid gap-2 text-sm text-[var(--color-text-muted)]">
          <span class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-days" class="size-4 text-[var(--color-primary)]" />
            {{ formatDate(event.date) }}
          </span>
          <span class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="size-4 text-[var(--color-primary)]" />
            {{ event.location }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>
