import type { WidgetDefinition } from '~~/types/widget'

export const servicesWidget: WidgetDefinition = {
  id: 'services',
  name: 'Services',
  icon: 'i-lucide-sparkles',
  description: 'Core mosque services and community programmes.',
  category: 'content',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' },
    { id: 'cards', name: 'Image cards' },
    { id: 'feature', name: 'Feature' },
    { id: 'overlay', name: 'Overlay' }
  ],
  component: 'WidgetServices',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'List', value: 'list' },
      { label: 'Image cards', value: 'cards' },
      { label: 'Feature', value: 'feature' },
      { label: 'Overlay', value: 'overlay' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'What we offer', span: 'half' },
    { key: 'title', label: 'Title', type: 'text', default: 'Services', span: 'half' },
    { key: 'items', label: 'Items', type: 'textarea', default: 'Daily prayers|Congregational salah throughout the day|i-lucide-clock-3\nEducation|Quran and Islamic studies for all ages|i-lucide-book-open\nCommunity care|Support for families and neighbours|i-lucide-heart-handshake', placeholder: 'Title|Description|Icon|Image URL|Link, one item per line' },

    { key: 'accent', label: 'Accent', type: 'select', group: 'Display', span: 'half', default: 'primary', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'columns', label: 'Columns', type: 'select', group: 'Display', span: 'half', default: '3', options: [
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' }
    ], showWhen: { key: 'variant', value: ['grid', 'cards', 'feature', 'overlay'] } },
    { key: 'align', label: 'Header alignment', type: 'select', group: 'Display', span: 'half', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'imageRatio', label: 'Image ratio', type: 'select', group: 'Display', span: 'half', default: 'landscape', options: [
      { label: 'Landscape', value: 'landscape' },
      { label: 'Square', value: 'square' },
      { label: 'Portrait', value: 'portrait' }
    ], showWhen: { key: 'variant', value: ['cards', 'feature', 'overlay'] } },
    { key: 'showImage', label: 'Show images', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showIcon', label: 'Show icons', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showDescription', label: 'Show descriptions', type: 'toggle', group: 'Display', span: 'half', default: true },
    { key: 'showCta', label: 'Show "Learn more" link', type: 'toggle', group: 'Display', span: 'half', default: false },

    // Unified background picker (theme / solid / gradient / image + darken /
    // pattern). Theme keeps the legacy transparent section; any fill flips text
    // contrast automatically. Renders as a standalone drill-in row.
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } }
  ]
}
