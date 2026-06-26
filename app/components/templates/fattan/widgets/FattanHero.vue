<script setup lang="ts">
const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
  backgroundImageUrl?: string
  imageUrl?: string
  showNextPrayer?: boolean
  data?: Record<string, any>
}>(), {
  eyebrow: 'Welcome home',
  title: 'A radiant home for prayer, learning, and service.',
  subtitle: 'Gather for salah, grow through knowledge, and serve the community with ihsan.',
  primaryLabel: 'Prayer times',
  primaryUrl: '#prayer-times',
  secondaryLabel: 'Upcoming events',
  secondaryUrl: '#events',
  backgroundImageUrl: '',
  imageUrl: '/templates/mosque-hero-3.svg',
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

const currentSeconds = ref<number | null>(null)
let interval: ReturnType<typeof window.setInterval> | undefined

function updateCurrentSeconds() {
  const now = new Date()
  currentSeconds.value = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}

onMounted(() => {
  updateCurrentSeconds()
  interval = window.setInterval(updateCurrentSeconds, 1000)
})

onBeforeUnmount(() => {
  if (interval) window.clearInterval(interval)
})

function toSeconds(value?: string) {
  if (!value) return null
  const [hoursRaw, minutesRaw] = value.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 3600 + minutes * 60
}

const nextPrayer = computed(() => {
  const p = props.data?.prayerTimes ?? {}
  const rows = [
    { name: 'Fajr', time: p.fajr },
    { name: 'Dhuhr', time: p.dhuhr },
    { name: 'Asr', time: p.asr },
    { name: 'Maghrib', time: p.maghrib },
    { name: 'Isha', time: p.isha }
  ].filter((row): row is { name: string, time: string } => Boolean(row.time))

  if (!rows.length) return null

  const now = currentSeconds.value
  if (now === null) return rows[0]

  for (const row of rows) {
    const target = toSeconds(row.time)
    if (target !== null && target >= now) return row
  }

  return rows[0]
})

const heroBackgroundStyle = computed(() => props.backgroundImageUrl
  ? { backgroundImage: `url('${props.backgroundImageUrl}')` }
  : {})
</script>

<template>
  <div class="fattan-hero @container relative isolate overflow-hidden rounded-[1.35rem] bg-[var(--color-primary)] text-white">
    <div class="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(130%_110%_at_4%_0%,color-mix(in_srgb,var(--color-secondary)_28%,transparent)_0%,transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_95%,black)_0%,color-mix(in_srgb,var(--color-primary)_82%,var(--color-accent))_100%)]" />
    <div
      v-if="backgroundImageUrl"
      class="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center opacity-[0.42] mix-blend-screen"
      :style="heroBackgroundStyle"
      aria-hidden="true"
    />
    <div class="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-primary)_72%,black)_0%,color-mix(in_srgb,var(--color-primary)_68%,transparent)_54%,color-mix(in_srgb,var(--color-primary)_72%,black)_100%)]" />
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-secondary)] opacity-[0.07] [mask-image:url(/backgrounds/mihrab-arches.svg)] [mask-position:top_center] [mask-repeat:repeat] [mask-size:260px]" />
    <div class="pointer-events-none absolute -right-28 -top-28 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-secondary)_38%,transparent)_0%,transparent_68%)] opacity-80" />

    <div class="grid min-h-[520px] items-center gap-8 p-6 @lg:p-10 @4xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.88fr)] @4xl:gap-12 @5xl:p-14">
      <div class="min-w-0">
        <div
          v-if="showNextPrayer && nextPrayer"
          class="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[color:color-mix(in_srgb,black_20%,transparent)] px-4 py-2 shadow-[0_14px_34px_color-mix(in_srgb,var(--color-secondary)_14%,transparent)] backdrop-blur"
        >
          <span class="fattan-live-dot size-2 shrink-0 rounded-full bg-[var(--color-secondary)]" aria-hidden="true" />
          <UIcon :name="ICONS[nextPrayer.name] ?? 'i-lucide-clock'" class="size-4 shrink-0 text-[var(--color-secondary)]" />
          <span class="truncate text-sm font-semibold text-white/78">Next prayer</span>
          <span class="shrink-0 text-sm font-black tabular-nums text-[var(--color-secondary)]">{{ nextPrayer.name }} {{ nextPrayer.time }}</span>
        </div>

        <p
          v-if="eyebrow"
          class="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--color-secondary)]"
        >
          <span class="h-px w-8 bg-[color:color-mix(in_srgb,var(--color-secondary)_68%,transparent)]" />
          <span class="min-w-0">{{ eyebrow }}</span>
        </p>

        <h1 class="tenant-heading max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-white @lg:text-5xl @5xl:text-6xl">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/74 @5xl:text-lg @5xl:leading-8">
          {{ subtitle }}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <NuxtLink
            v-if="primaryLabel"
            :to="primaryUrl"
            class="inline-flex items-center gap-2 rounded-md bg-[var(--color-secondary)] px-5 py-3 text-sm font-black text-[var(--color-primary)] shadow-[0_16px_36px_color-mix(in_srgb,var(--color-secondary)_24%,transparent)] transition hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_90%,white)]"
          >
            <UIcon name="i-lucide-clock-3" class="size-4" />
            {{ primaryLabel }}
          </NuxtLink>
          <NuxtLink
            v-if="secondaryLabel"
            :to="secondaryUrl"
            class="inline-flex items-center gap-2 rounded-md border border-white/24 px-5 py-3 text-sm font-black text-white transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_58%,transparent)] hover:bg-white/10"
          >
            {{ secondaryLabel }}
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </NuxtLink>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-[440px]">
        <div class="fattan-hero-svg-wrap relative aspect-square overflow-hidden rounded-[1.8rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface)_10%,transparent)] shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="`${title} feature image`"
            class="absolute inset-0 h-full w-full object-cover opacity-[0.55]"
          >
          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_58%,transparent),color-mix(in_srgb,var(--color-primary)_82%,black))]" aria-hidden="true" />
          <svg
            viewBox="0 0 520 520"
            role="img"
            aria-label="Animated Islamic arch ornament"
            class="fattan-hero-svg relative z-10 size-full"
          >
            <defs>
              <pattern id="fattan-lattice" width="52" height="52" patternUnits="userSpaceOnUse">
                <path d="M26 0 52 26 26 52 0 26Z" fill="none" stroke="currentColor" stroke-width="1.25" opacity="0.32" />
                <circle cx="26" cy="26" r="4" fill="currentColor" opacity="0.35" />
              </pattern>
              <linearGradient id="fattan-gold" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stop-color="var(--color-secondary)" />
                <stop offset="1" stop-color="color-mix(in srgb, var(--color-secondary) 64%, white)" />
              </linearGradient>
            </defs>

            <rect width="520" height="520" rx="42" fill="transparent" />
            <rect width="520" height="520" rx="42" fill="url(#fattan-lattice)" class="text-[var(--color-secondary)]" opacity="0.34" />
            <path
              d="M84 444V238c0-97 78-176 176-176s176 79 176 176v206"
              fill="none"
              stroke="url(#fattan-gold)"
              stroke-width="20"
              stroke-linecap="round"
              opacity="0.88"
            />
            <path
              d="M128 444V246c0-73 59-132 132-132s132 59 132 132v198"
              fill="none"
              stroke="white"
              stroke-width="2"
              opacity="0.22"
            />
            <g class="fattan-hero-orbit" transform-origin="260 270">
              <path d="M260 158 278 226 346 244 278 262 260 330 242 262 174 244 242 226Z" fill="var(--color-secondary)" opacity="0.96" />
              <circle cx="260" cy="244" r="29" fill="var(--color-primary)" opacity="0.94" />
              <path d="M275 222a31 31 0 1 0 0 44 24 24 0 1 1 0-44Z" fill="var(--color-secondary)" />
            </g>
            <g class="fattan-hero-stars" fill="var(--color-secondary)">
              <circle cx="158" cy="168" r="4" />
              <circle cx="368" cy="176" r="3.5" />
              <circle cx="128" cy="330" r="3" />
              <circle cx="398" cy="332" r="4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fattan-hero-svg {
  color: var(--color-secondary);
}

.fattan-hero-svg-wrap::after {
  position: absolute;
  inset: 1rem;
  border: 1px solid color-mix(in srgb, var(--color-secondary) 26%, transparent);
  border-radius: 1.25rem;
  content: "";
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .fattan-live-dot {
    animation: fattan-live-pulse 2.4s ease-in-out infinite;
  }

  .fattan-hero-orbit {
    animation: fattan-hero-orbit 12s ease-in-out infinite;
  }

  .fattan-hero-stars {
    animation: fattan-star-glow 4s ease-in-out infinite;
  }
}

@keyframes fattan-live-pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
}

@keyframes fattan-hero-orbit {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.035); }
}

@keyframes fattan-star-glow {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}
</style>
