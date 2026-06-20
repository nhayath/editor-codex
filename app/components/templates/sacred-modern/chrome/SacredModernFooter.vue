<script setup lang="ts">
import { footerExploreItems, getTenantInitials } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  chromeStyle?: string
}>()

const year = new Date().getFullYear()
const logoInitials = computed(() => getTenantInitials(props.tenant))
</script>

<template>
  <footer class="@container bg-[color:color-mix(in_srgb,var(--color-surface)_74%,var(--color-bg))] py-16">
    <div class="tenant-container grid gap-10 @3xl:grid-cols-2 @6xl:grid-cols-[1.1fr_0.8fr_1.1fr_0.8fr]">
      <div>
        <div class="flex items-center gap-3">
          <div class="grid size-10 place-items-center rounded-lg bg-[var(--color-primary)] text-white">
            <span class="tenant-heading text-lg font-black leading-none">{{ logoInitials }}</span>
          </div>
          <p class="tenant-heading text-xl font-bold text-[var(--color-primary)]">
            {{ tenant?.name }}
          </p>
        </div>
        <p class="mt-6 max-w-xs text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
          {{ tenant?.settings?.aboutText || 'A place of worship, unity, and positive change. Nourishing faith and serving the community.' }}
        </p>
      </div>

      <div>
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Explore
        </h2>
        <nav class="mt-5 grid gap-3 text-sm font-semibold text-[var(--color-text-muted)]">
          <NuxtLink
            v-for="item in footerExploreItems"
            :key="item.href"
            :to="item.href"
            class="hover:text-[var(--color-primary)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div>
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Contact
        </h2>
        <div class="mt-5 grid gap-4 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
          <span class="grid grid-cols-[1.25rem_1fr] gap-4">
            <UIcon name="i-lucide-map-pin" class="mt-1 size-5 text-[var(--color-primary)]" />
            <span>{{ tenant?.settings?.address }}, {{ tenant?.settings?.city }} {{ tenant?.settings?.postcode }}</span>
          </span>
          <span class="grid grid-cols-[1.25rem_1fr] gap-4">
            <UIcon name="i-lucide-mail" class="mt-1 size-5 text-[var(--color-primary)]" />
            <span>{{ tenant?.settings?.email }}</span>
          </span>
        </div>
      </div>

      <div>
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Follow Us
        </h2>
        <div class="mt-6 flex items-center gap-3">
          <UButton
            v-if="tenant?.settings?.facebook"
            :to="tenant.settings.facebook"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-facebook"
            class="rounded-full bg-[color:color-mix(in_srgb,var(--color-text)_5%,transparent)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            aria-label="Facebook"
          />
          <UButton
            v-if="tenant?.settings?.instagram"
            :to="tenant.settings.instagram"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-instagram"
            class="rounded-full bg-[color:color-mix(in_srgb,var(--color-text)_5%,transparent)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            aria-label="Instagram"
          />
          <UButton
            v-if="tenant?.settings?.youtube"
            :to="tenant.settings.youtube"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-youtube"
            class="rounded-full bg-[color:color-mix(in_srgb,var(--color-text)_5%,transparent)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            aria-label="YouTube"
          />
        </div>
      </div>
    </div>

    <div class="tenant-container mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-[color:color-mix(in_srgb,var(--color-text)_8%,transparent)] pt-8 text-xs font-semibold text-[var(--color-text-muted)]">
      <span>© {{ year }} {{ tenant?.name }}. All rights reserved.</span>
      <div class="flex items-center gap-5">
        <NuxtLink to="#top" class="hover:text-[var(--color-primary)]">Privacy Policy</NuxtLink>
        <NuxtLink to="#top" class="hover:text-[var(--color-primary)]">Terms of Service</NuxtLink>
      </div>
    </div>
  </footer>
</template>
