import type { WidgetDefinition, WidgetPropSchema } from './widget'

export type TemplateWidgetOverride = Partial<Omit<WidgetDefinition, 'id'>>

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  thumbnail: string
  defaultPaletteId?: string
  defaultFontPairId?: string
  widgets?: Record<string, TemplateWidgetOverride>
  sections: TemplateSectionDef[]
  header: { component: string, props: Record<string, unknown> }
  footer: { component: string, props: Record<string, unknown> }
  dataDependencies: string[]
}

export interface TemplateSectionDef {
  id: string
  title?: string
  type: 'single' | 'group'
  required: boolean
  removable: boolean
  widgetId?: string
  defaultProps?: Record<string, unknown>
  group?: SectionGroupDef
}

export interface SectionGroupDef {
  layout: 'row' | 'stack'
  widgets: GroupWidgetDef[]
  groupProps?: GroupPropSchema[]
}

export interface GroupWidgetDef {
  widgetId: string
  defaultProps?: Record<string, unknown>
  slot: string
}

export interface GroupPropSchema {
  key: string
  label: string
  type: 'select' | 'toggle' | 'text'
  options?: { label: string, value: string }[]
  default: unknown
}

export interface HomepageConfigDraft {
  templateId: string
  paletteId: string
  fontPairId: string
  customColors?: Record<string, string> | null
  pageBackground?: PageBackgroundConfig | null
  sectionOrder: string[]
  sectionsEnabled: Record<string, boolean>
  sectionOverrides: Record<string, SectionOverride>
  // Page-level chrome, edited in the Settings tab (not a section). Renders as a
  // sticky bar above the header when enabled.
  announcementBar?: AnnouncementBarConfig | null
}

export type PageBackgroundConfig =
  | {
      type: 'solid'
      color: string
    }
  | {
      type: 'gradient'
      from: string
      to: string
      angle: number
    }
  | {
      type: 'image'
      url: string
      fit: 'cover' | 'contain' | 'tile'
      position: 'center' | 'top' | 'bottom' | 'left' | 'right'
      overlayTone: 'dark' | 'light'
      overlayOpacity: number
    }
  | {
      type: 'pattern'
      presetId: string
      baseColor: string
      scale: number
      intensity: number
    }

export interface AnnouncementBarConfig {
  enabled: boolean
  props: Record<string, unknown>
}

export interface SectionOverride {
  customWidgetId?: string
  customTitle?: string
  props?: Record<string, unknown>
  groupProps?: Record<string, unknown>
  widgets?: Record<string, { props?: Record<string, unknown> }>
}

export interface ResolvedWidget {
  slot: string
  widgetId: string
  name?: string
  icon?: string
  component?: string
  propSchema?: WidgetPropSchema[]
  resolvedProps: Record<string, unknown>
}

export interface ResolvedSection {
  id: string
  title?: string
  type: 'single' | 'group'
  required: boolean
  removable: boolean
  enabled: boolean
  widgetId?: string
  name?: string
  icon?: string
  component?: string
  resolvedProps?: Record<string, unknown>
  resolvedGroupProps?: Record<string, unknown>
  resolvedWidgets?: ResolvedWidget[]
  propSchema?: WidgetPropSchema[]
  groupPropSchema?: GroupPropSchema[]
}
