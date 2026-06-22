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
    { key: 'imageUrl', label: 'Image', type: 'image', default: '', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    { key: 'primaryLabel', label: 'Primary button', type: 'text', default: 'View prayer times', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    { key: 'primaryUrl', label: 'Primary URL', type: 'url', default: '#prayer-times', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    { key: 'secondaryLabel', label: 'Secondary button', type: 'text', default: 'Upcoming events', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    { key: 'secondaryUrl', label: 'Secondary URL', type: 'url', default: '#events', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    { key: 'align', label: 'Text alignment', type: 'select', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'background', label: 'Background style', type: 'select', default: 'plain', options: [
      { label: 'Plain', value: 'plain' },
      { label: 'Solid colour', value: 'solid' },
      { label: 'Gradient', value: 'gradient' },
      { label: 'Image', value: 'image' }
    ], showWhen: { key: 'variant', value: ['simple', 'with-image', 'with-buttons', 'split'] } },
    { key: 'bgColor', label: 'Background colour', type: 'color', default: '#0f766e', showWhen: { key: 'background', value: 'solid' } },
    { key: 'gradientFrom', label: 'Gradient start', type: 'color', default: '#0f766e', showWhen: { key: 'background', value: 'gradient' } },
    { key: 'gradientTo', label: 'Gradient end', type: 'color', default: '#134e4a', showWhen: { key: 'background', value: 'gradient' } },
    { key: 'overlay', label: 'Darken image for readable text', type: 'toggle', default: true, showWhen: { key: 'background', value: 'image' } },
    { key: 'overlayOpacity', label: 'Darkness (0-100)', type: 'number', default: 50, showWhen: { key: 'background', value: 'image' } },
    { key: 'textTone', label: 'Text colour', type: 'select', default: 'light', options: [
      { label: 'Light text', value: 'light' },
      { label: 'Dark text', value: 'dark' }
    ], showWhen: { key: 'background', value: ['solid', 'gradient', 'image'] } }
  ]
}
