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
    class="fattan-header @container z-30 overflow-hidden border border-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_88%,white)] shadow-[0_18px_50px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] backdrop-blur"
    :class="sticky !== false ? 'sticky top-0' : ''"
  >
    <div class="pointer-events-none h-1.5 bg-[linear-gradient(90deg,transparent,var(--color-secondary),transparent)] opacity-80" />
    <div class="tenant-container grid min-h-24 grid-cols-[1fr_auto] items-center gap-4 py-4 @5xl:grid-cols-[1fr_auto_1fr]">
      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center gap-4"
      >
        <div class="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--color-primary)] text-white shadow-[0_16px_34px_color-mix(in_srgb,var(--color-primary)_22%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]">
          <span class="pointer-events-none absolute inset-0 bg-[var(--color-secondary)] opacity-[0.13] [mask-image:url(/backgrounds/eight-point-star.svg)] [mask-position:center] [mask-repeat:repeat] [mask-size:46px]" aria-hidden="true" />
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="`${tenant?.name ?? 'Mosque'} logo`"
            class="size-full object-contain p-1.5"
          >
          <span v-else class="tenant-heading text-xl font-black leading-none">{{ logoInitials }}</span>
        </div>
        <span class="min-w-0">
          <span class="hidden text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--color-secondary)] @sm:block">Community mosque</span>
          <span class="tenant-heading block text-lg font-bold leading-tight text-[var(--color-primary)] @sm:text-xl @3xl:text-2xl">{{ tenant?.name }}</span>
        </span>
      </NuxtLink>

      <nav class="hidden rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_24%,transparent)] bg-white/72 p-1 shadow-[0_12px_26px_color-mix(in_srgb,var(--color-primary)_8%,transparent)] @5xl:flex">
        <UButton
          v-for="item in navItems"
          :key="item.id"
          :to="item.href"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full px-4 font-black text-[var(--color-primary)] hover:bg-[var(--color-secondary)] hover:text-white"
          :label="item.label"
        />
      </nav>

      <div class="flex items-center justify-end gap-2">
        <UButton
          to="#donate"
          color="neutral"
          icon="i-lucide-heart"
          label="Support"
          size="sm"
          class="hidden rounded-full bg-[var(--color-secondary)] px-6 font-black text-white hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_88%,black)] @4xl:inline-flex"
        />
        <UButton
          color="neutral"
          icon="i-lucide-align-justify"
          size="sm"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          class="rounded-full bg-[var(--color-primary)] text-white hover:bg-[color:color-mix(in_srgb,var(--color-primary)_88%,black)] @5xl:hidden"
          @click="menuOpen = !menuOpen"
        />
      </div>
    </div>

    <nav
      v-if="menuOpen"
      class="tenant-container grid gap-3 border-t border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] py-4 @5xl:hidden"
      aria-label="Mobile navigation"
    >
      <UButton
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        color="neutral"
        variant="ghost"
        size="sm"
        class="justify-between rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-white/70 px-4 font-black text-[var(--color-primary)]"
        trailing-icon="i-lucide-arrow-up-right"
        :label="item.label"
        @click="menuOpen = false"
      />
      <UButton
        to="#donate"
        color="neutral"
        icon="i-lucide-heart"
        label="Support the mosque"
        size="sm"
        class="justify-center rounded-full bg-[var(--color-secondary)] font-black text-white"
        @click="menuOpen = false"
      />
    </nav>
  </header>
</template>
