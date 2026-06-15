import { colorPalettes, fontPairs } from '~~/types/theme'
import type { ColorPalette, FontPair } from '~~/types/theme'

export function getPalette(paletteId?: string): ColorPalette {
  return colorPalettes.find(palette => palette.id === paletteId) ?? colorPalettes[0]!
}

export function getFontPair(fontPairId?: string): FontPair {
  return fontPairs.find(pair => pair.id === fontPairId) ?? fontPairs[0]!
}

export function getThemeStyle(paletteId?: string, fontPairId?: string, customColors?: Record<string, string> | null) {
  const palette = getPalette(paletteId)
  const fonts = getFontPair(fontPairId)
  const colors = { ...palette, ...(customColors ?? {}) }

  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-bg': colors.background,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-text-muted': colors.textMuted,
    '--font-heading': `"${fonts.heading}", serif`,
    '--font-body': `"${fonts.body}", system-ui, sans-serif`
  }
}

export function useTheme(paletteId: MaybeRef<string | undefined>, fontPairId: MaybeRef<string | undefined>, customColors?: MaybeRef<Record<string, string> | null | undefined>) {
  const style = computed(() => getThemeStyle(toValue(paletteId), toValue(fontPairId), toValue(customColors)))
  const fonts = computed(() => getFontPair(toValue(fontPairId)))

  useHead(() => {
    const family = [fonts.value.heading, fonts.value.body]
      .filter(Boolean)
      .map(font => `family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700`)
      .join('&')

    return {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${family}&display=swap` }
      ]
    }
  })

  watchEffect(() => {
    if (!import.meta.client) return

    for (const [key, value] of Object.entries(style.value)) {
      document.documentElement.style.setProperty(key, value)
    }
  })

  return {
    style,
    palette: computed(() => getPalette(toValue(paletteId))),
    fonts
  }
}
