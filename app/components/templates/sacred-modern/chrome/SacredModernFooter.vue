<script setup lang="ts">
import { getTenantFooterLinks, getTenantInitials } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  chromeStyle?: string
}>()

const year = new Date().getFullYear()
const logoInitials = computed(() => getTenantInitials(props.tenant))
const footerLinks = computed(() => getTenantFooterLinks(props.tenant))
</script>

<template>
  <footer class="@container relative isolate overflow-hidden bg-[var(--color-primary)] py-16 text-white">
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_0%,color-mix(in_srgb,var(--color-secondary)_22%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_srgb,var(--color-primary)_94%,black),var(--color-primary))]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.065] [mask-image:url(/backgrounds/arabesque-vines.svg)] [mask-position:top_center] [mask-repeat:repeat] [mask-size:260px]" />

    <div class="tenant-container grid gap-10 @3xl:grid-cols-2 @6xl:grid-cols-[1.1fr_0.8fr_1.1fr_0.8fr]">
      <div>
        <div class="flex items-center gap-3">
          <div class="relative grid size-11 place-items-center overflow-hidden rounded-lg bg-[var(--color-secondary)] text-[var(--color-primary)]">
            <span class="pointer-events-none absolute inset-0 bg-white opacity-20 [mask-image:url(/backgrounds/eight-point-star.svg)] [mask-position:center] [mask-repeat:repeat] [mask-size:42px]" aria-hidden="true" />
            <span class="tenant-heading relative text-lg font-black leading-none">{{ logoInitials }}</span>
          </div>
          <p class="tenant-heading text-xl font-bold text-[var(--color-secondary)]">
            {{ tenant?.name }}
          </p>
        </div>
        <p class="mt-6 max-w-xs text-sm font-semibold leading-6 text-white/68">
          {{ tenant?.settings?.aboutText || 'A place of worship, unity, and positive change. Nourishing faith and serving the community.' }}
        </p>
      </div>

      <div v-if="footerLinks.length">
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Explore
        </h2>
        <nav class="mt-5 grid gap-3 text-sm font-semibold text-white/68">
          <NuxtLink
            v-for="item in footerLinks"
            :key="item.id ?? item.href"
            :to="item.href"
            class="hover:text-[var(--color-secondary)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div>
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Contact
        </h2>
        <div class="mt-5 grid gap-4 text-sm font-semibold leading-6 text-white/68">
          <span class="grid grid-cols-[1.25rem_1fr] gap-4">
            <UIcon name="i-lucide-map-pin" class="mt-1 size-5 text-[var(--color-secondary)]" />
            <span>{{ tenant?.settings?.address }}, {{ tenant?.settings?.city }} {{ tenant?.settings?.postcode }}</span>
          </span>
          <span class="grid grid-cols-[1.25rem_1fr] gap-4">
            <UIcon name="i-lucide-mail" class="mt-1 size-5 text-[var(--color-secondary)]" />
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
            class="rounded-full bg-white/8 text-white/68 hover:text-[var(--color-secondary)]"
            aria-label="Facebook"
          />
          <UButton
            v-if="tenant?.settings?.instagram"
            :to="tenant.settings.instagram"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-instagram"
            class="rounded-full bg-white/8 text-white/68 hover:text-[var(--color-secondary)]"
            aria-label="Instagram"
          />
          <UButton
            v-if="tenant?.settings?.youtube"
            :to="tenant.settings.youtube"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-lucide-youtube"
            class="rounded-full bg-white/8 text-white/68 hover:text-[var(--color-secondary)]"
            aria-label="YouTube"
          />
        </div>
      </div>
    </div>

    <div class="tenant-container mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-8 text-xs font-semibold text-white/58">
      <span>© {{ year }} {{ tenant?.name }}. All rights reserved.</span>
      <NuxtLink to="#top" class="hover:text-[var(--color-secondary)]">Back to top</NuxtLink>
    </div>
  </footer>
</template>
