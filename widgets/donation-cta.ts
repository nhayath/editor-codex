import type { WidgetDefinition } from '~~/types/widget'

export const donationCtaWidget: WidgetDefinition = {
  id: 'donation-cta',
  name: 'Donation CTA',
  icon: 'i-lucide-hand-heart',
  description: 'Featured donation campaign call to action.',
  category: 'engagement',
  variants: [
    { id: 'banner', name: 'Banner' },
    { id: 'cards', name: 'Cards' }
  ],
  component: 'WidgetDonationCta',
  dataDependencies: ['donations'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'banner', options: [
      { label: 'Banner', value: 'banner' },
      { label: 'Cards', value: 'cards' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Support your mosque' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Your donations help sustain worship, education, and community support.' },
    { key: 'buttonLabel', label: 'Button label', type: 'text', default: 'Donate now' }
  ]
}
