import type { WidgetDefinition } from '~~/types/widget'

export const donationCtaWidget: WidgetDefinition = {
  id: 'donation-cta',
  name: 'Donation CTA',
  icon: 'i-lucide-hand-heart',
  description: 'Featured donation campaign call to action.',
  category: 'engagement',
  variants: [
    { id: 'banner', name: 'Banner' },
    { id: 'cards', name: 'Cards' },
    { id: 'featured', name: 'Featured' },
    { id: 'compact', name: 'Compact' }
  ],
  component: 'WidgetDonationCta',
  dataDependencies: ['donations'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'banner', options: [
      { label: 'Banner', value: 'banner' },
      { label: 'Cards', value: 'cards' },
      { label: 'Featured', value: 'featured' },
      { label: 'Compact', value: 'compact' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Support your mosque' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Your donations help sustain worship, education, and community support.' },
    { key: 'buttonLabel', label: 'Button label', type: 'text', default: 'Donate now' },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Giving', group: 'Display' },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', span: 'half', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'select', default: 'solid', group: 'Display', span: 'half', options: [
      { label: 'Surface', value: 'surface' },
      { label: 'Solid', value: 'solid' },
      { label: 'Gradient', value: 'gradient' }
    ] },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'showProgress', label: 'Show progress bar', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showRaised', label: 'Show amount raised', type: 'toggle', default: true, group: 'Display', span: 'half' },
    // Donation amount selector — opt-in. Chips append the chosen amount to the
    // campaign's paymentUrl as a query param so external providers prefill it.
    { key: 'showAmounts', label: 'Show amount selector', type: 'toggle', default: false, group: 'Donation amounts' },
    { key: 'presetAmounts', label: 'Preset amounts (comma-separated)', type: 'text', default: '10,25,50,100', group: 'Donation amounts', showWhen: { key: 'showAmounts', value: true } },
    { key: 'allowCustomAmount', label: 'Allow custom amount', type: 'toggle', default: true, group: 'Donation amounts', span: 'half', showWhen: { key: 'showAmounts', value: true } },
    { key: 'frequencyToggle', label: 'Offer monthly giving', type: 'toggle', default: false, group: 'Donation amounts', span: 'half', showWhen: { key: 'showAmounts', value: true } },
    { key: 'currencySymbol', label: 'Currency symbol', type: 'text', default: '£', group: 'Donation amounts', span: 'half', showWhen: { key: 'showAmounts', value: true } },
    { key: 'amountQueryParam', label: 'Amount URL parameter', type: 'text', default: 'amount', group: 'Donation amounts', span: 'half', showWhen: { key: 'showAmounts', value: true } }
  ]
}
