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
    { id: 'compact', name: 'Compact' },
    { id: 'strip', name: 'Strip' }
  ],
  component: 'WidgetPrayerTimes',
  dataDependencies: ['prayerTimes'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'cards', options: [
      { label: 'Table', value: 'table' },
      { label: 'Cards', value: 'cards' },
      { label: 'Compact', value: 'compact' },
      { label: 'Strip', value: 'strip' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Today Prayer Times' },
    { key: 'scheduleLabel', label: 'Schedule link label', type: 'text', default: 'Full schedule', group: 'Strip link', showWhen: { key: 'variant', value: 'strip' } },
    { key: 'scheduleHref', label: 'Schedule link target', type: 'text', default: '#prayer-overview', group: 'Strip link', showWhen: { key: 'variant', value: 'strip' } },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', span: 'half', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'showIcons', label: 'Show icons', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'highlightNext', label: 'Highlight next prayer', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showIqamah', label: 'Show iqamah', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showSunrise', label: 'Show sunrise', type: 'toggle', default: true, group: 'Display', span: 'half' }
  ]
}
