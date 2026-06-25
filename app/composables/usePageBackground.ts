import type { CSSProperties } from 'vue'
import type { PageBackgroundConfig } from '~~/types/template'
import { getPalette } from '~/composables/useTheme'

export interface PageBackgroundPattern {
  id: string
  name: string
  description: string
  url: string
}

export const pageBackgroundPatterns: PageBackgroundPattern[] = [
  {
    id: 'eight-point-star',
    name: 'Eight-point stars',
    description: 'A classic star lattice',
    url: '/backgrounds/eight-point-star.svg'
  },
  {
    id: 'girih-diamonds',
    name: 'Girih diamonds',
    description: 'Interlocking geometric lines',
    url: '/backgrounds/girih-diamonds.svg'
  },
  {
    id: 'arabesque-vines',
    name: 'Arabesque vines',
    description: 'Flowing botanical scrollwork',
    url: '/backgrounds/arabesque-vines.svg'
  },
  {
    id: 'rosette-bloom',
    name: 'Rosette bloom',
    description: 'Layered floral medallions',
    url: '/backgrounds/rosette-bloom.svg'
  },
  {
    id: 'palm-leaf-fan',
    name: 'Palm-leaf fan',
    description: 'Soft repeating palm forms',
    url: '/backgrounds/palm-leaf-fan.svg'
  },
  {
    id: 'mihrab-arches',
    name: 'Mihrab arches',
    description: 'A calm architectural rhythm',
    url: '/backgrounds/mihrab-arches.svg'
  }
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

function patternUrl(presetId: string) {
  return pageBackgroundPatterns.find(pattern => pattern.id === presetId)?.url
    ?? pageBackgroundPatterns[0]!.url
}

export function getPageBackgroundPresentation(
  background?: PageBackgroundConfig | null,
  paletteId?: string,
  customColors?: Record<string, string> | null
) {
  if (!background) {
    return {
      className: '',
      style: {} as CSSProperties
    }
  }

  const palette = { ...getPalette(paletteId), ...(customColors ?? {}) }

  if (background.type === 'solid') {
    return {
      className: 'tenant-page-background',
      style: {
        background: background.color || palette.background
      } satisfies CSSProperties
    }
  }

  if (background.type === 'gradient') {
    const angle = clamp(Number(background.angle), 0, 360)
    return {
      className: 'tenant-page-background',
      style: {
        background: `linear-gradient(${angle}deg, ${background.from || palette.background}, ${background.to || palette.primary})`
      } satisfies CSSProperties
    }
  }

  if (background.type === 'image') {
    const opacity = clamp(Number(background.overlayOpacity), 0, 1)
    const overlay = background.overlayTone === 'light'
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`
    const hasImage = Boolean(background.url?.trim())
    const isTile = background.fit === 'tile'

    return {
      className: 'tenant-page-background',
      style: {
        backgroundColor: palette.background,
        backgroundImage: hasImage ? `linear-gradient(${overlay}, ${overlay}), url("${background.url}")` : undefined,
        backgroundPosition: `center, ${background.position || 'center'}`,
        backgroundRepeat: isTile ? 'no-repeat, repeat' : 'no-repeat, no-repeat',
        backgroundSize: isTile ? '100% 100%, auto' : `100% 100%, ${background.fit}`
      } satisfies CSSProperties
    }
  }

  const patternStyle = {
    background: background.baseColor || palette.background,
    '--tenant-pattern-image': `url("${patternUrl(background.presetId)}")`,
    '--tenant-pattern-color': palette.primary,
    '--tenant-pattern-size': `${clamp(Number(background.scale), 32, 180)}px`,
    '--tenant-pattern-opacity': String(clamp(Number(background.intensity), 0.03, 0.5))
  } as CSSProperties

  return {
    className: 'tenant-page-background tenant-page-background-pattern',
    style: patternStyle
  }
}
