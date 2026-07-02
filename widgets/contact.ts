import type { WidgetDefinition } from '~~/types/widget'

export const contactWidget: WidgetDefinition = {
  id: 'contact',
  name: 'Contact',
  icon: 'i-lucide-mail',
  description: 'Contact details and a simple contact block.',
  category: 'content',
  variants: [
    { id: 'split', name: 'Split' },
    { id: 'cards', name: 'Cards' },
    { id: 'feature', name: 'Feature' },
    { id: 'compact', name: 'Compact' },
    { id: 'directory', name: 'Directory' }
  ],
  component: 'WidgetContact',
  dataDependencies: ['settings'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'split', options: [
      { label: 'Split', value: 'split' },
      { label: 'Cards', value: 'cards' },
      { label: 'Feature', value: 'feature' },
      { label: 'Compact', value: 'compact' },
      { label: 'Directory', value: 'directory' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Contact', span: 'half' },
    { key: 'title', label: 'Title', type: 'text', default: 'Contact us', span: 'half' },
    { key: 'intro', label: 'Intro', type: 'textarea', default: 'Get in touch with the mosque office.' },

    { key: 'accent', label: 'Accent', type: 'select', group: 'Display', span: 'half', default: 'primary', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'align', label: 'Header alignment', type: 'select', group: 'Display', span: 'half', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'showIcons', label: 'Show icons', type: 'toggle', group: 'Display', span: 'half', default: true },

    { key: 'showAddress', label: 'Show address', type: 'toggle', group: 'Visibility', span: 'half', default: true },
    { key: 'showPhone', label: 'Show phone', type: 'toggle', group: 'Visibility', span: 'half', default: true },
    { key: 'showEmail', label: 'Show email', type: 'toggle', group: 'Visibility', span: 'half', default: true },
    { key: 'showSocials', label: 'Show social links', type: 'toggle', group: 'Visibility', span: 'half', default: true },
    { key: 'showDirections', label: 'Show directions action', type: 'toggle', group: 'Visibility', span: 'half', default: false }
  ]
}
