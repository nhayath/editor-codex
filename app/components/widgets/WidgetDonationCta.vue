<script setup lang="ts">
import type { SurfaceBackgroundConfig } from '~~/types/template'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonLabel?: string
  campaignId?: string
  imageUrl?: string
  variant?: string
  eyebrow?: string
  accent?: string
  // Unified background config. Legacy string values ('surface'/'solid'/
  // 'gradient') from older saved drafts are normalised below.
  background?: SurfaceBackgroundConfig | string
  align?: string
  showProgress?: boolean
  showRaised?: boolean
  showAmounts?: boolean
  presetAmounts?: string
  allowCustomAmount?: boolean
  frequencyToggle?: boolean
  currencySymbol?: string
  amountQueryParam?: string
  data?: Record<string, any>
}>(), {
  title: 'Quick Donate',
  subtitle: 'Your contribution will help us to maintain and develop the wide range of services we offer.',
  buttonLabel: 'Donate',
  campaignId: '',
  imageUrl: '/uploads/cmqvigb8x0001a85rnwf799wo/donation-box-7eff6832-27a0-4d13-8bba-c1990c82f698.png',
  variant: 'banner',
  eyebrow: 'Giving',
  accent: 'primary',
  background: () => ({ type: 'theme' }),
  align: 'left',
  showProgress: false,
  showRaised: false,
  showAmounts: true,
  presetAmounts: '30,50,100',
  allowCustomAmount: true,
  frequencyToggle: false,
  currencySymbol: '£',
  amountQueryParam: 'amount',
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

const campaigns = computed<Campaign[]>(() =>
  ((props.data?.donations ?? []) as Campaign[]).filter(campaign => !campaign.status || campaign.status === 'ACTIVE')
)
const featured = computed<Campaign | undefined>(
  () => campaigns.value.find(item => item.id === props.campaignId)
    ?? campaigns.value.find(item => item.isFeatured)
    ?? campaigns.value[0]
)
const hasCampaigns = computed(() => campaigns.value.length > 0)

// ----- Donation amount selector -----------------------------------------
// `selectedAmount` drives the donate links via `donateUrl()`. Custom input is
// sanitised to digits. Frequency is one-off unless the toggle is enabled.
const selectedAmount = ref<number | null>(null)
const customAmount = ref('')
const frequency = ref<'once' | 'monthly'>('once')

const presets = computed<number[]>(() =>
  String(props.presetAmounts ?? '')
    .split(',')
    .map(part => Number(part.trim()))
    .filter(n => Number.isFinite(n) && n > 0)
)

watch(presets, (amounts) => {
  if (props.showAmounts && selectedAmount.value === null && amounts.length) {
    selectedAmount.value = amounts[0]
  }
}, { immediate: true })

function selectPreset(amount: number) {
  selectedAmount.value = amount
  customAmount.value = ''
}

function onCustomInput(event: Event) {
  const cleaned = (event.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
  customAmount.value = cleaned
  const num = Number(cleaned)
  selectedAmount.value = Number.isFinite(num) && num > 0 ? num : null
}

// Build the payment URL, appending the chosen amount (and frequency) as query
// params. Falls back to the bare paymentUrl when no amount is selected.
function donateUrl(campaign?: Campaign) {
  const base = campaign?.paymentUrl || '#'
  if (base === '#' || !props.showAmounts || !selectedAmount.value) return base
  const sep = base.includes('?') ? '&' : '?'
  const param = (props.amountQueryParam || 'amount').trim() || 'amount'
  let url = `${base}${sep}${encodeURIComponent(param)}=${selectedAmount.value}`
  if (props.frequencyToggle && frequency.value === 'monthly') {
    url += `&frequency=monthly`
  }
  return url
}

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

// ----- Shared accent / background system --------------------------------
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

// Normalise legacy string backgrounds ('surface'/'solid'/'gradient') onto the
// unified SurfaceBackgroundConfig. 'surface' → theme (the widget's own light
// card); the filled variants map to solid/gradient with the accent colour.
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

// Contrast-correct colour set shared with every unified-background widget.
const surface = useSurfaceBackground(normalizedBackground, { accent: accentVar })
const {
  presentation,
  isTheme,
  isFilled,
  patternStyle,
  useLightText,
  headingColor,
  bodyColor,
  mutedColor,
  accentTextColor,
  hairlineColor,
  trackColor,
  barColor,
  panelStyle,
  buttonColor
} = surface

// Theme mode keeps the widget's own light card chrome; any fill paints via the
// shared presentation (className carries the pattern layer when relevant). A
// pattern overlay layers over the theme card too, so merge its CSS vars.
const containerStyle = computed(() => {
  if (isTheme.value) {
    if (props.variant === 'banner') {
      return { background: 'color-mix(in srgb, var(--color-surface) 92%, var(--color-bg))', ...patternStyle.value }
    }
    return {
      background: 'var(--color-surface)',
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)`,
      ...patternStyle.value
    }
  }
  return presentation.value.style
})

// Banner headline follows the accent on the light card, but flips to white on a
// filled/dark surface so it never clashes with the fill.
const bannerTitleColor = computed(() => useLightText.value ? '#fff' : accentVar.value)
const bannerImageUrl = computed(() => props.imageUrl || featured.value?.imageUrl || '')
const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')

// Colours handed to the amount picker so it matches the filled/surface scheme.
const pickerColors = computed(() => ({
  activeBg: barColor.value,
  activeText: useLightText.value ? accentVar.value : '#fff',
  idleText: headingColor.value,
  border: hairlineColor.value,
  muted: mutedColor.value
}))

const rootClass = computed(() => [
  '@container relative isolate h-full overflow-hidden',
  presentation.value.className,
  props.variant === 'banner' ? 'px-5 py-8 @md:px-7 @xl:px-8 @xl:py-10' : 'rounded-lg p-6'
])

const bannerButtonStyle = computed(() => ({
  background: accentVar.value,
  color: '#fff',
  boxShadow: `0 12px 26px color-mix(in srgb, ${accentVar.value} 20%, transparent)`
}))

function bannerAmountStyle(amount: number) {
  const active = selectedAmount.value === amount
  return active
    ? { background: accentVar.value, borderColor: accentVar.value, color: '#fff' }
    : { background: 'rgba(255,255,255,0.72)', borderColor: 'color-mix(in srgb, var(--color-text) 18%, transparent)', color: accentVar.value }
}
</script>

<template>
  <div
    :class="rootClass"
    :style="containerStyle"
  >
    <div
      v-if="variant === 'banner' && isTheme"
      class="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-text)] opacity-[0.035] [mask-image:url('/backgrounds/eight-point-star.svg')] [mask-position:center] [mask-repeat:repeat] [mask-size:170px]"
      aria-hidden="true"
    />
    <!-- Empty state -->
    <div v-if="!hasCampaigns" :class="alignClass">
      <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
      <h2 class="tenant-heading mt-2 text-2xl font-bold" :style="{ color: headingColor }">{{ title }}</h2>
      <p class="mt-3 text-sm" :style="{ color: mutedColor }">No donation campaigns yet.</p>
    </div>

    <!-- FEATURED: one spotlighted campaign + amount selector -->
    <div v-else-if="variant === 'featured'" class="grid gap-6 @xl:grid-cols-[1.15fr_0.85fr] @xl:items-center">
      <div :class="alignClass">
        <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
        <h2 class="tenant-heading mt-2 text-2xl font-bold @xl:text-3xl" :style="{ color: headingColor }">{{ title }}</h2>
        <p v-if="subtitle" class="mt-3 max-w-2xl" :style="{ color: mutedColor }">{{ subtitle }}</p>
        <div v-if="featured?.title || featured?.description" class="mt-5 rounded-md p-4 text-left" :style="panelStyle">
          <h3 v-if="featured?.title" class="text-lg font-semibold" :style="{ color: headingColor }">{{ featured.title }}</h3>
          <p v-if="featured?.description" class="mt-2 text-sm" :style="{ color: mutedColor }">{{ featured.description }}</p>
        </div>
        <div v-if="showProgress && featured?.goal" class="mt-5">
          <div class="h-2.5 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
            <div class="h-full rounded-full" :style="{ width: pct(featured) + '%', background: barColor }" />
          </div>
          <p v-if="showRaised" class="mt-2 text-sm" :style="{ color: mutedColor }">
            {{ featured.title }}: {{ currencySymbol }}{{ money(featured.raised) }} of {{ currencySymbol }}{{ money(featured.goal) }} raised
          </p>
        </div>
        <DonationAmountPicker
          v-if="showAmounts"
          class="mt-5"
          :presets="presets"
          :selected="selectedAmount"
          :custom="customAmount"
          :allow-custom="allowCustomAmount"
          :frequency-toggle="frequencyToggle"
          :frequency="frequency"
          :currency="currencySymbol"
          :colors="pickerColors"
          @select="selectPreset"
          @custom="onCustomInput"
          @frequency="frequency = $event"
        />
        <UButton
          :to="donateUrl(featured)"
          target="_blank"
          rel="noopener noreferrer"
          :disabled="!hasPay(featured)"
          class="mt-5"
          :color="buttonColor"
          :label="buttonLabel"
        >
          <template #leading>
            <IconGlyph name="islamic-donation" class="size-4" />
          </template>
        </UButton>
      </div>

      <div v-if="featured?.imageUrl" class="overflow-hidden rounded-md" :style="panelStyle">
        <img
          :src="featured.imageUrl"
          :alt="`${featured.title ?? title} donation image`"
          class="aspect-[4/3] w-full object-cover"
        >
      </div>
    </div>

    <!-- COMPACT: slim single-column CTA, ideal for sidebars -->
    <div v-else-if="variant === 'compact'" :class="alignClass">
      <p class="text-xs font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
      <h2 class="tenant-heading mt-1 text-lg font-bold" :style="{ color: headingColor }">{{ title }}</h2>
      <p v-if="subtitle" class="mt-1 text-sm" :style="{ color: mutedColor }">{{ subtitle }}</p>
      <div v-if="showProgress && featured?.goal" class="mt-3 h-1.5 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
        <div class="h-full rounded-full" :style="{ width: pct(featured) + '%', background: barColor }" />
      </div>
      <DonationAmountPicker
        v-if="showAmounts"
        class="mt-3"
        :presets="presets"
        :selected="selectedAmount"
        :custom="customAmount"
        :allow-custom="allowCustomAmount"
        :frequency-toggle="frequencyToggle"
        :frequency="frequency"
        :currency="currencySymbol"
        :colors="pickerColors"
        @select="selectPreset"
        @custom="onCustomInput"
        @frequency="frequency = $event"
      />
      <UButton
        :to="donateUrl(featured)"
        target="_blank"
        rel="noopener noreferrer"
        :disabled="!hasPay(featured)"
        class="mt-3"
        :color="buttonColor"
        size="sm"
        block
        :label="buttonLabel"
      >
        <template #leading>
          <IconGlyph name="islamic-donation" class="size-4" />
        </template>
      </UButton>
    </div>

    <!-- BANNER (default): split quick-donate panel with amounts + image -->
    <div v-else class="grid gap-8 @4xl:grid-cols-[minmax(280px,0.52fr)_minmax(0,0.88fr)] @4xl:items-center @6xl:gap-12">
      <div :class="alignClass">
        <h2 class="tenant-heading text-3xl font-bold leading-tight @xl:text-4xl" :style="{ color: bannerTitleColor }">{{ title }}</h2>
        <p class="mt-5 max-w-[35rem] text-base leading-8 @xl:text-lg" :style="{ color: bodyColor }">{{ subtitle }}</p>
        <div v-if="showProgress && featured?.goal" class="mt-6 max-w-md" :class="align === 'center' ? 'mx-auto' : ''">
          <div class="h-2 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
            <div class="h-full rounded-full" :style="{ width: pct(featured) + '%', background: barColor }" />
          </div>
        </div>
        <p v-if="showRaised && featured" class="mt-3 text-sm" :style="{ color: mutedColor }">
          {{ featured.title }}: {{ currencySymbol }}{{ money(featured.raised) }} raised
        </p>

        <div v-if="showAmounts" class="mt-8 grid max-w-sm gap-4">
          <div
            v-if="frequencyToggle"
            class="inline-flex w-fit rounded-full bg-white/75 p-1 ring-1 ring-[color:color-mix(in_srgb,var(--color-text)_14%,transparent)]"
          >
            <button
              v-for="opt in (['once', 'monthly'] as const)"
              :key="opt"
              type="button"
              class="rounded-full px-4 py-1.5 text-sm font-bold transition"
              :style="frequency === opt ? { background: accentVar, color: '#fff' } : { color: accentVar }"
              @click="frequency = opt"
            >
              {{ opt === 'once' ? 'One-off' : 'Monthly' }}
            </button>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="amount in presets"
              :key="amount"
              type="button"
              class="h-14 min-w-24 rounded-md border px-6 text-base font-black tabular-nums transition hover:-translate-y-0.5 @xl:h-16"
              :style="bannerAmountStyle(amount)"
              @click="selectPreset(amount)"
            >
              {{ currencySymbol }}{{ amount }}
            </button>
          </div>

          <label
            v-if="allowCustomAmount"
            class="grid min-h-16 max-w-[18rem] grid-cols-[1fr_7rem] items-center gap-3 rounded-md border bg-white/78 px-5 py-3"
            :style="{ borderColor: 'color-mix(in srgb, var(--color-text) 18%, transparent)', color: accentVar }"
          >
            <span class="text-base font-black">Other</span>
            <input
              :value="customAmount"
              inputmode="decimal"
              class="h-11 min-w-0 rounded-sm border bg-white px-3 text-base font-bold outline-none"
              :style="{ borderColor: 'color-mix(in srgb, var(--color-text) 16%, transparent)', color: 'var(--color-text)' }"
              @input="onCustomInput"
            >
          </label>
        </div>

        <UButton
          :to="donateUrl(featured)"
          target="_blank"
          rel="noopener noreferrer"
          :disabled="!hasPay(featured)"
          class="mt-6 rounded-full px-7 py-3 text-base font-black"
          :style="bannerButtonStyle"
          color="neutral"
          :label="buttonLabel"
        />
      </div>

      <div v-if="bannerImageUrl" class="order-first @4xl:order-none">
        <img
          :src="bannerImageUrl"
          :alt="`${title} donation image`"
          class="aspect-[16/10] w-full object-cover @4xl:min-h-[23rem] @6xl:min-h-[28rem]"
        >
      </div>
    </div>
  </div>
</template>
