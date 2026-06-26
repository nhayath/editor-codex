<script setup lang="ts">
// Noor — "Illuminated" hero. A deep-navy night canvas lit by a gold "noor"
// glow, an arabesque texture wash, and a floating eight-point-star ornament,
// with a live "next prayer" pill. Reuses the global hero prop keys (merged in
// by resolveWidgetDefinition) so existing content fields keep working, and adds
// `showNextPrayer`. All motion is reduced-motion-guarded in the scoped style.
const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  imageUrl?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
  showNextPrayer?: boolean
  data?: Record<string, any>
}>(), {
  eyebrow: '',
  title: 'A place of light, prayer, and belonging.',
  subtitle: '',
  imageUrl: '/templates/mosque-hero-2.svg',
  primaryLabel: 'Today times',
  primaryUrl: '#prayer-times',
  secondaryLabel: 'See events',
  secondaryUrl: '#events',
  showNextPrayer: true,
  data: () => ({})
})

const ICONS: Record<string, string> = {
  Fajr: 'i-lucide-sunrise',
  Dhuhr: 'i-lucide-sun',
  Asr: 'i-lucide-cloud-sun',
  Maghrib: 'i-lucide-sunset',
  Isha: 'i-lucide-moon-star'
}

// Live clock (minute precision) to surface the next upcoming prayer.
const currentMinutes = ref<number | null>(null)
onMounted(() => {
  const update = () => {
    const now = new Date()
    currentMinutes.value = now.getHours() * 60 + now.getMinutes()
  }
  update()
  const interval = window.setInterval(update, 60_000)
  onBeforeUnmount(() => window.clearInterval(interval))
})

