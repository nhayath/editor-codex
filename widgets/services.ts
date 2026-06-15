import type { WidgetDefinition } from '~~/types/widget'

export const servicesWidget: WidgetDefinition = {
  id: 'services',
  name: 'Services',
  icon: 'i-lucide-sparkles',
  description: 'Core mosque services and community programmes.',
  category: 'content',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' }
  ],
  component: 'WidgetServices',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'List', value: 'list' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Services' },
    { key: 'items', label: 'Items', type: 'textarea', default: 'Daily prayers|Congregational salah throughout the day|i-lucide-clock-3\nEducation|Quran and Islamic studies for all ages|i-lucide-book-open\nCommunity care|Support for families and neighbours|i-lucide-heart-handshake', placeholder: 'Title|Description|Icon, one item per line' }
  ]
}
