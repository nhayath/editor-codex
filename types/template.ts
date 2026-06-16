import type { WidgetPropSchema } from './widget'

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  thumbnail: string
  defaultPaletteId?: string
  defaultFontPairId?: string
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
  sectionOrder: string[]
  sectionsEnabled: Record<string, boolean>
  sectionOverrides: Record<string, SectionOverride>
}

export interface SectionOverride {
  props?: Record<string, unknown>
  groupProps?: Record<string, unknown>
  widgets?: Record<string, { props?: Record<string, unknown> }>
}

export interface ResolvedWidget {
  slot: string
  widgetId: string
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
  resolvedProps?: Record<string, unknown>
  resolvedGroupProps?: Record<string, unknown>
  resolvedWidgets?: ResolvedWidget[]
  propSchema?: WidgetPropSchema[]
  groupPropSchema?: GroupPropSchema[]
}
