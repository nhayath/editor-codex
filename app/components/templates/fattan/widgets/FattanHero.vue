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

    <!-- Animated background confetti overlay -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div class="fattan-confetti-particle p1"><svg viewBox="0 0 24 24"><path d="M12 2 L15.5 5.5 L20.5 5.5 L20.5 10.5 L24 12 L20.5 13.5 L20.5 18.5 L15.5 18.5 L12 22 L8.5 18.5 L3.5 18.5 L3.5 13.5 L0 12 L3.5 10.5 L3.5 5.5 L8.5 5.5 Z" /></svg></div>
      <div class="fattan-confetti-particle p2"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 18 8 8 0 1 1-10-18z" /></svg></div>
      <div class="fattan-confetti-particle p3"><svg viewBox="0 0 24 24"><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" /></svg></div>
      <div class="fattan-confetti-particle p4"><svg viewBox="0 0 24 24"><path d="M12 2 L15.5 5.5 L20.5 5.5 L20.5 10.5 L24 12 L20.5 13.5 L20.5 18.5 L15.5 18.5 L12 22 L8.5 18.5 L3.5 18.5 L3.5 13.5 L0 12 L3.5 10.5 L3.5 5.5 L8.5 5.5 Z" /></svg></div>
      <div class="fattan-confetti-particle p5"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 18 8 8 0 1 1-10-18z" /></svg></div>
      <div class="fattan-confetti-particle p6"><svg viewBox="0 0 24 24"><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" /></svg></div>
      <div class="fattan-confetti-particle p7"><svg viewBox="0 0 24 24"><path d="M12 2 L15.5 5.5 L20.5 5.5 L20.5 10.5 L24 12 L20.5 13.5 L20.5 18.5 L15.5 18.5 L12 22 L8.5 18.5 L3.5 18.5 L3.5 13.5 L0 12 L3.5 10.5 L3.5 5.5 L8.5 5.5 Z" /></svg></div>
      <div class="fattan-confetti-particle p8"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 18 8 8 0 1 1-10-18z" /></svg></div>
      <div class="fattan-confetti-particle p9"><svg viewBox="0 0 24 24"><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" /></svg></div>
      <div class="fattan-confetti-particle p10"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 18 8 8 0 1 1-10-18z" /></svg></div>
    </div>

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
            class="absolute inset-0 h-full w-full object-cover opacity-[0.82]"
          >
          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_18%,transparent),color-mix(in_srgb,var(--color-primary)_46%,black))]" aria-hidden="true" />

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fattan-hero-svg-wrap::after {
  position: absolute;
  inset: 1rem;
  border: 1px solid color-mix(in srgb, var(--color-secondary) 26%, transparent);
  border-radius: 1.25rem;
  content: "";
  pointer-events: none;
}

.fattan-confetti-particle {
  position: absolute;
  color: var(--color-secondary);
  opacity: 0;
  will-change: transform, opacity;
  pointer-events: none;
  filter: drop-shadow(0 0 5px var(--color-secondary));
}

.fattan-confetti-particle svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

/* Staggered positioning, sizing, and animation timings */
.fattan-confetti-particle.p1 { left: 8%; top: -10%; width: 22px; height: 22px; animation: fattan-confetti-fall-a 24s linear infinite; animation-delay: -2s; }
.fattan-confetti-particle.p2 { left: 22%; top: -10%; width: 14px; height: 14px; animation: fattan-confetti-fall-b 30s linear infinite; animation-delay: -10s; }
.fattan-confetti-particle.p3 { left: 36%; top: -10%; width: 26px; height: 26px; animation: fattan-confetti-fall-a 20s linear infinite; animation-delay: -6s; }
.fattan-confetti-particle.p4 { left: 50%; top: -10%; width: 16px; height: 16px; animation: fattan-confetti-fall-b 28s linear infinite; animation-delay: -15s; }
.fattan-confetti-particle.p5 { left: 64%; top: -10%; width: 22px; height: 22px; animation: fattan-confetti-fall-a 22s linear infinite; animation-delay: -4s; }
.fattan-confetti-particle.p6 { left: 78%; top: -10%; width: 12px; height: 12px; animation: fattan-confetti-fall-b 32s linear infinite; animation-delay: -12s; }
.fattan-confetti-particle.p7 { left: 92%; top: -10%; width: 18px; height: 18px; animation: fattan-confetti-fall-a 26s linear infinite; animation-delay: -18s; }
.fattan-confetti-particle.p8 { left: 15%; top: -10%; width: 16px; height: 16px; animation: fattan-confetti-fall-b 25s linear infinite; animation-delay: -8s; }
.fattan-confetti-particle.p9 { left: 43%; top: -10%; width: 24px; height: 24px; animation: fattan-confetti-fall-a 27s linear infinite; animation-delay: -14s; }
.fattan-confetti-particle.p10 { left: 72%; top: -10%; width: 15px; height: 15px; animation: fattan-confetti-fall-b 29s linear infinite; animation-delay: -22s; }

@media (prefers-reduced-motion: no-preference) {
  .fattan-live-dot {
    animation: fattan-live-pulse 2.4s ease-in-out infinite;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fattan-confetti-particle {
    animation: none !important;
    opacity: 0.12 !important;
    top: 20% !important; /* freeze them in a random layout */
  }
  .fattan-confetti-particle.p2 { top: 45% !important; }
  .fattan-confetti-particle.p3 { top: 70% !important; }
  .fattan-confetti-particle.p4 { top: 15% !important; }
  .fattan-confetti-particle.p5 { top: 60% !important; }
  .fattan-confetti-particle.p6 { top: 30% !important; }
  .fattan-confetti-particle.p7 { top: 80% !important; }
  .fattan-confetti-particle.p8 { top: 50% !important; }
  .fattan-confetti-particle.p9 { top: 35% !important; }
  .fattan-confetti-particle.p10 { top: 75% !important; }
}

@keyframes fattan-live-pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
}

@keyframes fattan-confetti-fall-a {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.28;
  }
  50% {
    transform: translateY(60vh) rotate(180deg) translateX(25px);
  }
  90% {
    opacity: 0.28;
  }
  100% {
    transform: translateY(120vh) rotate(360deg) translateX(-15px);
    opacity: 0;
  }
}

@keyframes fattan-confetti-fall-b {
  0% {
    transform: translateY(0) rotate(360deg) translateX(0);
    opacity: 0;
  }
  15% {
    opacity: 0.22;
  }
  50% {
    transform: translateY(60vh) rotate(180deg) translateX(-20px);
  }
  85% {
    opacity: 0.22;
  }
  100% {
    transform: translateY(120vh) rotate(0deg) translateX(20px);
    opacity: 0;
  }
}
</style>
