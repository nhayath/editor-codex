<script setup lang="ts">
const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  imageUrl?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
  locationLabel?: string
  showLocationPill?: boolean
  data?: Record<string, any>
}>(), {
  eyebrow: '',
  title: 'A place of worship, unity & positive change.',
  subtitle: 'Nourish your faith. Serve the community. Inspire a better tomorrow.',
  imageUrl: '/templates/mosque-hero-1.svg',
  primaryLabel: 'Plan Your Visit',
  primaryUrl: '#contact',
  secondaryLabel: 'Watch Intro',
  secondaryUrl: '#about',
  locationLabel: '',
  showLocationPill: true,
  data: () => ({})
})

const locationText = computed(() => {
  if (props.locationLabel) return props.locationLabel

  const settings = props.data?.settings
  return [settings?.address, settings?.city, settings?.postcode].filter(Boolean).join(', ')
})
</script>

<template>
  <div class="@container relative isolate overflow-hidden py-2">
    <div class="grid items-center gap-6 @4xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] @4xl:gap-10 @6xl:gap-16">
      <div class="min-w-0">
        <div
          v-if="showLocationPill && locationText"
          class="mb-5 inline-flex max-w-full items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--color-text)_8%,transparent)] px-3 py-1.5 text-xs font-bold text-[var(--color-text-muted)] @4xl:mb-8 @4xl:px-4 @4xl:py-2 @4xl:text-sm"
        >
          <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-[var(--color-primary)]" />
          <span class="truncate">{{ locationText }}</span>
        </div>

        <p
          v-if="eyebrow"
          class="mb-4 text-sm font-bold uppercase tracking-normal text-[var(--color-primary)]"
        >
          {{ eyebrow }}
        </p>

        <h1 class="tenant-heading max-w-[9ch] text-5xl font-bold leading-[0.98] tracking-normal text-[var(--color-secondary)] @4xl:text-8xl">
          {{ title }}
        </h1>

        <p class="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-muted)] @4xl:mt-8 @4xl:text-xl @4xl:leading-8">
          {{ subtitle }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3 @4xl:mt-10 @4xl:gap-4">
          <UButton
            :to="primaryUrl"
            color="neutral"
            size="xl"
            class="rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-white shadow-[0_16px_30px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_88%,black)] @4xl:px-7 @4xl:py-4"
          >
            {{ primaryLabel }}
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" class="size-5" />
            </template>
          </UButton>

          <UButton
            :to="secondaryUrl"
            color="neutral"
            variant="ghost"
            size="xl"
            class="gap-2 px-1 font-bold text-[var(--color-text)] hover:bg-transparent hover:text-[var(--color-primary)] @4xl:gap-3 @4xl:px-2"
          >
            <span class="grid size-10 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,white)] text-[var(--color-secondary)] @4xl:size-12">
              <UIcon name="i-lucide-play" class="size-5 fill-current" />
            </span>
            {{ secondaryLabel }}
          </UButton>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-[620px]">
        <div class="relative overflow-hidden rounded-[1.25rem] bg-[var(--color-primary)] shadow-[0_28px_70px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-primary)_16%,transparent)] @4xl:rounded-[1.75rem]">
          <img
            :src="imageUrl"
            :alt="title"
            class="aspect-[16/10] max-h-64 w-full object-cover @4xl:aspect-[1.02] @4xl:max-h-none"
          >
          <div class="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-[linear-gradient(180deg,transparent_44%,color-mix(in_srgb,var(--color-primary)_60%,transparent)_100%)] @4xl:rounded-[1.75rem]" />
        </div>
      </div>
    </div>
  </div>
</template>
