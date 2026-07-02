import type { WidgetDefinition } from '~~/types/widget'

export const eventsWidget: WidgetDefinition = {
  id: 'events',
  name: 'Events',
  icon: 'i-lucide-calendar-days',
  description: 'Upcoming programmes, classes, and community gatherings.',
  category: 'engagement',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' },
    { id: 'cards', name: 'Image cards' },
    { id: 'feature', name: 'Feature' },
    { id: 'agenda', name: 'Agenda' }
  ],
  component: 'WidgetEvents',
  dataDependencies: ['events'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'List', value: 'list' },
      { label: 'Image cards', value: 'cards' },
      { label: 'Feature', value: 'feature' },
      { label: 'Agenda', value: 'agenda' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Programmes', span: 'half' },
    { key: 'title', label: 'Title', type: 'text', default: 'Upcoming events', span: 'half' },
    { key: 'maxItems', label: 'Maximum items', type: 'number', default: 3 },

    { key: 'accent', label: 'Accent', type: 'select', group: 'Display', span: 'half', default: 'primary', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'columns', label: 'Columns', type: 'select', group: 'Display', span: 'half', default: '3', options: [
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' }
    ], showWhen: { key: 'variant', value: ['grid', 'cards', 'feature'] } },
    { key: 'align', label: 'Header alignment', type: 'select', group: 'Display', span: 'half', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'imageRatio', label: 'Image ratio', type: 'select', group: 'Display', span: 'half', default: 'landscape', options: [
      { label: 'Landscape', value: 'landscape' },
      { label: 'Square', value: 'square' },
      { label: 'Portrait', value: 'portrait' }
    ], showWhen: { key: 'variant', value: ['cards', 'feature', 'agenda'] } },
    { key: 'showImage', label: 'Show images', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showCategory', label: 'Show category', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showDate', label: 'Show date', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showLocation', label: 'Show location', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showDescription', label: 'Show descriptions', type: 'toggle', group: 'Display', span: 'half', default: true }
  ]
}
