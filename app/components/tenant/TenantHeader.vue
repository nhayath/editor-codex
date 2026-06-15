<script setup lang="ts">
defineProps<{
  tenant?: Record<string, any> | null
}>()
</script>

<template>
  <header
    id="top"
    class="sticky top-0 z-30 border-b border-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur"
  >
    <div class="tenant-container flex h-16 items-center justify-between gap-4">
      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center gap-3"
      >
        <div class="grid size-10 shrink-0 place-items-center rounded-md bg-[var(--color-primary)] text-white">
          <UIcon name="i-lucide-moon-star" class="size-5" />
        </div>
        <span class="tenant-heading truncate text-xl font-bold text-[var(--color-text)]">
          {{ tenant?.name }}
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <UButton
          v-for="item in tenant?.navItems ?? []"
          :key="item.id"
          :to="item.href"
          color="neutral"
          variant="ghost"
          size="sm"
          :label="item.label"
        />
      </nav>

      <UButton
        to="#contact"
        color="primary"
        icon="i-lucide-mail"
        label="Contact"
        size="sm"
      />
    </div>
  </header>
</template>
