<script setup lang="ts">
import { getTenantFooterLinks } from '~/components/templates/chrome'

const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  chromeStyle?: string
}>()

const year = new Date().getFullYear()
const footerLinks = computed(() => getTenantFooterLinks(props.tenant))
</script>

<template>
  <footer class="@container border-t border-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] bg-[var(--color-surface)] py-10">
    <div class="tenant-container grid gap-8 @xl:grid-cols-[1fr_auto]">
      <div>
        <div class="flex items-center gap-3">
          <div class="grid size-10 place-items-center rounded-md bg-[var(--color-primary)] text-white">
            <IconGlyph name="islamic-mosque" class="size-5" />
          </div>
          <p class="tenant-heading text-xl font-bold text-[var(--color-text)]">
            {{ tenant?.name }}
          </p>
        </div>
        <p class="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
          {{ tenant?.settings?.aboutText || 'A mosque website powered by the editor.' }}
        </p>
      </div>

      <div class="grid gap-2 text-sm text-[var(--color-text-muted)]">
        <span>{{ tenant?.settings?.address }}</span>
        <span>{{ tenant?.settings?.city }} {{ tenant?.settings?.postcode }}</span>
        <span>{{ tenant?.settings?.email }}</span>
        <span>{{ tenant?.settings?.phone }}</span>
      </div>
    </div>

    <div class="tenant-container mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[color:color-mix(in_srgb,var(--color-text)_10%,transparent)] pt-6 text-xs text-[var(--color-text-muted)]">
      <span>© {{ year }} {{ tenant?.name }}</span>
      <nav
        v-if="footerLinks.length"
        class="flex flex-wrap items-center gap-x-4 gap-y-2 font-semibold"
      >
        <NuxtLink
          v-for="item in footerLinks"
          :key="item.id ?? item.href"
          :to="item.href"
          class="hover:text-[var(--color-primary)]"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="flex items-center gap-2">
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
  </footer>
</template>
