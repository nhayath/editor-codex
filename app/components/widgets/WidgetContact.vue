<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  intro?: string
  showSocials?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Contact us',
  intro: 'Get in touch with the mosque office.',
  showSocials: true,
  data: () => ({})
})
</script>

<template>
  <div class="grid gap-6 rounded-lg bg-[var(--color-surface)] p-6 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)] md:grid-cols-[1fr_1fr]">
    <div>
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        Contact
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
      <p class="mt-3 text-[var(--color-text-muted)]">
        {{ intro }}
      </p>
    </div>

    <div class="grid gap-3 text-sm text-[var(--color-text-muted)]">
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-map-pin" class="size-4 text-[var(--color-primary)]" />
        {{ data?.settings?.address }}, {{ data?.settings?.city }} {{ data?.settings?.postcode }}
      </span>
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-phone" class="size-4 text-[var(--color-primary)]" />
        {{ data?.settings?.phone }}
      </span>
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-mail" class="size-4 text-[var(--color-primary)]" />
        {{ data?.settings?.email }}
      </span>

      <div
        v-if="showSocials"
        class="mt-2 flex items-center gap-2"
      >
        <UButton
          v-if="data?.settings?.facebook"
          :to="data.settings.facebook"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-lucide-facebook"
          aria-label="Facebook"
        />
        <UButton
          v-if="data?.settings?.instagram"
          :to="data.settings.instagram"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-lucide-instagram"
          aria-label="Instagram"
        />
        <UButton
          v-if="data?.settings?.youtube"
          :to="data.settings.youtube"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-lucide-youtube"
          aria-label="YouTube"
        />
      </div>
    </div>
  </div>
</template>
