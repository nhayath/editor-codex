import { computed, toValue, type CSSProperties, type MaybeRefOrGetter } from 'vue'
import type { SurfaceBackgroundConfig } from '~~/types/template'
import { pageBackgroundPatterns } from '~/composables/usePageBackground'

// The tone tells consumers whether the resulting surface is visually dark
// (needs light text) or light (needs dark text). `neutral` means "leave the
// theme text colours alone" — used for `theme` mode and low-overlay images.
export type SurfaceTone = 'light' | 'dark' | 'neutral'

export interface SurfaceBackgroundPresentation {
  className: string
  style: CSSProperties
  tone: SurfaceTone
}

// Friendly label + icon per background mode, shared by every drill-in summary
// row (section background + widget background props) so they read identically.
export const surfaceBackgroundModes: Record<string, { label: string, icon: string }> = {
  theme: { label: 'Theme default', icon: 'i-lucide-undo-2' },
  solid: { label: 'Solid colour', icon: 'i-lucide-square' },
  gradient: { label: 'Gradient', icon: 'i-lucide-blend' },
  image: { label: 'Image', icon: 'i-lucide-image' },
  pattern: { label: 'Pattern', icon: 'i-lucide-sparkles' }
}

export function getSurfaceBackgroundMode(background?: SurfaceBackgroundConfig | null) {
  return surfaceBackgroundModes[background?.type ?? 'theme'] ?? surfaceBackgroundModes.theme!
}

