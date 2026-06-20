<script setup lang="ts">
import { getTenantLogoUrl } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  sticky?: boolean
  chromeStyle?: string
}>()

const menuOpen = ref(false)
const navItems = computed(() => props.tenant?.navItems ?? [])
const leftNavItems = computed(() => navItems.value.slice(0, Math.ceil(navItems.value.length / 2)))
const rightNavItems = computed(() => navItems.value.slice(Math.ceil(navItems.value.length / 2)))
const logoUrl = computed(() => getTenantLogoUrl(props.tenant))
</script>

<template>
  <header
    id="top"
    class="@container z-30 border-b border-[color:color-mix(in_srgb,var(--color-primary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_90%,transparent)] backdrop-blur-xl"
    :class="sticky !== false ? 'sticky top-0' : ''"
  >
    <div class="tenant-container grid h-[4.75rem] grid-cols-[1fr_auto_1fr] items-center gap-4">
      <nav class="hidden min-w-0 items-center gap-1 @5xl:flex">
        <UButton
          v-for="item in leftNavItems"
          :key="item.id"
          :to="item.href"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full px-4 font-semibold text-[var(--color-text-muted)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_7%,transparent)] hover:text-[var(--color-primary)]"
          :label="item.label"
        />
      </nav>

      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center justify-center gap-3"
      >
        <div class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--color-primary)] text-white shadow-[0_12px_30px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="`${tenant?.name ?? 'Mosque'} logo`"
            class="size-full object-contain p-1.5"
          >
          <IconGlyph v-else name="islamic-mosque" class="size-5" />
        </div>
        <span class="tenant-heading hidden max-w-48 truncate text-center text-xl font-bold text-[var(--color-text)] @2xl:block">
          {{ tenant?.name }}
        </span>
      </NuxtLink>

      <div class="flex min-w-0 items-center justify-end gap-2">
        <nav class="hidden items-center gap-1 @5xl:flex">
          <UButton
            v-for="item in rightNavItems"
            :key="item.id"
            :to="item.href"
            color="neutral"
            variant="ghost"
            size="sm"
            class="rounded-full px-4 font-semibold text-[var(--color-text-muted)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_7%,transparent)] hover:text-[var(--color-primary)]"
            :label="item.label"
          />
        </nav>

        <UButton
          to="#donate"
          color="primary"
          icon="i-lucide-heart-handshake"
          label="Donate"
          size="sm"
          class="hidden rounded-full bg-[var(--color-primary)] px-5 font-bold text-white hover:bg-[color:color-mix(in_srgb,var(--color-primary)_88%,black)] @4xl:inline-flex"
        />

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-menu"
          size="sm"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          class="rounded-full border border-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_8%,transparent)] @5xl:hidden"
          @click="menuOpen = !menuOpen"
        />
      </div>
    </div>

    <nav
      v-if="menuOpen"
      class="tenant-container grid gap-2 border-t border-[color:color-mix(in_srgb,var(--color-primary)_10%,transparent)] py-4 text-center @5xl:hidden"
      aria-label="Mobile navigation"
    >
      <UButton
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        color="neutral"
        variant="ghost"
        size="sm"
        class="justify-center rounded-full font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        :label="item.label"
        @click="menuOpen = false"
      />
      <UButton
        to="#donate"
        color="primary"
        size="sm"
        icon="i-lucide-heart-handshake"
        label="Donate"
        class="mt-2 justify-center rounded-full bg-[var(--color-primary)] font-bold text-white"
        @click="menuOpen = false"
      />
    </nav>
  </header>
</template>
