<script setup lang="ts">
import type { SurfaceBackgroundConfig } from '~~/types/template'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonLabel?: string
  variant?: string
  eyebrow?: string
  accent?: string
  background?: SurfaceBackgroundConfig | string
  align?: string
  showImages?: boolean
  showProgress?: boolean
  showRaised?: boolean
  maxItems?: number
  currencySymbol?: string
  data?: Record<string, any>
}>(), {
  title: 'Donation Campaigns',
  subtitle: 'Support the projects and services that matter most to our community.',
  buttonLabel: 'Donate',
  variant: 'grid',
  eyebrow: 'Giving',
  accent: 'primary',
  background: () => ({ type: 'theme' }),
  align: 'left',
  showImages: true,
  showProgress: true,
  showRaised: true,
  maxItems: 6,
  currencySymbol: '£',
  data: () => ({})
})

interface Campaign {
  id?: string
  title?: string
  description?: string
  goal?: number
  raised?: number
  paymentUrl?: string
  imageUrl?: string
  isFeatured?: boolean
  status?: string
}

const campaigns = computed<Campaign[]>(() => {
  const active = ((props.data?.donations ?? []) as Campaign[])
    .filter(campaign => !campaign.status || campaign.status === 'ACTIVE')

  const limit = Number(props.maxItems)
  return Number.isFinite(limit) && limit > 0 ? active.slice(0, limit) : active
})

const hasCampaigns = computed(() => campaigns.value.length > 0)
const spotlightCampaign = computed(() => campaigns.value[0])
const remainingCampaigns = computed(() => campaigns.value.slice(1))

function hasPay(campaign?: Campaign) {
  return Boolean(campaign?.paymentUrl)
}

function pct(campaign?: Campaign) {
  if (!campaign?.goal) return 0
  return Math.min(100, Math.round(((campaign.raised ?? 0) / campaign.goal) * 100))
}

function money(value?: number) {
  return value?.toLocaleString?.() ?? value ?? 0
}

const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

const normalizedBackground = computed<SurfaceBackgroundConfig>(() => {
  const bg = props.background
  if (bg && typeof bg === 'object') return bg
  switch (bg) {
    case 'solid':
      return { type: 'solid', color: accentVar.value }
    case 'gradient':
      return { type: 'gradient', from: accentVar.value, to: `color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary))`, angle: 135 }
    default:
      return { type: 'theme' }
  }
})

const surface = useSurfaceBackground(normalizedBackground, { accent: accentVar })
const {
  presentation,
  isTheme,
  patternStyle,
  useLightText,
  headingColor,
  mutedColor,
  accentTextColor,
  hairlineColor,
  trackColor,
  barColor,
  panelStyle,
  buttonColor
} = surface

