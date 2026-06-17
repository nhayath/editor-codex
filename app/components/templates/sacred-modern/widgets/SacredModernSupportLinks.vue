<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  items?: string
  variant?: string
  featuredIcon?: string
}>(), {
  title: 'Community Support',
  eyebrow: 'Get involved',
  items: '',
  variant: 'support-card',
  featuredIcon: 'islamic-community'
})

const links = computed(() => parsePipeRows(props.items, 4).map(([title, description, href, icon]) => ({
  title,
  description,
  href: href || '#',
  icon: icon || 'islamic-community'
})))
</script>

<template>
  <div class="@container grid h-full place-items-center rounded-[1.5rem] bg-[var(--color-surface)] p-6 shadow-[0_14px_32px_color-mix(in_srgb,var(--color-text)_10%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
    <div class="grid w-full gap-7 @md:grid-cols-2">
      <NuxtLink
        v-for="link in links"
        :key="link.title"
        :to="link.href"
        class="group grid min-h-32 place-items-center rounded-xl p-4 text-center transition hover:bg-[color:color-mix(in_srgb,var(--color-primary)_6%,transparent)]"
      >
        <span class="grid size-14 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_10%,white)] text-[var(--color-primary)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
          <IconGlyph :name="link.icon" class="size-6" />
        </span>
        <span class="mt-4 max-w-28 text-sm font-black leading-5 text-[var(--color-text)]">
          {{ link.title }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
