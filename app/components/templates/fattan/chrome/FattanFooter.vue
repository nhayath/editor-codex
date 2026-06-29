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
  <footer class="fattan-footer @container relative isolate overflow-hidden bg-[var(--color-primary)] py-14 text-[var(--color-surface)]">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.07] [mask-image:url(/backgrounds/mihrab-arches.svg)] [mask-position:top_center] [mask-repeat:repeat] [mask-size:250px]" />
    <div class="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-secondary)_30%,transparent),transparent_68%)]" />
    <div class="tenant-container grid gap-10 @2xl:grid-cols-[1.2fr_0.8fr_1fr]">
      <div>
        <div class="flex items-center gap-4">
          <div class="relative grid size-14 place-items-center overflow-hidden rounded-2xl bg-[var(--color-secondary)] text-[var(--color-surface)] shadow-[0_16px_34px_color-mix(in_srgb,var(--color-secondary)_20%,transparent)]">
            <span class="pointer-events-none absolute inset-0 bg-[var(--color-surface)] opacity-20 [mask-image:url(/backgrounds/eight-point-star.svg)] [mask-position:center] [mask-repeat:repeat] [mask-size:44px]" aria-hidden="true" />
            <span class="tenant-heading text-xl font-black leading-none">{{ logoInitials }}</span>
          </div>
          <div>
            <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              Stay connected
            </p>
            <p class="tenant-heading text-2xl font-bold text-[var(--color-surface)]">
              {{ tenant?.name }}
            </p>
          </div>
        </div>
        <p class="mt-6 max-w-xl text-sm font-semibold leading-7 text-[color:color-mix(in_srgb,var(--color-surface)_72%,transparent)]">
          {{ tenant?.settings?.aboutText || 'Nourish your faith, serve the community, and inspire a better tomorrow.' }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <UButton
            to="#prayer-times"
            color="neutral"
            icon="i-lucide-clock"
            label="Prayer times"
            size="sm"
            class="rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_90%,transparent)]"
          />
          <UButton
            to="#donate"
            color="neutral"
            variant="ghost"
            icon="i-lucide-heart"
            label="Donate"
            size="sm"
            class="rounded-full border border-[color:color-mix(in_srgb,var(--color-surface)_18%,transparent)] text-[var(--color-surface)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)]"
          />
        </div>
      </div>

      <div v-if="footerLinks.length">
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Explore
        </h2>
        <nav class="mt-5 grid gap-3 text-sm font-black text-[color:color-mix(in_srgb,var(--color-surface)_72%,transparent)]">
          <NuxtLink
            v-for="item in footerLinks"
            :key="item.id ?? item.href"
            :to="item.href"
            class="hover:text-[var(--color-surface)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div>
        <h2 class="tenant-heading text-2xl font-bold text-[var(--color-secondary)]">
          Contact
        </h2>
        <div class="mt-5 grid gap-4 text-sm font-semibold leading-6 text-[color:color-mix(in_srgb,var(--color-surface)_72%,transparent)]">
          <span class="grid grid-cols-[1.25rem_1fr] gap-3">
            <UIcon name="i-lucide-map-pin" class="mt-1 size-5 text-[var(--color-secondary)]" />
            <span>{{ tenant?.settings?.address }}, {{ tenant?.settings?.city }} {{ tenant?.settings?.postcode }}</span>
          </span>
          <span class="grid grid-cols-[1.25rem_1fr] gap-3">
            <UIcon name="i-lucide-mail" class="mt-1 size-5 text-[var(--color-secondary)]" />
            <span>{{ tenant?.settings?.email }}</span>
          </span>
          <span class="grid grid-cols-[1.25rem_1fr] gap-3">
            <UIcon name="i-lucide-phone" class="mt-1 size-5 text-[var(--color-secondary)]" />
            <span>{{ tenant?.settings?.phone }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="tenant-container mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[color:color-mix(in_srgb,var(--color-surface)_12%,transparent)] pt-6 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-surface)_56%,transparent)]">
      <span>© {{ year }} {{ tenant?.name }}. All rights reserved.</span>
      <div class="flex items-center gap-2">
        <UButton
          v-if="tenant?.settings?.facebook"
          :to="tenant.settings.facebook"
          target="_blank"
          color="neutral"
          variant="ghost"
          icon="i-lucide-facebook"
          size="xs"
          class="text-[color:color-mix(in_srgb,var(--color-surface)_70%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] hover:text-[var(--color-surface)]"
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
          class="text-[color:color-mix(in_srgb,var(--color-surface)_70%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] hover:text-[var(--color-surface)]"
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
          class="text-[color:color-mix(in_srgb,var(--color-surface)_70%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] hover:text-[var(--color-surface)]"
          aria-label="YouTube"
        />
      </div>
    </div>
  </footer>
</template>
