<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  subtitle?: string
  items?: string
  variant?: string
}>(), {
  title: 'Begin with clarity',
  eyebrow: 'Community pathways',
  subtitle: 'Three simple ways to connect with the masjid this week.',
  items: 'Visit the mosque|Prayer spaces, visitor guidance, and directions for first-time guests|#contact|i-lucide-map-pin\nLearn with us|Quran circles, reminders, and classes for every age and stage|#events|i-lucide-book-open\nServe the community|Volunteer, give time, and support neighbours with care|#donate|i-lucide-heart-handshake',
  variant: 'pathways'
})

const pathways = computed(() => parsePipeRows(props.items, 4)
  .map(([title, description, href, icon], index) => ({
    title,
    description,
    href: href || '#',
    icon: icon || ['i-lucide-map-pin', 'i-lucide-book-open', 'i-lucide-heart-handshake'][index] || 'i-lucide-star'
  }))
  .filter(item => item.title || item.description))
</script>

<template>
  <div class="@container relative isolate overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--color-surface)_92%,var(--color-bg))] p-5 shadow-[0_18px_44px_color-mix(in_srgb,var(--color-primary)_8%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] @lg:p-7">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-primary)] opacity-[0.035] [mask-image:url(/backgrounds/arabesque-vines.svg)] [mask-position:center] [mask-repeat:repeat] [mask-size:260px]" />

    <div class="grid gap-7 @4xl:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] @4xl:items-end">
      <div>
        <p class="text-xs font-black uppercase tracking-normal text-[var(--color-primary)]">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold leading-tight text-[var(--color-primary)] @md:text-4xl">
          {{ title }}
        </h2>
        <p class="mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
          {{ subtitle }}
        </p>
      </div>

      <div class="grid gap-3 @md:grid-cols-3">
        <NuxtLink
          v-for="(item, index) in pathways"
          :key="item.title"
          :to="item.href"
          class="group relative min-h-48 overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-text)_8%,transparent)] bg-[var(--color-surface)] p-5 shadow-[0_10px_24px_color-mix(in_srgb,var(--color-text)_5%,transparent)] transition hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--color-secondary)_34%,transparent)] hover:shadow-[0_18px_38px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
        >
          <span class="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)]" aria-hidden="true" />
          <span class="relative grid size-12 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_16%,var(--color-surface))] text-[var(--color-primary)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)]">
            <UIcon :name="item.icon" class="size-5" />
          </span>
          <span class="mt-6 block text-xs font-black uppercase tracking-normal text-[var(--color-secondary)]">
            0{{ index + 1 }}
          </span>
          <span class="tenant-heading mt-2 block text-2xl font-bold leading-tight text-[var(--color-primary)]">
            {{ item.title }}
          </span>
          <span class="mt-3 block text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
            {{ item.description }}
          </span>
          <span class="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--color-primary)]">
            Open
            <UIcon name="i-lucide-arrow-up-right" class="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
