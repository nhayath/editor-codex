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
    id="donate"
    class="@container relative h-full overflow-hidden rounded-[1.5rem] bg-[var(--color-accent)] p-7 text-white shadow-[0_14px_32px_color-mix(in_srgb,var(--color-primary)_14%,transparent)]"
  >
    <div class="absolute inset-y-0 left-0 w-1/2 bg-[color:color-mix(in_srgb,var(--color-primary)_82%,black)]" />
    <div class="relative">
      <p class="text-xs font-black uppercase tracking-normal text-[var(--color-secondary)]">
        {{ eyebrow }}
      </p>
      <h2 class="tenant-heading mt-3 text-3xl font-bold leading-tight text-[var(--color-secondary)]">
        {{ title }}
      </h2>
      <p class="mt-4 max-w-sm text-sm font-semibold leading-6 text-white/68">
        {{ subtitle }}
      </p>
      <p
        v-if="featured"
        class="mt-4 text-xs font-bold text-white/58"
      >
        {{ featured.title }}: {{ featured.raised?.toLocaleString?.() ?? featured.raised }} raised
      </p>

      <UButton
        :to="featured?.paymentUrl || '#donate'"
        target="_blank"
        color="neutral"
        size="lg"
        class="mt-7 rounded-full bg-[var(--color-secondary)] px-7 font-black text-white hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_88%,black)]"
        :label="buttonLabel"
      />
    </div>
  </div>
</template>
