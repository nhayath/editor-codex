<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  address?: string
  embedUrl?: string
  showDirections?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Find us',
  address: '',
  embedUrl: '',
  showDirections: true,
  data: () => ({})
})

const displayAddress = computed(() => props.address || [
  props.data?.settings?.address,
  props.data?.settings?.city,
  props.data?.settings?.postcode
].filter(Boolean).join(', '))

const directionsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress.value)}`)
</script>

<template>
  <div class="@container grid gap-6 @xl:grid-cols-[0.8fr_1.2fr]">
    <div>
      <p class="text-sm font-semibold text-[var(--color-primary)]">
        Location
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold text-[var(--color-text)]">
        {{ title }}
      </h2>
      <p class="mt-3 text-[var(--color-text-muted)]">
        {{ displayAddress }}
      </p>
      <UButton
        v-if="showDirections"
        :to="directionsUrl"
        target="_blank"
        class="mt-5"
        icon="i-lucide-navigation"
        label="Get directions"
      />
    </div>

    <div class="min-h-72 overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))] ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_12%,transparent)]">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        class="h-full min-h-72 w-full"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
      <div
        v-else
        class="grid h-full min-h-72 place-items-center p-8 text-center"
      >
        <div>
          <UIcon name="i-lucide-map" class="mx-auto size-10 text-[var(--color-primary)]" />
          <p class="mt-3 text-sm text-[var(--color-text-muted)]">
            Add a Google Maps embed URL in the editor.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
