import type { WidgetDefinition } from '~~/types/widget'

export const imageWidget: WidgetDefinition = {
  id: 'image',
  name: 'Image',
  icon: 'i-lucide-image',
  description: 'Single image with alt text and optional caption.',
  category: 'media',
  component: 'WidgetImage',
  propSchema: [
    { key: 'imageUrl', label: 'Image', type: 'image', default: '/templates/mosque-hero-1.svg' },
    { key: 'alt', label: 'Alt text', type: 'text', default: 'Mosque image' },
    { key: 'caption', label: 'Caption', type: 'text', default: '' }
  ]
}
