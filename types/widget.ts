export type WidgetCategory = 'content' | 'engagement' | 'media' | 'data'

export type WidgetPropType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'toggle'
  | 'select'
  | 'color'
  | 'image'
  | 'url'
  | 'icon'

export interface WidgetVariant {
  id: string
  name: string
}

export interface WidgetPropSchema {
  key: string
  label: string
  type: WidgetPropType
  group?: string
  default?: unknown
  required?: boolean
  options?: { label: string; value: unknown }[]
  showWhen?: { key: string; value: unknown | unknown[] }
  placeholder?: string
}

export interface WidgetDefinition {
  id: string
  name: string
  icon: string
  description: string
  category: WidgetCategory
  variants?: WidgetVariant[]
  propSchema: WidgetPropSchema[]
  dataDependencies?: string[]
  component: string
}