function toMinutes(value?: string) {
  if (!value) return null
  const [h, m] = value.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

const nextPrayer = computed(() => {
  const p = (props.data?.prayerTimes ?? {}) as Record<string, string | undefined>
  const slots = [
    { name: 'Fajr', time: p.fajr },
    { name: 'Dhuhr', time: p.dhuhr },
    { name: 'Asr', time: p.asr },
    { name: 'Maghrib', time: p.maghrib },
    { name: 'Isha', time: p.isha }
  ].filter((slot): slot is { name: string; time: string } => Boolean(slot.time))
  if (!slots.length) return null

  const minutesNow = currentMinutes.value
  if (minutesNow === null) return slots[0]
  for (const slot of slots) {
    const total = toMinutes(slot.time)
    if (total !== null && total >= minutesNow) return slot
  }
  // Everything today has passed → first prayer tomorrow.
  return slots[0]
})
</script>

<template>
  <div class="noor-hero @container relative isolate overflow-hidden rounded-lg bg-[var(--color-primary)] text-white">
    <!-- Layered night background -->
    <div class="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(125%_125%_at_12%_8%,color-mix(in_srgb,var(--color-primary)_72%,black)_0%,var(--color-primary)_46%,color-mix(in_srgb,var(--color-primary)_84%,black)_100%)]" />
    <!-- Gold "noor" glow -->
    <div class="pointer-events-none absolute -right-28 -top-28 -z-20 size-[480px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-secondary)_40%,transparent)_0%,transparent_66%)] opacity-70" />
    <div class="pointer-events-none absolute -bottom-32 -left-24 -z-20 size-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-accent)_28%,transparent)_0%,transparent_68%)] opacity-60" />
    <!-- Arabesque texture wash -->
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[var(--color-secondary)] opacity-[0.07] [mask-image:url(/backgrounds/arabesque-vines.svg)] [mask-position:top_center] [mask-repeat:repeat] [mask-size:240px]" />
    <!-- Twinkling stars -->
    <div class="noor-hero-stars pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <span class="noor-star" style="top: 16%; left: 30%; --d: 0s" />
      <span class="noor-star" style="top: 28%; left: 64%; --d: 1.1s" />
      <span class="noor-star" style="top: 62%; left: 22%; --d: 2.2s" />
      <span class="noor-star" style="top: 74%; left: 54%; --d: 0.6s" />
      <span class="noor-star" style="top: 44%; left: 88%; --d: 1.7s" />
    </div>

    <div class="grid items-center gap-8 p-6 @lg:p-10 @4xl:grid-cols-[1.05fr_0.95fr] @4xl:gap-12 @4xl:p-14">
      <div class="min-w-0">
        <!-- Live next-prayer pill -->
        <div
          v-if="showNextPrayer && nextPrayer"
          class="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_40%,transparent)] bg-[color:color-mix(in_srgb,black_28%,transparent)] px-4 py-2 backdrop-blur-sm"
        >
          <span class="noor-pulse size-2 shrink-0 rounded-full bg-[var(--color-secondary)]" aria-hidden="true" />
          <UIcon :name="ICONS[nextPrayer.name] ?? 'i-lucide-clock'" class="size-4 shrink-0 text-[var(--color-secondary)]" />
          <span class="truncate text-sm font-semibold text-white/85">Next &middot; {{ nextPrayer.name }}</span>
          <span class="shrink-0 text-sm font-bold tabular-nums text-[var(--color-secondary)]">{{ nextPrayer.time }}</span>
        </div>

        <p
          v-if="eyebrow"
          class="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-secondary)]"
        >
          <span class="h-px w-7 bg-[color:color-mix(in_srgb,var(--color-secondary)_65%,transparent)]" />
          <span class="min-w-0">{{ eyebrow }}</span>
        </p>

        <h1 class="tenant-heading text-4xl font-bold leading-[1.06] tracking-normal text-white @lg:text-5xl @4xl:text-6xl">
          {{ title }}
        </h1>

        <p
          v-if="subtitle"
          class="mt-5 max-w-xl text-base leading-7 text-white/72 @4xl:text-lg @4xl:leading-8"
        >
          {{ subtitle }}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <NuxtLink
            v-if="primaryLabel"
            :to="primaryUrl"
            class="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_34px_color-mix(in_srgb,var(--color-accent)_42%,transparent)] transition hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)]"
          >
            <UIcon name="i-lucide-clock" class="size-4" />
            {{ primaryLabel }}
          </NuxtLink>
          <NuxtLink
            v-if="secondaryLabel"
            :to="secondaryUrl"
            class="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_60%,transparent)] hover:bg-white/10"
          >
            {{ secondaryLabel }}
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Image, gold-framed, with a floating eight-point-star ornament -->
      <div class="relative mx-auto w-full max-w-[520px]">
        <div class="relative overflow-hidden rounded-[1.25rem] shadow-[0_30px_72px_rgba(0,0,0,0.42)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_38%,transparent)] @4xl:rounded-[1.6rem]">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="title"
            class="aspect-[4/3] w-full object-cover @4xl:aspect-[4/4.4]"
          >
          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,color-mix(in_srgb,var(--color-primary)_82%,transparent)_100%)]" />
        </div>

        <div class="noor-hero-star pointer-events-none absolute -left-5 -top-5 size-16 @4xl:-left-7 @4xl:-top-7 @4xl:size-20" aria-hidden="true">
          <svg viewBox="0 0 100 100" class="size-full drop-shadow-[0_6px_18px_color-mix(in_srgb,var(--color-secondary)_55%,transparent)]">
            <rect x="24" y="24" width="52" height="52" rx="7" fill="var(--color-secondary)" transform="rotate(0 50 50)" />
            <rect x="24" y="24" width="52" height="52" rx="7" fill="var(--color-secondary)" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="13" fill="var(--color-primary)" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.noor-star {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--color-secondary) 90%, white);
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-secondary) 70%, transparent);
  opacity: 0.45;
}

@media (prefers-reduced-motion: no-preference) {
  .noor-star {
    animation: noor-twinkle 4.5s ease-in-out infinite;
    animation-delay: var(--d, 0s);
  }

  .noor-pulse {
    animation: noor-pulse 2.4s ease-in-out infinite;
  }

  .noor-hero-star {
    animation: noor-float 7s ease-in-out infinite;
  }
}

@keyframes noor-twinkle {
  0%, 100% { opacity: 0.25; transform: scale(0.8); }
  50% { opacity: 0.9; transform: scale(1.15); }
}

@keyframes noor-pulse {
  0%, 100% { opacity: 0.55; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes noor-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-7px) rotate(6deg); }
}
</style>
