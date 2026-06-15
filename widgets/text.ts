import type { WidgetDefinition } from '~~/types/widget'

export const textWidget: WidgetDefinition = {
  id: 'text',
  name: 'Text Block',
  icon: 'i-lucide-type',
  description: 'Plain title and body copy.',
  category: 'content',
  component: 'WidgetText',
  propSchema: [
    { key: 'title', label: 'Title', type: 'text', default: 'Text block' },
    { key: 'body', label: 'Body', type: 'textarea', default: 'Add a focused message for visitors.' },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] }
  ]
}
