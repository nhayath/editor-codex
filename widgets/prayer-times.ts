import type { WidgetDefinition } from '~~/types/widget'

export const prayerTimesWidget: WidgetDefinition = {
  id: 'prayer-times',
  name: 'Prayer Times',
  icon: 'i-lucide-clock-3',
  description: 'Daily salah timetable with optional iqamah times.',
  category: 'data',
  variants: [
    { id: 'table', name: 'Table' },
    { id: 'cards', name: 'Cards' },
    { id: 'compact', name: 'Compact' }
  ],
  component: 'WidgetPrayerTimes',
  dataDependencies: ['prayerTimes'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'cards', options: [
      { label: 'Table', value: 'table' },
      { label: 'Cards', value: 'cards' },
      { label: 'Compact', value: 'compact' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Today Prayer Times' },
    { key: 'showIqamah', label: 'Show iqamah', type: 'toggle', default: true, span: 'half' },
    { key: 'showSunrise', label: 'Show sunrise', type: 'toggle', default: true, span: 'half' }
  ]
}
