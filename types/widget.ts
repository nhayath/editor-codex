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
  | 'images'
  | 'slides'
  | 'url'
  | 'icon'

export interface WidgetVariant {
  id: string
  name: string
}

export interface WidgetShowWhen {
  key: string
  value: unknown | unknown[]
}

export interface WidgetPropSchema {
  key: string
  label: string
  type: WidgetPropType
  group?: string
  groupDefaultOpen?: boolean
  span?: 'full' | 'half'
  default?: unknown
  required?: boolean
  options?: { label: string; value: unknown }[]
  showWhen?: WidgetShowWhen | WidgetShowWhen[]
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
