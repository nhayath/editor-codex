import type { WidgetDefinition } from '~~/types/widget'

export const aboutMosqueWidget: WidgetDefinition = {
  id: 'about-mosque',
  name: 'About Mosque',
  icon: 'i-lucide-landmark',
  description: 'A short introduction to the mosque and its mission.',
  category: 'content',
  variants: [
    { id: 'split', name: 'Split' },
    { id: 'stacked', name: 'Stacked' },
    { id: 'overlay', name: 'Overlay' },
    { id: 'statement', name: 'Statement' },
    { id: 'feature', name: 'Feature' }
  ],
  component: 'WidgetAboutMosque',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'split', options: [
      { label: 'Split', value: 'split' },
      { label: 'Stacked', value: 'stacked' },
      { label: 'Overlay', value: 'overlay' },
      { label: 'Statement', value: 'statement' },
      { label: 'Feature', value: 'feature' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'About', span: 'half' },
    { key: 'title', label: 'Title', type: 'text', default: 'About our mosque', span: 'half' },
    { key: 'body', label: 'Body', type: 'richtext', default: '<p>Our mosque is a place of worship, learning, service, and community belonging.</p>' },
    { key: 'imageUrl', label: 'Image', type: 'image', default: '' },
    { key: 'imagePosition', label: 'Image position', type: 'select', default: 'right', options: [
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' }
    ], showWhen: { key: 'variant', value: ['split', 'feature'] } },

    { key: 'accent', label: 'Accent', type: 'select', group: 'Display', span: 'half', default: 'primary', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'align', label: 'Header alignment', type: 'select', group: 'Display', span: 'half', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'imageRatio', label: 'Image ratio', type: 'select', group: 'Display', span: 'half', default: 'landscape', options: [
      { label: 'Landscape', value: 'landscape' },
      { label: 'Square', value: 'square' },
      { label: 'Portrait', value: 'portrait' }
    ], showWhen: { key: 'variant', value: ['split', 'stacked', 'overlay', 'feature'] } },
    { key: 'showImage', label: 'Show image', type: 'toggle', group: 'Display', span: 'half', default: true, showWhen: { key: 'variant', value: ['split', 'stacked', 'overlay', 'feature'] } },

    { key: 'showStats', label: 'Show highlight stats', type: 'toggle', group: 'Highlights', span: 'half', default: false },
    { key: 'stats', label: 'Stats', type: 'textarea', group: 'Highlights', default: 'Est. 1995|Serving since\n500+|Families\n5|Daily prayers', placeholder: 'Value|Label, one per line', showWhen: { key: 'showStats', value: true } },
    { key: 'ctaLabel', label: 'Button label', type: 'text', group: 'Highlights', span: 'half', default: '' },
    { key: 'ctaUrl', label: 'Button link', type: 'url', group: 'Highlights', span: 'half', default: '' },

    // Unified background picker (theme / solid / gradient / image + darken /
    // pattern). Theme keeps the legacy transparent section; any fill flips text
    // contrast automatically. Renders as a standalone drill-in row.
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } }
  ]
}