const containerStyle = computed(() => {
  if (isTheme.value) {
    return {
      background: 'var(--color-surface)',
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--color-text) 10%, transparent)`,
      ...patternStyle.value
    }
  }
  return presentation.value.style
})

const rootClass = computed(() => [
  '@container relative isolate h-full overflow-hidden rounded-lg p-6 @xl:p-7',
  presentation.value.className
])

const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')
const buttonStyle = computed(() => useLightText.value ? undefined : { color: '#fff' })

function cardClass(featured = false) {
  if (props.variant === 'list') {
    return 'grid gap-4 rounded-md p-4 @md:grid-cols-[auto_minmax(0,1fr)_auto] @md:items-center'
  }

  if (featured) {
    return 'grid gap-5 rounded-md p-5 @xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] @xl:items-center'
  }

  return 'overflow-hidden rounded-md'
}
</script>

<template>
  <div
    :class="rootClass"
    :style="containerStyle"
  >
    <div class="mb-6" :class="alignClass">
      <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
      <h2 class="tenant-heading mt-2 text-2xl font-bold @xl:text-3xl" :style="{ color: headingColor }">{{ title }}</h2>
      <p
        v-if="subtitle"
        class="mt-2 max-w-2xl text-sm leading-6"
        :class="align === 'center' ? 'mx-auto' : ''"
        :style="{ color: mutedColor }"
      >
        {{ subtitle }}
      </p>
    </div>

    <p
      v-if="!hasCampaigns"
      class="text-sm"
      :class="alignClass"
      :style="{ color: mutedColor }"
    >
      No active donation campaigns yet.
    </p>

    <div v-else-if="variant === 'list'" class="grid gap-3">
      <article
        v-for="campaign in campaigns"
        :key="campaign.id ?? campaign.title"
        :class="cardClass()"
        :style="panelStyle"
      >
        <img
          v-if="showImages && campaign.imageUrl"
          :src="campaign.imageUrl"
          :alt="`${campaign.title ?? 'Donation campaign'} image`"
          class="size-20 rounded-md object-cover"
        >
        <div
          v-else-if="showImages"
          class="grid size-20 place-items-center rounded-md"
          :style="{ background: trackColor, color: accentTextColor }"
          aria-hidden="true"
        >
          <IconGlyph name="islamic-donation" class="size-7" />
        </div>

        <div class="min-w-0">
          <h3 class="text-base font-semibold" :style="{ color: headingColor }">{{ campaign.title }}</h3>
          <p v-if="campaign.description" class="mt-1 line-clamp-2 text-sm" :style="{ color: mutedColor }">{{ campaign.description }}</p>
          <div v-if="showProgress && campaign.goal" class="mt-3">
            <div class="h-1.5 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
              <div class="h-full rounded-full" :style="{ width: pct(campaign) + '%', background: barColor }" />
            </div>
            <p v-if="showRaised" class="mt-1.5 text-xs" :style="{ color: mutedColor }">
              {{ currencySymbol }}{{ money(campaign.raised) }} of {{ currencySymbol }}{{ money(campaign.goal) }} raised
            </p>
          </div>
        </div>

        <UButton
          :to="campaign.paymentUrl || '#'"
          target="_blank"
          rel="noopener noreferrer"
          :disabled="!hasPay(campaign)"
          :color="buttonColor"
          size="sm"
          :label="buttonLabel"
          :style="buttonStyle"
        >
          <template #leading>
            <IconGlyph name="islamic-donation" class="size-4" />
          </template>
        </UButton>
      </article>
    </div>

    <div v-else-if="variant === 'spotlight'" class="grid gap-4">
      <article
        v-if="spotlightCampaign"
        :class="cardClass(true)"
        :style="panelStyle"
      >
        <img
          v-if="showImages && spotlightCampaign.imageUrl"
          :src="spotlightCampaign.imageUrl"
          :alt="`${spotlightCampaign.title ?? 'Donation campaign'} image`"
          class="aspect-[16/10] w-full rounded-md object-cover"
        >
        <div
          v-else-if="showImages"
          class="grid aspect-[16/10] w-full place-items-center rounded-md"
          :style="{ background: trackColor, color: accentTextColor }"
          aria-hidden="true"
        >
          <IconGlyph name="islamic-donation" class="size-10" />
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-wider" :style="{ color: accentTextColor }">Featured campaign</p>
          <h3 class="mt-2 text-xl font-bold @xl:text-2xl" :style="{ color: headingColor }">{{ spotlightCampaign.title }}</h3>
          <p v-if="spotlightCampaign.description" class="mt-3 text-sm leading-6" :style="{ color: mutedColor }">{{ spotlightCampaign.description }}</p>
          <div v-if="showProgress && spotlightCampaign.goal" class="mt-5">
            <div class="h-2 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
              <div class="h-full rounded-full" :style="{ width: pct(spotlightCampaign) + '%', background: barColor }" />
            </div>
            <p v-if="showRaised" class="mt-2 text-sm" :style="{ color: mutedColor }">
              {{ currencySymbol }}{{ money(spotlightCampaign.raised) }} of {{ currencySymbol }}{{ money(spotlightCampaign.goal) }} raised
            </p>
          </div>
          <UButton
            :to="spotlightCampaign.paymentUrl || '#'"
            target="_blank"
            rel="noopener noreferrer"
            :disabled="!hasPay(spotlightCampaign)"
            class="mt-5"
            :color="buttonColor"
            :label="buttonLabel"
            :style="buttonStyle"
          >
            <template #leading>
              <IconGlyph name="islamic-donation" class="size-4" />
            </template>
          </UButton>
        </div>
      </article>

      <div v-if="remainingCampaigns.length" class="grid gap-4 @md:grid-cols-2">
        <article
          v-for="campaign in remainingCampaigns"
          :key="campaign.id ?? campaign.title"
          class="rounded-md p-4"
          :style="panelStyle"
        >
          <h3 class="text-base font-semibold" :style="{ color: headingColor }">{{ campaign.title }}</h3>
          <p v-if="campaign.description" class="mt-1 line-clamp-2 text-sm" :style="{ color: mutedColor }">{{ campaign.description }}</p>
          <div v-if="showProgress && campaign.goal" class="mt-3">
            <div class="h-1.5 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
              <div class="h-full rounded-full" :style="{ width: pct(campaign) + '%', background: barColor }" />
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-else class="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3">
      <article
        v-for="campaign in campaigns"
        :key="campaign.id ?? campaign.title"
        :class="cardClass()"
        :style="panelStyle"
      >
        <img
          v-if="showImages && campaign.imageUrl"
          :src="campaign.imageUrl"
          :alt="`${campaign.title ?? 'Donation campaign'} image`"
          class="aspect-[16/10] w-full object-cover"
        >
        <div class="p-5">
          <h3 class="text-lg font-semibold" :style="{ color: headingColor }">{{ campaign.title }}</h3>
          <p v-if="campaign.description" class="mt-2 line-clamp-3 text-sm leading-6" :style="{ color: mutedColor }">{{ campaign.description }}</p>
          <div v-if="showProgress && campaign.goal" class="mt-4">
            <div class="h-2 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
              <div class="h-full rounded-full" :style="{ width: pct(campaign) + '%', background: barColor }" />
            </div>
            <p v-if="showRaised" class="mt-2 text-xs" :style="{ color: mutedColor }">
              {{ currencySymbol }}{{ money(campaign.raised) }} of {{ currencySymbol }}{{ money(campaign.goal) }} raised
            </p>
          </div>
          <UButton
            :to="campaign.paymentUrl || '#'"
            target="_blank"
            rel="noopener noreferrer"
            :disabled="!hasPay(campaign)"
            class="mt-4"
            :color="buttonColor"
            size="sm"
            :label="buttonLabel"
            :style="buttonStyle"
          >
            <template #leading>
              <IconGlyph name="islamic-donation" class="size-4" />
            </template>
          </UButton>
        </div>
      </article>
    </div>
  </div>
</template>
