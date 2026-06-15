<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: string
  maxItems?: number
  showPinnedOnly?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Announcements',
  variant: 'cards',
  maxItems: 3,
  showPinnedOnly: false,
  data: () => ({})
})

const items = computed(() => {
  const announcements = props.data?.announcements ?? []
  return announcements
    .filter((item: any) => !props.showPinnedOnly || item.isPinned)
    .slice(0, props.maxItems)
})
</script>

<template>
  <div class="grid gap-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[var(--color-primary)]">
          Notices
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
          {{ title }}
        </h2>
      </div>
      <UIcon name="i-lucide-megaphone" class="size-8 text-[var(--color-secondary)]" />
    </div>

    <div :class="variant === 'list' ? 'grid gap-3' : 'grid gap-4 md:grid-cols-3'">
      <article
        v-for="item in items"
        :key="item.id"
        class="rounded-lg bg-[var(--color-surface)] p-5 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
      >
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-semibold text-[var(--color-text)]">
            {{ item.title }}
          </h3>
          <UBadge
            v-if="item.isPinned || item.priority === 'URGENT'"
            :color="item.priority === 'URGENT' ? 'warning' : 'primary'"
            variant="soft"
          >
            {{ item.priority === 'URGENT' ? 'Urgent' : 'Pinned' }}
          </UBadge>
        </div>
        <p class="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {{ item.content }}
        </p>
      </article>
    </div>
  </div>
</template>
