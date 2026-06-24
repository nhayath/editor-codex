import type { WidgetDefinition } from '~~/types/widget'

export const carouselWidget: WidgetDefinition = {
  id: 'carousel',
  name: 'Carousel',
  icon: 'i-lucide-gallery-horizontal',
  description: 'Image-led carousel for announcements, campaigns, or featured content.',
  category: 'media',
  variants: [
    { id: 'single-slide', name: 'Hero slide' },
    { id: 'multi-slide', name: 'Multi slide' },
    { id: 'cards', name: 'Cards' },
    { id: 'split', name: 'Split' },
    { id: 'minimal', name: 'Minimal' }
  ],
  component: 'WidgetCarousel',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'single-slide', options: [
      { label: 'Hero slide', value: 'single-slide' },
      { label: 'Multi slide', value: 'multi-slide' },
      { label: 'Cards', value: 'cards' },
      { label: 'Split', value: 'split' },
      { label: 'Minimal', value: 'minimal' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Featured' },
    { key: 'title', label: 'Title', type: 'text', default: 'Community highlights' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Stay connected with the latest from your mosque.' },
    { key: 'slides', label: 'Slides', type: 'textarea', default: 'Daily prayers|Join us for congregational prayer|/templates/mosque-hero-1.svg\nWeekend classes|Learning for every age|/templates/mosque-hero-2.svg\nCommunity support|Serving neighbours with care|/templates/mosque-hero-3.svg', placeholder: 'Title|Subtitle|Image URL|Link|Button label, one slide per line' },

    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', span: 'half', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'select', default: 'surface', group: 'Display', span: 'half', options: [
      { label: 'Surface', value: 'surface' },
      { label: 'Solid', value: 'solid' },
      { label: 'Gradient', value: 'gradient' }
    ] },
    { key: 'align', label: 'Header alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'slidesPerView', label: 'Slides per view', type: 'select', default: '1', group: 'Display', span: 'half', showWhen: { key: 'variant', value: ['multi-slide', 'cards'] }, options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ] },
    { key: 'imageRatio', label: 'Image ratio', type: 'select', default: 'landscape', group: 'Display', span: 'half', options: [
      { label: 'Landscape', value: 'landscape' },
      { label: 'Square', value: 'square' },
      { label: 'Portrait', value: 'portrait' }
    ] },
    { key: 'showCta', label: 'Show slide button', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showArrows', label: 'Show arrows', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showDots', label: 'Show dots', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'loop', label: 'Loop', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'autoplay', label: 'Autoplay', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'autoplaySpeed', label: 'Autoplay speed (ms)', type: 'number', default: 5000, group: 'Display', span: 'half', showWhen: { key: 'autoplay', value: true } }
  ]
}
