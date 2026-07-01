import type { CSSProperties } from 'vue'
import type { PageBackgroundConfig, SurfaceBackgroundConfig, SurfacePatternOverlay } from '~~/types/template'
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
  },
  {
    id: 'ramadan-crescent-lantern',
    name: 'Ramadan lanterns',
    description: 'Crescent moons and lantern glow',
    url: '/backgrounds/ramadan-crescent-lantern.svg'
  },
  {
    id: 'eid-fitr-stars',
    name: 'Eid al-Fitr stars',
    description: 'Celebratory stars and crescents',
    url: '/backgrounds/eid-fitr-stars.svg'
  },
  {
    id: 'eid-adha-arches',
    name: 'Eid al-Adha arches',
    description: 'Festival arches and gathering motifs',
    url: '/backgrounds/eid-adha-arches.svg'
  },
  {
    id: 'laylat-qadr-night',
    name: 'Laylat al-Qadr night',
    description: 'Night stars with a quiet crescent',
    url: '/backgrounds/laylat-qadr-night.svg'
  },
  {
    id: 'hajj-tawaf-rings',
    name: 'Hajj tawaf rings',
    description: 'Circular movement and unity',
    url: '/backgrounds/hajj-tawaf-rings.svg'
  },
  {
    id: 'jumuah-lines',
    name: 'Jumuah lines',
    description: 'Ordered rows for Friday prayer',
    url: '/backgrounds/jumuah-lines.svg'
  }
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

function patternUrl(presetId: string) {
  return pageBackgroundPatterns.find(pattern => pattern.id === presetId)?.url
    ?? pageBackgroundPatterns[0]!.url
}

// Default overlay used when an admin first switches the pattern layer on.
export function defaultPatternOverlay(): SurfacePatternOverlay {
  return { presetId: pageBackgroundPatterns[0]!.id, scale: 72, intensity: 0.12 }
}

// The pattern layer is painted by a `::before` (see main.css) driven entirely by
// CSS variables, so it composes on top of ANY base fill. `color` falls back to
// the palette primary. Shared by the page + surface renderers so a motif looks
// identical wherever it is layered.
export function buildSurfacePatternVars(
  pattern: SurfacePatternOverlay,
  fallbackColor: string
): CSSProperties {
  return {
    '--tenant-pattern-image': `url("${patternUrl(pattern.presetId)}")`,
    '--tenant-pattern-color': pattern.color || fallbackColor,
    '--tenant-pattern-size': `${clamp(Number(pattern.scale), 32, 180)}px`,
    '--tenant-pattern-opacity': String(clamp(Number(pattern.intensity), 0.03, 0.5))
  } as CSSProperties
}

// Pattern is no longer a standalone background mode — it is an overlay. Migrate
// legacy saved configs (`{ type:'pattern', baseColor, presetId, scale,
// intensity }`) to `{ type:'solid', color: baseColor, pattern:{…} }` so old
// drafts keep rendering. Everything else passes through untouched.
export function migrateSurfaceBackground<T extends SurfaceBackgroundConfig | PageBackgroundConfig | null | undefined>(
  background: T
): T {
  const bg = background as Record<string, unknown> | null | undefined
  if (bg && bg.type === 'pattern') {
    return {
      type: 'solid',
      color: (bg.baseColor as string) || 'var(--color-bg)',
      pattern: {
        presetId: bg.presetId as string,
        scale: Number(bg.scale),
        intensity: Number(bg.intensity)
      }
    } as unknown as T
  }
  return background
}

export function getPageBackgroundPresentation(
  background?: PageBackgroundConfig | null,
  paletteId?: string,
  customColors?: Record<string, string> | null
) {
  const bg = migrateSurfaceBackground(background)
  const palette = { ...getPalette(paletteId), ...(customColors ?? {}) }

  // ----- Base fill (theme/default = none) -----
  let className = ''
  let style: CSSProperties = {}

  if (bg && bg.type === 'solid') {
    className = 'tenant-page-background'
    style = { background: bg.color || palette.background }
  } else if (bg && bg.type === 'gradient') {
    const angle = clamp(Number(bg.angle), 0, 360)
    className = 'tenant-page-background'
    style = { background: `linear-gradient(${angle}deg, ${bg.from || palette.background}, ${bg.to || palette.primary})` }
  } else if (bg && bg.type === 'image') {
    const opacity = clamp(Number(bg.overlayOpacity), 0, 1)
    const overlay = bg.overlayTone === 'light'
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`
    const hasImage = Boolean(bg.url?.trim())
    const isTile = bg.fit === 'tile'
    className = 'tenant-page-background'
    style = {
      backgroundColor: palette.background,
      backgroundImage: hasImage ? `linear-gradient(${overlay}, ${overlay}), url("${bg.url}")` : undefined,
      backgroundPosition: `center, ${bg.position || 'center'}`,
      backgroundRepeat: isTile ? 'no-repeat, repeat' : 'no-repeat, no-repeat',
      backgroundSize: isTile ? '100% 100%, auto' : `100% 100%, ${bg.fit}`
    }
  }

  // ----- Optional pattern overlay (layers on ANY base, incl. theme) -----
  if (bg?.pattern) {
    // The base class supplies the positioning context the ::before needs, so
    // ensure it is present even when the base fill itself is theme/default.
    className = 'tenant-page-background tenant-page-background-pattern'
    style = { ...style, ...buildSurfacePatternVars(bg.pattern, palette.primary) }
  }

  return { className, style }
}
