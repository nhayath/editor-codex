<script setup lang="ts">
const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  chromeStyle?: string
}>()

const year = new Date().getFullYear()
const navItems = computed(() => props.tenant?.navItems ?? [])
</script>

<template>
  <footer class="@container border-t border-[color:color-mix(in_srgb,var(--color-primary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_82%,var(--color-bg))] py-12">
    <div class="tenant-container grid gap-10 @2xl:grid-cols-[1.2fr_0.8fr_0.9fr]">
      <div>
        <div class="flex items-center gap-3">
          <div class="grid size-11 place-items-center rounded-full bg-[var(--color-primary)] text-white">
            <IconGlyph name="islamic-mosque" class="size-5" />
          </div>
          <p class="tenant-heading text-2xl font-bold text-[var(--color-text)]">
            {{ tenant?.name }}
          </p>
        </div>
        <p class="mt-4 max-w-lg text-sm leading-6 text-[var(--color-text-muted)]">
          {{ tenant?.settings?.aboutText || 'Prayer, learning, care, and connection throughout the week.' }}
        </p>
        <UButton
          to="#contact"
          color="primary"
          icon="i-lucide-calendar-days"
          label="Plan a visit"
          size="sm"
          class="mt-6 rounded-full bg-[var(--color-primary)] px-5 font-bold text-white"
        />
      </div>

      <div>
        <h2 class="tenant-heading text-lg font-bold text-[var(--color-text)]">
          Navigate
        </h2>
        <nav class="mt-4 grid gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
          <NuxtLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.href"
            class="hover:text-[var(--color-primary)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div>
        <h2 class="tenant-heading text-lg font-bold text-[var(--color-text)]">
          Contact
        </h2>
        <div class="mt-4 grid gap-3 text-sm text-[var(--color-text-muted)]">
          <span>{{ tenant?.settings?.address }}</span>
          <span>{{ tenant?.settings?.city }} {{ tenant?.settings?.postcode }}</span>
          <span>{{ tenant?.settings?.email }}</span>
          <span>{{ tenant?.settings?.phone }}</span>
        </div>
        <div class="mt-5 flex items-center gap-2">
          <UButton
            v-if="tenant?.settings?.facebook"
            :to="tenant.settings.facebook"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-facebook"
            size="xs"
            aria-label="Facebook"
          />
          <UButton
            v-if="tenant?.settings?.instagram"
            :to="tenant.settings.instagram"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-instagram"
            size="xs"
            aria-label="Instagram"
          />
          <UButton
            v-if="tenant?.settings?.youtube"
            :to="tenant.settings.youtube"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-youtube"
            size="xs"
            aria-label="YouTube"
          />
        </div>
      </div>
    </div>

    <div class="tenant-container mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[color:color-mix(in_srgb,var(--color-text)_8%,transparent)] pt-5 text-xs text-[var(--color-text-muted)]">
      <span>© {{ year }} {{ tenant?.name }}. All rights reserved.</span>
      <NuxtLink to="#top" class="font-semibold hover:text-[var(--color-primary)]">Back to top</NuxtLink>
    </div>
  </footer>
</template>
