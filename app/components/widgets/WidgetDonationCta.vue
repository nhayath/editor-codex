<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonLabel?: string
  variant?: string
  data?: Record<string, any>
}>(), {
  title: 'Support your mosque',
  subtitle: 'Your donations help sustain worship, education, and community support.',
  buttonLabel: 'Donate now',
  variant: 'banner',
  data: () => ({})
})

const campaigns = computed(() => props.data?.donations ?? [])
const featured = computed(() => campaigns.value.find((item: any) => item.isFeatured) ?? campaigns.value[0])
</script>

<template>
  <div class="@container rounded-lg bg-[var(--color-primary)] p-6 text-white">
    <div
      v-if="variant === 'banner'"
      class="grid gap-6 @xl:grid-cols-[1fr_auto]"
    >
      <div>
        <p class="text-sm font-medium text-white/75">
          Giving
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold">
          {{ title }}
        </h2>
        <p class="mt-3 max-w-2xl text-white/80">
          {{ subtitle }}
        </p>
        <p
          v-if="featured"
          class="mt-4 text-sm text-white/75"
        >
          {{ featured.title }}: £{{ featured.raised?.toLocaleString?.() ?? featured.raised }} raised
        </p>
      </div>
      <div class="flex items-center">
        <UButton
          :to="featured?.paymentUrl || '#'"
          target="_blank"
          color="neutral"
          icon="i-lucide-hand-heart"
          :label="buttonLabel"
        />
      </div>
    </div>

    <div
      v-else
      class="grid gap-4 @xl:grid-cols-2"
    >
      <article
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="rounded-md bg-white/10 p-5"
      >
        <h3 class="text-lg font-semibold">
          {{ campaign.title }}
        </h3>
        <p class="mt-2 text-sm text-white/75">
          {{ campaign.description }}
        </p>
        <UProgress
          v-if="campaign.goal"
          class="mt-4"
          :model-value="Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))"
          color="neutral"
        />
        <UButton
          :to="campaign.paymentUrl || '#'"
          target="_blank"
          class="mt-4"
          color="neutral"
          size="sm"
          icon="i-lucide-hand-heart"
          :label="buttonLabel"
        />
      </article>
    </div>
  </div>
</template>
