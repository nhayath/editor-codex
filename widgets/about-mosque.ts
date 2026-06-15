import type { WidgetDefinition } from '~~/types/widget'

export const aboutMosqueWidget: WidgetDefinition = {
  id: 'about-mosque',
  name: 'About Mosque',
  icon: 'i-lucide-landmark',
  description: 'A short introduction to the mosque and its mission.',
  category: 'content',
  component: 'WidgetAboutMosque',
  propSchema: [
    { key: 'title', label: 'Title', type: 'text', default: 'About our mosque' },
    { key: 'body', label: 'Body', type: 'richtext', default: '<p>Our mosque is a place of worship, learning, service, and community belonging.</p>' },
    { key: 'imageUrl', label: 'Image', type: 'image', default: '' },
    { key: 'imagePosition', label: 'Image position', type: 'select', default: 'right', options: [
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' }
    ] }
  ]
}
