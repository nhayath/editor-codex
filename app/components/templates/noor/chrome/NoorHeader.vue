<script setup lang="ts">
import { getTenantInitials, getTenantLogoUrl } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  sticky?: boolean
  style?: string
}>()

const menuOpen = ref(false)
const navItems = computed(() => props.tenant?.navItems ?? [])
const logoInitials = computed(() => getTenantInitials(props.tenant, 'N'))
const logoUrl = computed(() => getTenantLogoUrl(props.tenant))
</script>

<template>
  <header
    id="top"
    class="@container z-30 border-b border-white/10 !bg-[var(--color-primary)] text-white shadow-[0_18px_42px_color-mix(in_srgb,var(--color-primary)_24%,transparent)]"
    :class="sticky !== false ? 'sticky top-0' : ''"
  >
    <div class="tenant-container flex min-h-20 items-center justify-between gap-4 py-3">
      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center gap-3"
      >
        <div class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-sm bg-[var(--color-secondary)] text-[var(--color-primary)]">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="`${tenant?.name ?? 'Mosque'} logo`"
            class="size-full object-contain p-1"
          >
          <span v-else class="tenant-heading text-lg font-black leading-none">{{ logoInitials }}</span>
        </div>
        <span class="tenant-heading truncate text-xl font-bold text-white">
          {{ tenant?.name }}
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 @5xl:flex">
        <UButton
          v-for="item in navItems"
          :key="item.id"
          :to="item.href"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-sm px-4 font-bold text-white/76 hover:bg-white/10 hover:text-white"
          :label="item.label"
        />
      </nav>

      <div class="hidden items-center gap-2 @4xl:flex">
        <UButton
          to="#prayer-times"
          color="neutral"
          variant="ghost"
          icon="i-lucide-clock"
          label="Times"
          size="sm"
          class="rounded-sm text-white hover:bg-white/10"
        />
        <UButton
          to="#donate"
          color="neutral"
          icon="i-lucide-arrow-up-right"
          label="Give"
          size="sm"
          class="rounded-sm bg-[var(--color-secondary)] px-5 font-black text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_88%,white)]"
        />
      </div>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-list"
        size="sm"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        class="rounded-sm border border-white/20 text-white hover:bg-white/10 @5xl:hidden"
        @click="menuOpen = !menuOpen"
      />
    </div>

    <nav
      v-if="menuOpen"
      class="tenant-container grid gap-2 border-t border-white/12 py-4 @5xl:hidden"
      aria-label="Mobile navigation"
    >
      <UButton
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        color="neutral"
        variant="ghost"
        size="sm"
        class="justify-between rounded-sm px-3 font-bold text-white/80 hover:bg-white/10 hover:text-white"
        trailing-icon="i-lucide-chevron-right"
        :label="item.label"
        @click="menuOpen = false"
      />
      <div class="mt-2 grid grid-cols-2 gap-2">
        <UButton
          to="#prayer-times"
          color="neutral"
          variant="ghost"
          icon="i-lucide-clock"
          label="Times"
          size="sm"
          class="justify-center rounded-sm border border-white/16 text-white"
          @click="menuOpen = false"
        />
        <UButton
          to="#donate"
          color="neutral"
          icon="i-lucide-arrow-up-right"
          label="Give"
          size="sm"
          class="justify-center rounded-sm bg-[var(--color-secondary)] font-black text-[var(--color-primary)]"
          @click="menuOpen = false"
        />
      </div>
    </nav>
  </header>
</template>