export function isThemeSurfaceBackground(background?: SurfaceBackgroundConfig | null) {
  return !background || background.type === 'theme'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

function patternUrl(presetId: string) {
  return pageBackgroundPatterns.find(pattern => pattern.id === presetId)?.url
    ?? pageBackgroundPatterns[0]!.url
}

// Relative luminance of a hex colour → tone. Non-hex inputs (e.g. a CSS
// variable) return `neutral` so we never guess-flip the text colour.
function hexTone(color: string | undefined): SurfaceTone {
  if (!color) return 'neutral'
  let hex = color.trim().replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  if (hex.length !== 6 || /[^0-9a-fA-F]/.test(hex)) return 'neutral'
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 0.5 ? 'dark' : 'light'
}

function averageTone(from?: string, to?: string): SurfaceTone {
  const a = hexTone(from)
  const b = hexTone(to)
  if (a === 'dark' && b === 'dark') return 'dark'
  if (a === 'light' && b === 'light') return 'light'
  // Mixed / unknown → fall back to the "from" colour, else neutral.
  return a !== 'neutral' ? a : b
}

const EMPTY: SurfaceBackgroundPresentation = { className: '', style: {}, tone: 'neutral' }

/**
 * Turn a SurfaceBackgroundConfig into the class + inline style + contrast tone
 * used to paint any surface (section wrapper today, widget cards next). Mirrors
 * getPageBackgroundPresentation but emits generic `tenant-surface*` classes so
 * it can be applied to any element, and reports a `tone` for text contrast.
 */
export function getSurfaceBackgroundPresentation(
  background?: SurfaceBackgroundConfig | null,
  palette?: { background?: string, primary?: string, secondary?: string } | null
): SurfaceBackgroundPresentation {
  if (!background || background.type === 'theme') return EMPTY

  const fallbackBg = palette?.background ?? 'var(--color-bg)'
  const fallbackPrimary = palette?.primary ?? 'var(--color-primary)'

  if (background.type === 'solid') {
    return {
      className: 'tenant-surface',
      style: { background: background.color || fallbackBg },
      tone: hexTone(background.color)
    }
  }

  if (background.type === 'gradient') {
    const angle = clamp(Number(background.angle), 0, 360)
    return {
      className: 'tenant-surface',
      style: {
        background: `linear-gradient(${angle}deg, ${background.from || fallbackBg}, ${background.to || fallbackPrimary})`
      },
      tone: averageTone(background.from, background.to)
    }
  }

  if (background.type === 'image') {
    const opacity = clamp(Number(background.overlayOpacity), 0, 1)
    const overlay = background.overlayTone === 'light'
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`
    const hasImage = Boolean(background.url?.trim())
    const isTile = background.fit === 'tile'
    // Only claim a tone once the overlay is strong enough to dominate the
    // (unknown) image; a faint overlay leaves the theme text colours alone.
    const tone: SurfaceTone = opacity >= 0.35
      ? (background.overlayTone === 'light' ? 'light' : 'dark')
      : 'neutral'

    return {
      className: 'tenant-surface',
      style: {
        backgroundColor: fallbackBg,
        backgroundImage: hasImage ? `linear-gradient(${overlay}, ${overlay}), url("${background.url}")` : undefined,
        backgroundPosition: `center, ${background.position || 'center'}`,
        backgroundRepeat: isTile ? 'no-repeat, repeat' : 'no-repeat, no-repeat',
        backgroundSize: isTile ? '100% 100%, auto' : `100% 100%, ${background.fit}`
      },
      tone
    }
  }

  // pattern
  return {
    className: 'tenant-surface tenant-surface-pattern',
    style: {
      background: background.baseColor || fallbackBg,
      '--tenant-pattern-image': `url("${patternUrl(background.presetId)}")`,
      '--tenant-pattern-color': fallbackPrimary,
      '--tenant-pattern-size': `${clamp(Number(background.scale), 32, 180)}px`,
      '--tenant-pattern-opacity': String(clamp(Number(background.intensity), 0.03, 0.5))
    } as CSSProperties,
    tone: hexTone(background.baseColor)
  }
}

/**
 * Widget-level helper for painting a surface with a SurfaceBackgroundConfig and
 * deriving a contrast-correct colour set (heading/body/muted/hairline/track/bar/
 * panel + button colour). Consumers that already had a bespoke filled-vs-surface
 * scheme (donation-cta, and later about/services/events) swap their hand-rolled
 * computeds for this so every widget reacts identically to theme/solid/gradient/
 * image/pattern backgrounds.
 *
 * `theme` mode reports `isTheme` so the widget can keep painting its OWN default
 * chrome (e.g. a light card) and use the theme text colours. Any other mode
 * yields `presentation.style`/`className` for the fill and flips to a light-text
 * scheme when the fill is dark (or a filled-but-unknown tone, matching hero).
 */
export function useSurfaceBackground(
  background: MaybeRefOrGetter<SurfaceBackgroundConfig | null | undefined>,
  options: { accent?: MaybeRefOrGetter<string> } = {}
) {
  const presentation = computed(() => getSurfaceBackgroundPresentation(toValue(background)))
  const isTheme = computed(() => {
    const bg = toValue(background)
    return !bg || bg.type === 'theme'
  })
  const isFilled = computed(() => !isTheme.value)
  const tone = computed<SurfaceTone>(() => presentation.value.tone)
  // Dark fill → light text; light fill → dark text; a filled-but-neutral tone
  // (e.g. a `var(--color-*)` solid or a faint image overlay) defaults to light,
  // mirroring the hero. Theme mode always keeps the theme text colours.
  const useLightText = computed(() => {
    if (tone.value === 'dark') return true
    if (tone.value === 'light') return false
    return isFilled.value
  })
  const accent = computed(() => toValue(options.accent) ?? 'var(--color-primary)')

  const headingColor = computed(() => useLightText.value ? '#fff' : 'var(--color-text)')
  const bodyColor = computed(() => useLightText.value ? 'rgba(255,255,255,0.9)' : 'var(--color-text)')
  const mutedColor = computed(() => useLightText.value ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)')
  const accentTextColor = computed(() => useLightText.value ? 'var(--color-secondary)' : accent.value)
  const hairlineColor = computed(() => useLightText.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
  const trackColor = computed(() => useLightText.value ? 'rgba(255,255,255,0.2)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
  const barColor = computed(() => useLightText.value ? '#fff' : accent.value)
  const panelStyle = computed<CSSProperties>(() => useLightText.value
    ? { background: 'rgba(255,255,255,0.1)' }
    : { background: `color-mix(in srgb, ${accent.value} 7%, var(--color-surface))`, boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` })
  const buttonColor = computed<'neutral' | 'primary'>(() => useLightText.value ? 'neutral' : 'primary')

  return {
    presentation,
    isTheme,
    isFilled,
    tone,
    useLightText,
    accent,
    headingColor,
    bodyColor,
    mutedColor,
    accentTextColor,
    hairlineColor,
    trackColor,
    barColor,
    panelStyle,
    buttonColor
  }
}
