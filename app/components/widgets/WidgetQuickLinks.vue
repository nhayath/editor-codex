<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  items?: string
  variant?: string
  featuredIcon?: string
}>(), {
  title: 'Start here',
  eyebrow: 'Community shortcuts',
  items: '',
  variant: 'tiles',
  featuredIcon: 'islamic-mosque'
})

const links = computed(() => parsePipeRows(props.items, 4).map(([title, description, href, icon]) => ({
  title,
  description,
  href: href || '#',
  icon: icon || 'islamic-community'
})))
</script>

<template>
  <div class="@container h-full rounded-lg bg-[var(--color-surface)] p-6 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[var(--color-primary)]">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
          {{ title }}
        </h2>
      </div>
      <div class="grid size-12 shrink-0 place-items-center rounded-md bg-[color:color-mix(in_srgb,var(--color-primary)_12%,white)] text-[var(--color-primary)]">
        <IconGlyph :name="featuredIcon" class="size-6" />
      </div>
    </div>

    <div :class="variant === 'rail' ? 'mt-6 grid gap-3' : 'mt-6 grid gap-3 @lg:grid-cols-2'">
      <NuxtLink
        v-for="link in links"
        :key="link.title"
        :to="link.href"
        class="group grid min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border border-[color:color-mix(in_srgb,var(--color-text)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_92%,white)] p-4 transition hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--color-primary)_42%,transparent)] hover:shadow-[0_14px_32px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
      >
        <span class="grid size-11 place-items-center rounded-md bg-[var(--color-primary)] text-white">
          <IconGlyph :name="link.icon" class="size-5" />
        </span>
        <span class="min-w-0">
          <span class="block font-semibold text-[var(--color-text)]">{{ link.title }}</span>
          <span class="mt-1 block text-sm leading-5 text-[var(--color-text-muted)]">{{ link.description }}</span>
        </span>
        <UIcon name="i-lucide-arrow-up-right" class="size-4 text-[var(--color-primary)] opacity-60 transition group-hover:opacity-100" />
      </NuxtLink>
    </div>
  </div>
</template>
