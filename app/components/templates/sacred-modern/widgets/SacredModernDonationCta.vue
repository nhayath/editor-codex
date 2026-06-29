<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonLabel?: string
  eyebrow?: string
  variant?: string
  data?: Record<string, any>
}>(), {
  title: 'Your donation builds a better hereafter',
  subtitle: 'Support our mission of worship, education and community.',
  buttonLabel: 'Donate Now',
  eyebrow: 'Giving',
  variant: 'split-card',
  data: () => ({})
})

const campaigns = computed(() => props.data?.donations ?? [])
const featured = computed(() => campaigns.value.find((item: any) => item.isFeatured) ?? campaigns.value[0])
</script>

<template>
  <div
    class="@container relative isolate h-full overflow-hidden rounded-lg bg-[var(--color-primary)] p-6 text-[var(--color-surface)] shadow-[0_20px_54px_color-mix(in_srgb,var(--color-primary)_18%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_28%,transparent)] @lg:p-8"
  >
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_86%_0%,color-mix(in_srgb,var(--color-secondary)_25%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_92%,var(--color-text)),var(--color-accent))]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.075] [mask-image:url(/backgrounds/rosette-bloom.svg)] [mask-position:center_right] [mask-repeat:repeat] [mask-size:220px]" />

    <div class="grid gap-8 @4xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)] @4xl:items-center">
      <div class="relative">
        <p class="text-xs font-black uppercase tracking-normal text-[var(--color-secondary)]">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-3 max-w-2xl text-3xl font-bold leading-tight text-[var(--color-secondary)] @md:text-4xl @4xl:text-5xl">
          {{ title }}
        </h2>
        <p class="mt-4 max-w-xl text-sm font-semibold leading-6 text-[color:color-mix(in_srgb,var(--color-surface)_72%,transparent)] @md:text-base @md:leading-7">
          {{ subtitle }}
        </p>

        <UButton
          :to="featured?.paymentUrl || '#donate'"
          target="_blank"
          color="neutral"
          size="lg"
          class="mt-7 rounded-md bg-[var(--color-secondary)] px-7 font-black text-[var(--color-primary)] shadow-[0_16px_34px_color-mix(in_srgb,var(--color-secondary)_18%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_88%,var(--color-surface))]"
          :label="buttonLabel"
          trailing-icon="i-lucide-arrow-up-right"
        />
      </div>

      <div
        v-if="featured"
        class="rounded-lg border border-[color:color-mix(in_srgb,var(--color-surface)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] p-5 shadow-inner backdrop-blur"
      >
        <p class="text-xs font-black uppercase tracking-normal text-[color:color-mix(in_srgb,var(--color-surface)_52%,transparent)]">
          Featured campaign
        </p>
        <h3 class="tenant-heading mt-2 text-2xl font-bold text-[var(--color-surface)]">
          {{ featured.title }}
        </h3>
        <p class="mt-4 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-surface)_62%,transparent)]">
          Raised so far
        </p>
        <p class="tenant-heading mt-1 text-4xl font-bold text-[var(--color-secondary)]">
          {{ featured.raised?.toLocaleString?.() ?? featured.raised }}
        </p>
      </div>
    </div>
  </div>
</template>
