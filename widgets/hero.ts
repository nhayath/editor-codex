import type { WidgetDefinition } from '~~/types/widget'

export const heroWidget: WidgetDefinition = {
  id: 'hero',
  name: 'Hero Banner',
  icon: 'i-lucide-panels-top-left',
  description: 'Prominent homepage introduction with optional image and actions.',
  category: 'content',
  variants: [
    { id: 'simple', name: 'Simple' },
    { id: 'with-image', name: 'With image' },
    { id: 'with-buttons', name: 'With buttons' },
    { id: 'split', name: 'Split' },
    { id: 'immersive', name: 'Immersive' }
  ],
  component: 'WidgetHero',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'with-buttons', options: [
      { label: 'Simple', value: 'simple' },
      { label: 'With image', value: 'with-image' },
      { label: 'With buttons', value: 'with-buttons' },
      { label: 'Split', value: 'split' },
      { label: 'Immersive', value: 'immersive' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Welcome to' },
    { key: 'title', label: 'Title', type: 'text', default: 'Al-Noor Mosque' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'A welcoming place for prayer, learning, and community.' },
    { key: 'imageUrl', label: 'Image', type: 'image', default: '' },
    { key: 'primaryLabel', label: 'Primary button', type: 'text', default: 'View prayer times' },
    { key: 'primaryUrl', label: 'Primary URL', type: 'url', default: '#prayer-times' },
    { key: 'secondaryLabel', label: 'Secondary button', type: 'text', default: 'Upcoming events' },
    { key: 'secondaryUrl', label: 'Secondary URL', type: 'url', default: '#events' },
    { key: 'align', label: 'Text alignment', type: 'select', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] }
  ]
}
