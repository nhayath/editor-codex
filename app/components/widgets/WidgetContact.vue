<script setup lang="ts">
import type { SurfaceBackgroundConfig } from '~~/types/template'

const props = withDefaults(defineProps<{
  variant?: string
  eyebrow?: string
  title?: string
  intro?: string
  accent?: string
  background?: SurfaceBackgroundConfig | string
  align?: string
  showIcons?: boolean
  showAddress?: boolean
  showPhone?: boolean
  showEmail?: boolean
  showSocials?: boolean
  showDirections?: boolean
  data?: Record<string, any>
}>(), {
  variant: 'split',
  eyebrow: 'Contact',
  title: 'Contact us',
  intro: 'Get in touch with the mosque office.',
  accent: 'primary',
  background: () => ({ type: 'theme' }),
  align: 'left',
  showIcons: true,
  showAddress: true,
  showPhone: true,
  showEmail: true,
  showSocials: true,
  showDirections: false,
  data: () => ({})
})

const settings = computed(() => props.data?.settings ?? {})
const address = computed(() => {
  const street = String(settings.value.address || '').trim()
  const locality = [settings.value.city, settings.value.postcode]
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .join(' ')

  return [street, locality].filter(Boolean).join(', ')
})

const directionsUrl = computed(() =>
  address.value
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.value)}`
    : ''
)

const contactItems = computed(() => [
  {
    id: 'address',
    label: 'Visit us',
    value: address.value,
    icon: 'i-lucide-map-pin',
    href: props.showDirections ? directionsUrl.value : '',
    external: props.showDirections
  },
  {
    id: 'phone',
    label: 'Call us',
    value: String(settings.value.phone || '').trim(),
    icon: 'i-lucide-phone',
    href: settings.value.phone ? `tel:${String(settings.value.phone).replace(/\s+/g, '')}` : '',
    external: false
  },
  {
    id: 'email',
    label: 'Email us',
    value: String(settings.value.email || '').trim(),
    icon: 'i-lucide-mail',
    href: settings.value.email ? `mailto:${String(settings.value.email).trim()}` : '',
    external: false
  }
].filter((item) => {
  if (!item.value) return false
  if (item.id === 'address') return props.showAddress
  if (item.id === 'phone') return props.showPhone
  return props.showEmail
}))

const socialItems = computed(() => [
  { label: 'Facebook', href: settings.value.facebook, icon: 'i-lucide-facebook' },
  { label: 'Instagram', href: settings.value.instagram, icon: 'i-lucide-instagram' },
  { label: 'YouTube', href: settings.value.youtube, icon: 'i-lucide-youtube' }
].filter(item => props.showSocials && item.href))

const hasContent = computed(() => contactItems.value.length > 0 || socialItems.value.length > 0)

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
  hairlineColor
} = surface

const containerStyle = computed(() => {
  if (!isTheme.value) return presentation.value.style
  return {
    background: 'var(--color-surface)',
    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)',
    ...patternStyle.value
  }
})

const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')

const panelStyle = computed(() =>
  useLightText.value
    ? { background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' }
    : {
        background: 'color-mix(in srgb, var(--color-surface) 92%, var(--color-bg))',
        boxShadow: `inset 0 0 0 1px ${hairlineColor.value}`
      }
)

const iconStyle = computed(() =>
  useLightText.value
    ? { background: 'rgba(255,255,255,0.14)', color: '#fff' }
    : { background: `color-mix(in srgb, ${accentVar.value} 12%, var(--color-surface))`, color: accentVar.value }
)

const primaryActionStyle = computed(() =>
  useLightText.value
    ? { background: '#fff', color: accentVar.value }
    : { background: accentVar.value, color: '#fff' }
)
</script>

<template>
  <div class="@container h-full overflow-hidden rounded-lg p-6" :class="presentation.className" :style="containerStyle">
    <!-- ===== CARDS ===== -->
    <template v-if="variant === 'cards'">
      <div :class="alignClass">
        <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
          {{ title }}
        </h2>
        <p class="mt-3" :style="{ color: mutedColor }">
          {{ intro }}
        </p>
      </div>

      <div v-if="hasContent" class="mt-6 grid gap-3 @lg:grid-cols-2 @2xl:grid-cols-3">
        <component
          :is="item.href ? 'a' : 'div'"
          v-for="item in contactItems"
          :key="item.id"
          :href="item.href || undefined"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          class="group flex min-w-0 items-start gap-3 rounded-md p-4 transition"
          :class="item.href ? 'hover:-translate-y-0.5' : ''"
          :style="panelStyle"
        >
          <span v-if="showIcons" class="grid size-10 shrink-0 place-items-center rounded-md" :style="iconStyle">
            <UIcon :name="item.icon" class="size-5" />
          </span>
          <span class="min-w-0">
            <span class="block text-xs font-semibold uppercase tracking-wide" :style="{ color: accentTextColor }">{{ item.label }}</span>
            <span class="mt-1 block break-words text-sm font-medium" :style="{ color: headingColor }">{{ item.value }}</span>
          </span>
        </component>
      </div>

      <div v-if="socialItems.length" class="mt-4 flex flex-wrap gap-2" :class="align === 'center' ? 'justify-center' : ''">
        <a
          v-for="social in socialItems"
          :key="social.label"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="grid size-9 place-items-center rounded-md transition hover:-translate-y-0.5"
          :style="panelStyle"
          :aria-label="social.label"
        >
          <UIcon :name="social.icon" class="size-4.5" :style="{ color: headingColor }" />
        </a>
      </div>
    </template>

    <!-- ===== FEATURE ===== -->
    <template v-else-if="variant === 'feature'">
      <div class="grid gap-6 @xl:grid-cols-[1.15fr_0.85fr] @xl:items-center">
        <div :class="alignClass">
          <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
            {{ eyebrow }}
          </p>
          <h2 class="tenant-heading mt-2 text-3xl font-bold @xl:text-4xl" :style="{ color: headingColor }">
            {{ title }}
          </h2>
          <p class="mt-3 max-w-xl" :class="align === 'center' ? 'mx-auto' : ''" :style="{ color: mutedColor }">
            {{ intro }}
          </p>
          <div v-if="contactItems.length" class="mt-6 flex flex-wrap gap-3" :class="align === 'center' ? 'justify-center' : ''">
            <a
              v-for="item in contactItems.filter(item => item.href)"
              :key="item.id"
              :href="item.href"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
              class="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              :style="primaryActionStyle"
            >
              <UIcon v-if="showIcons" :name="item.icon" class="size-4" />
              {{ item.label }}
            </a>
          </div>
        </div>

        <div v-if="hasContent" class="grid gap-3 rounded-md p-5" :style="panelStyle">
          <component
            :is="item.href ? 'a' : 'div'"
            v-for="item in contactItems"
            :key="item.id"
            :href="item.href || undefined"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            class="flex min-w-0 items-start gap-3"
          >
            <UIcon v-if="showIcons" :name="item.icon" class="mt-0.5 size-4 shrink-0" :style="{ color: accentTextColor }" />
            <span class="min-w-0 break-words text-sm" :style="{ color: mutedColor }">{{ item.value }}</span>
          </component>
          <div v-if="socialItems.length" class="flex flex-wrap gap-2 pt-1">
            <a
              v-for="social in socialItems"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="grid size-8 place-items-center rounded-md"
              :style="iconStyle"
              :aria-label="social.label"
            >
              <UIcon :name="social.icon" class="size-4" />
            </a>
          </div>
        </div>
      </div>
    </template>

    <!-- ===== COMPACT ===== -->
    <template v-else-if="variant === 'compact'">
      <div class="flex flex-col gap-5 @xl:flex-row @xl:items-center @xl:justify-between">
        <div :class="alignClass">
          <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
            {{ eyebrow }}
          </p>
          <h2 class="tenant-heading mt-1 text-2xl font-bold" :style="{ color: headingColor }">
            {{ title }}
          </h2>
        </div>
        <div v-if="hasContent" class="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3" :class="align === 'center' ? 'justify-center' : ''">
          <component
            :is="item.href ? 'a' : 'span'"
            v-for="item in contactItems"
            :key="item.id"
            :href="item.href || undefined"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            class="inline-flex min-w-0 items-center gap-2 text-sm"
            :style="{ color: mutedColor }"
          >
            <UIcon v-if="showIcons" :name="item.icon" class="size-4 shrink-0" :style="{ color: accentTextColor }" />
            <span class="break-words">{{ item.value }}</span>
          </component>
          <a
            v-for="social in socialItems"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
          >
            <UIcon :name="social.icon" class="size-4.5" :style="{ color: accentTextColor }" />
          </a>
        </div>
      </div>
    </template>

    <!-- ===== DIRECTORY ===== -->
    <template v-else-if="variant === 'directory'">
      <div :class="alignClass">
        <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
          {{ eyebrow }}
        </p>
        <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
          {{ title }}
        </h2>
        <p class="mt-3" :style="{ color: mutedColor }">
          {{ intro }}
        </p>
      </div>
      <div v-if="hasContent" class="mt-6 divide-y" :style="{ borderColor: hairlineColor }">
        <component
          :is="item.href ? 'a' : 'div'"
          v-for="item in contactItems"
          :key="item.id"
          :href="item.href || undefined"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          class="grid min-w-0 gap-1 py-4 @md:grid-cols-[10rem_1fr_auto] @md:items-center @md:gap-4"
          :style="{ borderColor: hairlineColor }"
        >
          <span class="flex items-center gap-2 text-sm font-semibold" :style="{ color: headingColor }">
            <UIcon v-if="showIcons" :name="item.icon" class="size-4" :style="{ color: accentTextColor }" />
            {{ item.label }}
          </span>
          <span class="min-w-0 break-words text-sm" :style="{ color: mutedColor }">{{ item.value }}</span>
          <UIcon v-if="item.href" name="i-lucide-arrow-up-right" class="hidden size-4 @md:block" :style="{ color: accentTextColor }" />
        </component>
        <div v-if="socialItems.length" class="flex flex-wrap items-center gap-3 py-4">
          <span class="text-sm font-semibold" :style="{ color: headingColor }">Follow us</span>
          <a
            v-for="social in socialItems"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm"
            :style="{ color: accentTextColor }"
          >
            <UIcon :name="social.icon" class="size-4" />
            {{ social.label }}
          </a>
        </div>
      </div>
    </template>

    <!-- ===== SPLIT (default / legacy fallback) ===== -->
    <template v-else>
      <div class="grid gap-6 @xl:grid-cols-[1fr_1fr]">
        <div :class="alignClass">
          <p class="text-sm font-semibold" :style="{ color: accentTextColor }">
            {{ eyebrow }}
          </p>
          <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
            {{ title }}
          </h2>
          <p class="mt-3" :style="{ color: mutedColor }">
            {{ intro }}
          </p>
        </div>

        <div v-if="hasContent" class="grid gap-3 text-sm" :style="{ color: mutedColor }">
          <component
            :is="item.href ? 'a' : 'span'"
            v-for="item in contactItems"
            :key="item.id"
            :href="item.href || undefined"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            class="flex min-w-0 items-start gap-2"
          >
            <UIcon v-if="showIcons" :name="item.icon" class="mt-0.5 size-4 shrink-0" :style="{ color: accentTextColor }" />
            <span class="break-words">{{ item.value }}</span>
          </component>

          <div v-if="socialItems.length" class="mt-2 flex items-center gap-2">
            <a
              v-for="social in socialItems"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="grid size-8 place-items-center rounded-md ring-1 ring-inset transition hover:bg-[var(--color-background)]"
              :style="{ color: headingColor, '--tw-ring-color': hairlineColor }"
              :aria-label="social.label"
            >
              <UIcon :name="social.icon" class="size-5" />
            </a>
          </div>
        </div>
      </div>
    </template>

    <p v-if="!hasContent" class="mt-6 text-sm" :class="alignClass" :style="{ color: mutedColor }">
      Contact details will appear here once they are added in Settings.
    </p>
  </div>
</template>
