import type { WidgetDefinition } from '~~/types/widget'

export const donationCampaignsWidget: WidgetDefinition = {
  id: 'donation-campaigns',
  name: 'Donation Campaigns',
  icon: 'i-lucide-circle-dollar-sign',
  description: 'Show active donation campaigns as a grid, list, or spotlight.',
  category: 'engagement',
  variants: [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' },
    { id: 'spotlight', name: 'Spotlight' }
  ],
  component: 'WidgetDonationCampaigns',
  dataDependencies: ['donations'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'grid', options: [
      { label: 'Grid', value: 'grid' },
      { label: 'List', value: 'list' },
      { label: 'Spotlight', value: 'spotlight' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Donation Campaigns' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Support the projects and services that matter most to our community.' },
    { key: 'buttonLabel', label: 'Button label', type: 'text', default: 'Donate' },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Giving', group: 'Display' },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', span: 'half', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'showImages', label: 'Show images', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'maxItems', label: 'Maximum campaigns', type: 'number', default: 6, group: 'Display', span: 'half' },
    { key: 'showProgress', label: 'Show progress bar', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showRaised', label: 'Show amount raised', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'currencySymbol', label: 'Currency symbol', type: 'text', default: '£', group: 'Display', span: 'half' },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } }
  ]
}
