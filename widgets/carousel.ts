import type { WidgetDefinition } from '~~/types/widget'

export const carouselWidget: WidgetDefinition = {
  id: 'carousel',
  name: 'Carousel',
  icon: 'i-lucide-gallery-horizontal',
  description: 'Image-led carousel for announcements, campaigns, or featured content.',
  category: 'media',
  variants: [
    { id: 'single-slide', name: 'Single slide' },
    { id: 'multi-slide', name: 'Multi slide' }
  ],
  component: 'WidgetCarousel',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'single-slide', options: [
      { label: 'Single slide', value: 'single-slide' },
      { label: 'Multi slide', value: 'multi-slide' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Community highlights' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Stay connected with the latest from your mosque.' },
    { key: 'slides', label: 'Slides', type: 'textarea', default: 'Daily prayers|Join us for congregational prayer|/templates/mosque-hero-1.svg\nWeekend classes|Learning for every age|/templates/mosque-hero-2.svg\nCommunity support|Serving neighbours with care|/templates/mosque-hero-3.svg', placeholder: 'Title|Subtitle|Image URL, one slide per line' },
    { key: 'autoplay', label: 'Autoplay', type: 'toggle', default: true }
  ]
}
