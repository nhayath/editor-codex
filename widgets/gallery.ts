import type { WidgetDefinition } from '~~/types/widget'

export const galleryWidget: WidgetDefinition = {
  id: 'gallery',
  name: 'Gallery',
  icon: 'i-lucide-images',
  description: 'A grid or masonry gallery of mosque images.',
  category: 'media',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'masonry', name: 'Masonry' }
  ],
  component: 'WidgetGallery',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'Masonry', value: 'masonry' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Gallery' },
    { key: 'imageUrls', label: 'Images', type: 'textarea', default: '/templates/mosque-hero-1.svg\n/templates/mosque-hero-2.svg\n/templates/mosque-hero-3.svg', placeholder: 'One image URL per line' }
  ]
}
