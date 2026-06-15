<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  title?: string
  items?: string
  variant?: string
}>(), {
  title: 'Services',
  items: '',
  variant: 'grid'
})

const services = computed(() => parsePipeRows(props.items, 3).map(([title, description, icon]) => ({ title, description, icon: icon || 'i-lucide-sparkles' })))
</script>

<template>
  <div class="@container grid gap-6">
    <div>
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        What we offer
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
    </div>

    <div :class="variant === 'list' ? 'grid gap-3' : 'grid gap-4 @xl:grid-cols-3'">
      <article
        v-for="service in services"
        :key="service.title"
        class="rounded-lg bg-[var(--color-surface)] p-5 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]"
      >
        <div class="grid size-10 place-items-center rounded-md bg-[color:color-mix(in_srgb,var(--color-primary)_12%,white)] text-[var(--color-primary)]">
          <UIcon :name="service.icon" class="size-5" />
        </div>
        <h3 class="mt-4 font-semibold text-[var(--color-text)]">
          {{ service.title }}
        </h3>
        <p class="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {{ service.description }}
        </p>
      </article>
    </div>
  </div>
</template>
