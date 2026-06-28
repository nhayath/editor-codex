<script setup lang="ts">
import { getTenantInitials, getTenantLogoUrl } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  sticky?: boolean
  chromeStyle?: string
}>()

const menuOpen = ref(false)
const navItems = computed(() => props.tenant?.navItems ?? [])
const logoInitials = computed(() => getTenantInitials(props.tenant))
const logoUrl = computed(() => getTenantLogoUrl(props.tenant))
</script>

<template>
  <header
    id="top"
    class="@container z-30 border-b border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--color-bg)_88%,transparent)] shadow-[0_12px_34px_color-mix(in_srgb,var(--color-primary)_6%,transparent)] backdrop-blur"
    :class="sticky !== false ? 'sticky top-0' : ''"
  >
    <div class="tenant-container flex h-20 items-center justify-between gap-6 @4xl:h-24">
      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center gap-3"
      >
        <div class="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--color-primary)] text-white shadow-[0_12px_24px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_28%,transparent)]">
          <span class="pointer-events-none absolute inset-0 bg-[var(--color-secondary)] opacity-[0.14] [mask-image:url(/backgrounds/eight-point-star.svg)] [mask-position:center] [mask-repeat:repeat] [mask-size:44px]" aria-hidden="true" />
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="`${tenant?.name ?? 'Mosque'} logo`"
            class="size-full object-contain p-1.5"
          >
          <span v-else class="tenant-heading relative text-xl font-black leading-none">{{ logoInitials }}</span>
        </div>
        <span class="tenant-heading truncate text-xl font-bold text-[var(--color-primary)] @md:text-2xl">
          {{ tenant?.name }}
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 @5xl:flex">
        <UButton
          v-for="item in navItems"
          :key="item.id"
          :to="item.href"
          color="neutral"
          variant="ghost"
          size="sm"
          class="px-0 text-base font-bold text-[var(--color-text-muted)] hover:bg-transparent hover:text-[var(--color-primary)]"
          :label="item.label"
        />
      </nav>

      <div class="hidden items-center gap-4 @5xl:flex">
        <UButton
          to="#donate"
          color="neutral"
          label="Donate"
          trailing-icon="i-lucide-arrow-up-right"
          class="rounded-full bg-[var(--color-secondary)] px-7 font-black text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_88%,white)]"
        />
      </div>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-menu"
        size="sm"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        class="text-[var(--color-primary)] hover:text-[var(--color-accent)] @5xl:hidden"
        @click="menuOpen = !menuOpen"
      />
    </div>

    <nav
      v-if="menuOpen"
      class="tenant-container grid gap-2 border-t border-[color:color-mix(in_srgb,var(--color-text)_10%,transparent)] py-4 @5xl:hidden"
      aria-label="Mobile navigation"
    >
      <UButton
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        color="neutral"
        variant="ghost"
        size="sm"
        class="justify-start font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        :label="item.label"
        @click="menuOpen = false"
      />
      <UButton
        to="#donate"
        color="neutral"
        size="sm"
        label="Donate"
        class="mt-2 justify-center rounded-full bg-[var(--color-secondary)] font-black text-[var(--color-primary)]"
        @click="menuOpen = false"
      />
    </nav>
  </header>
</template>
