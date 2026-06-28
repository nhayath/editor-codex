<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  imamName?: string
  quote?: string
  quoteSource?: string
  imageUrl?: string
  buttonLabel?: string
  buttonUrl?: string
}>(), {
  label: "Jumu'ah Khutbah",
  imamName: 'Imam Rashid Al-Qasimi',
  quote: 'Indeed, with hardship comes ease.',
  quoteSource: "Qur'an 94:6",
  imageUrl: '',
  buttonLabel: 'Meet the Imam',
  buttonUrl: '#about'
})
</script>

<template>
  <article class="sacred-modern-khutbah @container relative isolate flex h-full flex-col overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--color-surface)_94%,var(--color-bg))] p-5 text-[var(--color-text)] shadow-[0_18px_42px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] @lg:p-6">
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_4%,color-mix(in_srgb,var(--color-secondary)_14%,transparent),transparent_34%)]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-primary)] opacity-[0.04] [mask-image:url(/backgrounds/arabesque-vines.svg)] [mask-position:center_top] [mask-repeat:repeat] [mask-size:230px]" />

    <div
      v-if="imageUrl"
      class="relative mb-5 overflow-hidden rounded-t-[999px] rounded-b-lg bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]"
    >
      <img
        :src="imageUrl"
        :alt="`${imamName} khutbah image`"
        class="aspect-[4/3] w-full object-cover"
      >
      <div class="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-md border border-[color:color-mix(in_srgb,var(--color-secondary)_34%,transparent)]" />
    </div>

    <div class="flex flex-1 flex-col rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_82%,transparent)] p-5">
      <div class="mb-7 flex items-center justify-between gap-4">
        <p class="text-xs font-black uppercase tracking-normal text-[var(--color-primary)]">
          {{ label }}
        </p>
        <span class="grid size-12 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,white)] text-[var(--color-primary)]">
          <IconGlyph name="islamic-quran" class="size-6" />
        </span>
      </div>

      <h2 class="tenant-heading text-3xl font-bold leading-tight text-[var(--color-primary)] @md:text-4xl">
        {{ imamName }}
      </h2>

      <blockquote class="mt-6 border-l-2 border-[var(--color-secondary)] pl-5 text-base italic leading-7 text-[var(--color-text-muted)]">
        "{{ quote }}"
        <footer class="mt-2 text-sm font-bold not-italic text-[var(--color-primary)]">
          {{ quoteSource }}
        </footer>
      </blockquote>

      <div class="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
        <UButton
          :to="buttonUrl"
          color="neutral"
          class="rounded-md bg-[var(--color-primary)] font-bold text-white hover:bg-[color:color-mix(in_srgb,var(--color-primary)_88%,black)]"
          :label="buttonLabel"
          trailing-icon="i-lucide-arrow-up-right"
        />
        <span class="h-px min-w-16 flex-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-secondary)_42%,transparent),transparent)]" />
      </div>
    </div>
  </article>
</template>
