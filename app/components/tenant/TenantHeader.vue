<script setup lang="ts">
const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
}>()

const menuOpen = ref(false)

const navItems = computed(() => props.tenant?.navItems ?? [])
const isSacredModern = computed(() => props.templateId === 'sacred-modern')
const sacredModernNavItems = [
  { id: 'prayer-times', label: 'Prayer Times', href: '#prayer-times' },
  { id: 'events', label: 'Events', href: '#events' },
  { id: 'announcements', label: 'Announcements', href: '#announcements' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' }
]
const displayedNavItems = computed(() => isSacredModern.value ? sacredModernNavItems : navItems.value)

const logoInitials = computed(() => {
  const name = typeof props.tenant?.name === 'string' ? props.tenant.name : ''
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()

  return initials || 'SM'
})
</script>

<template>
  <header
    v-if="isSacredModern"
    id="top"
    class="@container sticky top-0 z-30 bg-[color:color-mix(in_srgb,var(--color-bg)_94%,transparent)] backdrop-blur"
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
          v-for="item in displayedNavItems"
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
        v-for="item in displayedNavItems"
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
        class="mt-2 justify-center rounded-full bg-[var(--color-secondary)] font-black text-white"
        @click="menuOpen = false"
      />
    </nav>
  </header>

  <header
    v-else
    id="top"
    class="@container sticky top-0 z-30 border-b border-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur"
  >
    <div class="tenant-container flex h-16 items-center justify-between gap-4">
      <NuxtLink
        :to="`/site/${tenant?.slug ?? ''}`"
        class="flex min-w-0 items-center gap-3"
      >
        <div class="grid size-10 shrink-0 place-items-center rounded-md bg-[var(--color-primary)] text-white">
          <IconGlyph name="islamic-mosque" class="size-5" />
        </div>
        <span class="tenant-heading truncate text-xl font-bold text-[var(--color-text)]">
          {{ tenant?.name }}
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 @4xl:flex">
        <UButton
          v-for="item in displayedNavItems"
          :key="item.id"
          :to="item.href"
          color="neutral"
          variant="ghost"
          size="sm"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          :label="item.label"
        />
      </nav>

      <div class="hidden @4xl:block">
        <UButton
          to="#contact"
          color="primary"
          icon="i-lucide-mail"
          label="Contact"
          size="sm"
          class="bg-[var(--color-accent)] text-white hover:bg-[color:color-mix(in_srgb,var(--color-accent)_86%,black)]"
        />
      </div>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-menu"
        size="sm"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        class="text-[var(--color-primary)] hover:text-[var(--color-accent)] @4xl:hidden"
        @click="menuOpen = !menuOpen"
      />
    </div>

    <nav
      v-if="menuOpen"
      class="tenant-container grid gap-2 border-t border-[color:color-mix(in_srgb,var(--color-text)_10%,transparent)] py-3 @4xl:hidden"
      aria-label="Mobile navigation"
    >
      <UButton
        v-for="item in displayedNavItems"
        :key="item.id"
        :to="item.href"
        color="neutral"
        variant="ghost"
        size="sm"
        class="justify-start text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        :label="item.label"
        @click="menuOpen = false"
      />
    </nav>
  </header>
</template>
