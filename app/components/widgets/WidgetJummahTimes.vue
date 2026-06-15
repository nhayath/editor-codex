<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  showLocation?: boolean
  data?: Record<string, any>
}>(), {
  title: "Jumu'ah prayers",
  showLocation: true,
  data: () => ({})
})
</script>

<template>
  <div class="h-full rounded-lg bg-[var(--color-surface)] p-6 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
    <div class="mb-5 flex items-center justify-between gap-4">
      <h3 class="tenant-heading text-2xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h3>
      <UIcon name="i-lucide-calendar-clock" class="size-6 text-[var(--color-primary)]" />
    </div>

    <div class="grid gap-3">
      <div
        v-for="item in data?.jummahTimes ?? []"
        :key="item.id"
        class="rounded-md border border-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="font-semibold text-[var(--color-text)]">
            {{ item.label || 'Jumuah' }}
          </p>
          <p class="text-xl font-bold text-[var(--color-primary)]">
            {{ item.time }}
          </p>
        </div>
        <p
          v-if="showLocation && item.location"
          class="mt-1 text-sm text-[var(--color-text-muted)]"
        >
          {{ item.location }}
        </p>
      </div>
    </div>
  </div>
</template>
