import type { WidgetDefinition } from '~~/types/widget'

export const announcementsWidget: WidgetDefinition = {
  id: 'announcements',
  name: 'Announcements',
  icon: 'i-lucide-megaphone',
  description: 'Pinned and recent mosque announcements.',
  category: 'engagement',
  variants: [
    { id: 'list', name: 'List' },
    { id: 'cards', name: 'Cards' }
  ],
  component: 'WidgetAnnouncements',
  dataDependencies: ['announcements'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'cards', options: [
      { label: 'List', value: 'list' },
      { label: 'Cards', value: 'cards' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Announcements' },
    { key: 'maxItems', label: 'Maximum items', type: 'number', default: 3, span: 'half' },
    { key: 'showPinnedOnly', label: 'Pinned only', type: 'toggle', default: false, span: 'half' }
  ]
}
