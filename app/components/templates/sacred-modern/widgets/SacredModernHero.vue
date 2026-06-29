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
  imageUrl: '/templates/sacred-modern-courtyard.webp',
  primaryLabel: 'Prayer Times',
  primaryUrl: '#prayer-times',
  secondaryLabel: 'Plan Your Visit',
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
  <div class="sacred-modern-hero @container relative isolate overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--color-surface)_88%,var(--color-bg))] px-5 py-8 shadow-[0_24px_70px_color-mix(in_srgb,var(--color-primary)_9%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] @lg:px-8 @4xl:px-12 @4xl:py-12">
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_10%,color-mix(in_srgb,var(--color-secondary)_17%,transparent),transparent_30%),radial-gradient(circle_at_92%_4%,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent_28%)]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-primary)] opacity-[0.045] [mask-image:url(/backgrounds/rosette-bloom.svg)] [mask-position:top_center] [mask-repeat:repeat] [mask-size:260px]" />

    <div class="grid items-center gap-8 @4xl:grid-cols-[minmax(0,0.92fr)_minmax(340px,1.08fr)] @4xl:gap-10 @6xl:gap-16">
      <div class="min-w-0">
        <div
          v-if="showLocationPill && locationText"
          class="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_84%,transparent)] px-3 py-1.5 text-xs font-bold text-[var(--color-primary)] shadow-[0_12px_30px_color-mix(in_srgb,var(--color-secondary)_9%,transparent)] @4xl:mb-6 @4xl:px-4 @4xl:py-2 @4xl:text-sm"
        >
          <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-[var(--color-secondary)]" />
          <span class="truncate">{{ locationText }}</span>
        </div>

        <p
          v-if="eyebrow"
          class="mb-4 text-sm font-bold uppercase tracking-normal text-[var(--color-primary)]"
        >
          {{ eyebrow }}
        </p>

        <h1 class="tenant-heading max-w-[10ch] text-5xl font-bold leading-[0.98] tracking-normal text-[var(--color-primary)] @4xl:text-7xl @6xl:text-8xl">
          {{ title }}
        </h1>

        <p class="mt-5 max-w-xl text-base font-semibold leading-7 text-[var(--color-text-muted)] @4xl:mt-8 @4xl:text-xl @4xl:leading-8">
          {{ subtitle }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3 @4xl:mt-10 @4xl:gap-4">
          <UButton
            :to="primaryUrl"
            color="neutral"
            size="xl"
            class="rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-[var(--color-surface)] shadow-[0_16px_30px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-primary)_88%,var(--color-text))] @4xl:px-7 @4xl:py-4"
          >
            {{ primaryLabel }}
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" class="size-5" />
            </template>
          </UButton>

          <UButton
            :to="secondaryUrl"
            color="neutral"
            size="xl"
            variant="ghost"
            class="gap-2 px-1 font-bold text-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-accent)] @4xl:gap-3 @4xl:px-2"
          >
            <span class="grid size-10 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,var(--color-surface))] text-[var(--color-primary)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_24%,transparent)] @4xl:size-12">
              <UIcon name="i-lucide-arrow-up-right" class="size-5" />
            </span>
            {{ secondaryLabel }}
          </UButton>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-[620px]">
        <div class="sacred-modern-arch-frame relative overflow-hidden rounded-t-[999px] rounded-b-[1.4rem] bg-[var(--color-primary)] p-2 shadow-[0_28px_70px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_34%,transparent)] @4xl:p-3">
          <div class="pointer-events-none absolute inset-4 z-10 rounded-t-[999px] rounded-b-[1rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_42%,transparent)]" aria-hidden="true" />
          <img
            :src="imageUrl"
            :alt="title"
            class="aspect-[16/10] max-h-72 w-full rounded-t-[999px] rounded-b-[1rem] object-cover @4xl:aspect-[1.02] @4xl:max-h-none"
          >
          <div class="pointer-events-none absolute inset-2 rounded-t-[999px] rounded-b-[1rem] bg-[linear-gradient(180deg,transparent_44%,color-mix(in_srgb,var(--color-primary)_58%,transparent)_100%)] @4xl:inset-3" />
        </div>
        <div class="sacred-modern-hero-rosette pointer-events-none absolute -bottom-5 -left-4 grid size-20 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-secondary)] shadow-[0_18px_38px_color-mix(in_srgb,var(--color-primary)_16%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_34%,transparent)] @4xl:-left-8 @4xl:size-24" aria-hidden="true">
          <span class="size-12 bg-current [mask-image:url(/backgrounds/eight-point-star.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] @4xl:size-14" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .sacred-modern-hero-rosette {
    animation: sacred-modern-soft-pulse 3.2s ease-in-out infinite;
  }
}

@keyframes sacred-modern-soft-pulse {
  0%, 100% {
    opacity: 0.78;
    transform: scale(0.96);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

</style>
