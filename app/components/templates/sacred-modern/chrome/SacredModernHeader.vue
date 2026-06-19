<script setup lang="ts">
import { getTenantInitials, sacredModernNavItems } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  sticky?: boolean
  style?: string
}>()

const menuOpen = ref(false)
const logoInitials = computed(() => getTenantInitials(props.tenant))
</script>

<template>
  <header
    id="top"
    class="@container z-30 bg-[color:color-mix(in_srgb,var(--color-bg)_94%,transparent)] backdrop-blur"
    :class="sticky !== false ? 'sticky top-0' : ''"
  >
    <div class="tenant-container flex h-24 items-center justify-between gap-6">
      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center gap-3"
      >
        <div class="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] text-white shadow-[0_12px_24px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]">
          <span class="tenant-heading text-xl font-black leading-none">{{ logoInitials }}</span>
        </div>
        <span class="tenant-heading truncate text-2xl font-bold text-[var(--color-primary)]">
          {{ tenant?.name }}
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 @5xl:flex">
        <UButton
          v-for="item in sacredModernNavItems"
          :key="item.href"
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
          to="#top"
          color="neutral"
          variant="ghost"
          icon="i-lucide-search"
          aria-label="Search"
          class="text-[var(--color-text)] hover:bg-transparent hover:text-[var(--color-primary)]"
        />
        <UButton
          to="#contact"
          color="neutral"
          variant="ghost"
          label="Login"
          class="px-0 font-bold text-[var(--color-text)] hover:bg-transparent hover:text-[var(--color-primary)]"
        />
        <UButton
          to="#donate"
          color="neutral"
          label="Donate"
          class="rounded-full bg-[var(--color-secondary)] px-7 font-black text-white hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_88%,black)]"
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
        v-for="item in sacredModernNavItems"
        :key="item.href"
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
        class="mt-2 justify-center rounded-full bg-[var(--color-secondary)] font-black text-white"
        @click="menuOpen = false"
      />
    </nav>
  </header>
</template>
