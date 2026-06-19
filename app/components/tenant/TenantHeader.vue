<script setup lang="ts">
const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  sticky?: boolean
  style?: string
}>()

const menuOpen = ref(false)

const navItems = computed(() => props.tenant?.navItems ?? [])
</script>

<template>
  <header
    id="top"
    class="@container z-30 border-b border-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur"
    :class="sticky !== false ? 'sticky top-0' : ''"
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
          v-for="item in navItems"
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
        v-for="item in navItems"
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
