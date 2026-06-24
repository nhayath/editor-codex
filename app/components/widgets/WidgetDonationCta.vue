<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonLabel?: string
  variant?: string
  eyebrow?: string
  accent?: string
  background?: string
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
  title: 'Support your mosque',
  subtitle: 'Your donations help sustain worship, education, and community support.',
  buttonLabel: 'Donate now',
  variant: 'banner',
  eyebrow: 'Giving',
  accent: 'primary',
  background: 'solid',
  align: 'left',
  showProgress: true,
  showRaised: true,
  showAmounts: false,
  presetAmounts: '10,25,50,100',
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
  isFeatured?: boolean
}

const campaigns = computed<Campaign[]>(() => (props.data?.donations ?? []) as Campaign[])
const featured = computed<Campaign | undefined>(
  () => campaigns.value.find(item => item.isFeatured) ?? campaigns.value[0]
)
const hasCampaigns = computed(() => campaigns.value.length > 0)
const otherCampaigns = computed(() => campaigns.value.filter(c => c.id !== featured.value?.id))

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

// `solid`/`gradient` are filled (white text); `surface` is a light card.
const isFilled = computed(() => props.background !== 'surface')

const containerStyle = computed(() => {
  if (props.background === 'surface') {
    return {
      background: 'var(--color-surface)',
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)`
    }
  }
  if (props.background === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))`
    }
  }
  return { background: accentVar.value }
})

const headingColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)')
const accentTextColor = computed(() => isFilled.value ? 'var(--color-secondary)' : accentVar.value)
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
const trackColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.2)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
const barColor = computed(() => isFilled.value ? '#fff' : accentVar.value)
// Cards/panels sit on a tint of the card surface.
const panelStyle = computed(() =>
  isFilled.value
    ? { background: 'rgba(255,255,255,0.1)' }
    : { background: `color-mix(in srgb, ${accentVar.value} 7%, var(--color-surface))`, boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` }
)
// Filled backgrounds use a light "neutral" button; surface uses the accent.
const buttonColor = computed(() => isFilled.value ? 'neutral' : 'primary')
const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')

// Colours handed to the amount picker so it matches the filled/surface scheme.
const pickerColors = computed(() => ({
  activeBg: barColor.value,
  activeText: isFilled.value ? accentVar.value : '#fff',
  idleText: headingColor.value,
  border: hairlineColor.value,
  muted: mutedColor.value
}))
</script>

<template>
  <div
    class="@container h-full overflow-hidden rounded-lg p-6"
    :style="containerStyle"
  >
    <!-- Empty state -->
    <div v-if="!hasCampaigns" :class="alignClass">
      <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
      <h2 class="tenant-heading mt-2 text-2xl font-bold" :style="{ color: headingColor }">{{ title }}</h2>
      <p class="mt-3 text-sm" :style="{ color: mutedColor }">No donation campaigns yet.</p>
    </div>

    <!-- CARDS: grid of all campaigns -->
    <div v-else-if="variant === 'cards'">
      <div class="mb-5" :class="alignClass">
        <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
        <h2 class="tenant-heading mt-2 text-2xl font-bold @xl:text-3xl" :style="{ color: headingColor }">{{ title }}</h2>
        <p v-if="subtitle" class="mt-2 max-w-2xl text-sm" :class="align === 'center' ? 'mx-auto' : ''" :style="{ color: mutedColor }">{{ subtitle }}</p>
      </div>

      <DonationAmountPicker
        v-if="showAmounts"
        class="mb-5"
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

      <div class="grid gap-4 @md:grid-cols-2">
        <article
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="rounded-md p-5"
          :style="panelStyle"
        >
          <h3 class="text-lg font-semibold" :style="{ color: headingColor }">{{ campaign.title }}</h3>
          <p v-if="campaign.description" class="mt-2 text-sm" :style="{ color: mutedColor }">{{ campaign.description }}</p>
          <div v-if="showProgress && campaign.goal" class="mt-4">
            <div class="h-2 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
              <div class="h-full rounded-full" :style="{ width: pct(campaign) + '%', background: barColor }" />
            </div>
            <p v-if="showRaised" class="mt-2 text-xs" :style="{ color: mutedColor }">
              {{ currencySymbol }}{{ money(campaign.raised) }} of {{ currencySymbol }}{{ money(campaign.goal) }} raised
            </p>
          </div>
          <UButton
            :to="donateUrl(campaign)"
            target="_blank"
            rel="noopener noreferrer"
            :disabled="!hasPay(campaign)"
            class="mt-4"
            :color="buttonColor"
            size="sm"
            :label="buttonLabel"
          >
            <template #leading>
              <IconGlyph name="islamic-donation" class="size-4" />
            </template>
          </UButton>
        </article>
      </div>
    </div>

    <!-- FEATURED: one spotlighted campaign + amount selector, rest listed -->
    <div v-else-if="variant === 'featured'" class="grid gap-6 @xl:grid-cols-[1.4fr_1fr]">
      <div :class="alignClass">
        <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
        <h2 class="tenant-heading mt-2 text-2xl font-bold @xl:text-3xl" :style="{ color: headingColor }">{{ title }}</h2>
        <p v-if="subtitle" class="mt-3 max-w-2xl" :style="{ color: mutedColor }">{{ subtitle }}</p>
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

      <div class="grid content-start gap-3">
        <article
          v-for="campaign in otherCampaigns"
          :key="campaign.id"
          class="rounded-md p-4"
          :style="panelStyle"
        >
          <h3 class="text-sm font-semibold" :style="{ color: headingColor }">{{ campaign.title }}</h3>
          <div v-if="showProgress && campaign.goal" class="mt-3 h-1.5 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
            <div class="h-full rounded-full" :style="{ width: pct(campaign) + '%', background: barColor }" />
          </div>
          <p v-if="showRaised && campaign.goal" class="mt-2 text-xs" :style="{ color: mutedColor }">
            {{ currencySymbol }}{{ money(campaign.raised) }} of {{ currencySymbol }}{{ money(campaign.goal) }}
          </p>
        </article>
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

    <!-- BANNER (default / legacy fallback): featured campaign + single CTA -->
    <div v-else class="grid gap-6 @xl:grid-cols-[1fr_auto] @xl:items-center">
      <div :class="alignClass">
        <p class="text-sm font-medium" :style="{ color: accentTextColor }">{{ eyebrow }}</p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">{{ title }}</h2>
        <p class="mt-3 max-w-2xl" :style="{ color: mutedColor }">{{ subtitle }}</p>
        <div v-if="showProgress && featured?.goal" class="mt-4 max-w-md" :class="align === 'center' ? 'mx-auto' : ''">
          <div class="h-2 w-full overflow-hidden rounded-full" :style="{ background: trackColor }">
            <div class="h-full rounded-full" :style="{ width: pct(featured) + '%', background: barColor }" />
          </div>
        </div>
        <p v-if="showRaised && featured" class="mt-3 text-sm" :style="{ color: mutedColor }">
          {{ featured.title }}: {{ currencySymbol }}{{ money(featured.raised) }} raised
        </p>
      </div>
      <div class="flex flex-col gap-3" :class="align === 'center' ? 'items-center' : 'items-start'">
        <DonationAmountPicker
          v-if="showAmounts"
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
          :color="buttonColor"
          :label="buttonLabel"
        >
          <template #leading>
            <IconGlyph name="islamic-donation" class="size-4" />
          </template>
        </UButton>
      </div>
    </div>
  </div>
</template>
