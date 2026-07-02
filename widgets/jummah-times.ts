import type { WidgetDefinition } from '~~/types/widget'

export const jummahTimesWidget: WidgetDefinition = {
  id: 'jummah-times',
  name: "Jumu'ah Times",
  icon: 'i-lucide-calendar-clock',
  description: "Friday prayer schedule, labels, and locations.",
  category: 'data',
  variants: [
    { id: 'card', name: 'Cards' },
    { id: 'list', name: 'List' },
    { id: 'feature', name: 'Feature' },
    { id: 'timeline', name: 'Timeline' }
  ],
  component: 'WidgetJummahTimes',
  dataDependencies: ['jummahTimes'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'card', options: [
      { label: 'Cards', value: 'card' },
      { label: 'List', value: 'list' },
      { label: 'Feature', value: 'feature' },
      { label: 'Timeline', value: 'timeline' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: "Jumu'ah prayers" },
    { key: 'subtitle', label: 'Subtitle', type: 'text', default: '' },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'showIcon', label: 'Show icon', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showLabel', label: 'Show labels', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showLocation', label: 'Show location', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'highlightNext', label: 'Highlight next (Fridays)', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'countdown', label: 'Show countdown', type: 'toggle', default: false, group: 'Display', span: 'half' }
  ]
}
