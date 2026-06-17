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
  imageUrl: '/templates/mosque-hero-2.svg',
  buttonLabel: 'View Profile',
  buttonUrl: '#about'
})
</script>

<template>
  <article class="h-full overflow-hidden rounded-[1.5rem] bg-[var(--color-primary)] text-white shadow-[0_18px_42px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]">
    <div class="relative bg-[color:color-mix(in_srgb,var(--color-primary)_14%,white)]">
      <img
        :src="imageUrl"
        :alt="imamName"
        class="aspect-[1.08] w-full object-cover"
      >
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--color-primary)_86%,transparent))]" />
    </div>

    <div class="p-6">
      <p class="text-xs font-black uppercase tracking-normal text-[var(--color-secondary)]">
        {{ label }}
      </p>
      <h2 class="tenant-heading mt-4 text-3xl font-bold leading-tight text-[var(--color-secondary)]">
        {{ imamName }}
      </h2>

      <blockquote class="mt-5 border-l-2 border-[var(--color-secondary)] pl-5 text-sm italic leading-6 text-white/72">
        "{{ quote }}"
        <footer class="mt-1 text-white/58">
          {{ quoteSource }}
        </footer>
      </blockquote>

      <div class="mt-7 flex items-center justify-between gap-4">
        <UButton
          :to="buttonUrl"
          color="neutral"
          class="rounded-md bg-[var(--color-surface)] font-bold text-[var(--color-primary)] hover:bg-[color:color-mix(in_srgb,var(--color-surface)_92%,var(--color-secondary))]"
          :label="buttonLabel"
        />
        <span class="grid size-11 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] text-[var(--color-secondary)]">
          <UIcon name="i-lucide-user-round" class="size-5" />
        </span>
      </div>
    </div>
  </article>
</template>
