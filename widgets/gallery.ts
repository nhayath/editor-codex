import type { WidgetDefinition } from '~~/types/widget'

export const galleryWidget: WidgetDefinition = {
  id: 'gallery',
  name: 'Gallery',
  icon: 'i-lucide-images',
  description: 'A grid or masonry gallery of mosque images.',
  category: 'media',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'masonry', name: 'Masonry' },
    { id: 'mosaic', name: 'Mosaic' },
    { id: 'featured', name: 'Featured' },
    { id: 'filmstrip', name: 'Filmstrip' }
  ],
  component: 'WidgetGallery',
  propSchema: [
    { key: 'imageUrls', label: 'Images', type: 'images', default: '/templates/mosque-hero-1.svg\n/templates/mosque-hero-2.svg\n/templates/mosque-hero-3.svg' },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Moments', span: 'half' },
    { key: 'title', label: 'Title', type: 'text', default: 'Gallery', span: 'half' },
    { key: 'intro', label: 'Intro', type: 'textarea', default: '' },

    { key: 'variant', label: 'Gallery style', type: 'select', group: 'Style', groupDefaultOpen: false, default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'Masonry', value: 'masonry' },
      { label: 'Mosaic', value: 'mosaic' },
      { label: 'Featured', value: 'featured' },
      { label: 'Filmstrip', value: 'filmstrip' }
    ] },

    { key: 'accent', label: 'Accent', type: 'select', group: 'Display', groupDefaultOpen: false, span: 'half', default: 'primary', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'align', label: 'Header alignment', type: 'select', group: 'Display', span: 'half', default: 'left', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'columns', label: 'Columns', type: 'select', group: 'Display', span: 'half', default: '3', options: [
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' }
    ], showWhen: { key: 'variant', value: ['grid', 'masonry'] } },
    { key: 'imageRatio', label: 'Image ratio', type: 'select', group: 'Display', span: 'half', default: 'landscape', options: [
      { label: 'Landscape', value: 'landscape' },
      { label: 'Square', value: 'square' },
      { label: 'Portrait', value: 'portrait' }
    ], showWhen: { key: 'variant', value: ['grid', 'masonry', 'filmstrip'] } },
    { key: 'showCaptions', label: 'Show captions', type: 'toggle', group: 'Display', span: 'half', default: false },
    { key: 'showLightbox', label: 'Enable lightbox', type: 'toggle', group: 'Display', span: 'half', default: true }
  ]
}
