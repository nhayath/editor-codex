import type { WidgetDefinition } from '~~/types/widget'

export const eventsWidget: WidgetDefinition = {
  id: 'events',
  name: 'Events',
  icon: 'i-lucide-calendar-days',
  description: 'Upcoming programmes, classes, and community gatherings.',
  category: 'engagement',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' }
  ],
  component: 'WidgetEvents',
  dataDependencies: ['events'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'List', value: 'list' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Upcoming events' },
    { key: 'maxItems', label: 'Maximum items', type: 'number', default: 3 }
  ]
}
