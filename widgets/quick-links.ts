import type { WidgetDefinition } from '~~/types/widget'
import { islamicIconOptions } from '~~/utils/islamic-icons'

export const quickLinksWidget: WidgetDefinition = {
  id: 'quick-links',
  name: 'Quick Links',
  icon: 'i-lucide-layout-grid',
  description: 'Reusable grouped action links for prayer, visits, classes, donations, and notices.',
  category: 'engagement',
  variants: [
    { id: 'tiles', name: 'Tiles' },
    { id: 'rail', name: 'Rail' },
    { id: 'list', name: 'List' },
    { id: 'buttons', name: 'Buttons' },
    { id: 'featured', name: 'Featured' }
  ],
  component: 'WidgetQuickLinks',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'tiles', options: [
      { label: 'Tiles', value: 'tiles' },
      { label: 'Rail', value: 'rail' },
      { label: 'List', value: 'list' },
      { label: 'Buttons', value: 'buttons' },
      { label: 'Featured', value: 'featured' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Start here' },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Community shortcuts' },
    {
      key: 'items',
      label: 'Links',
      type: 'textarea',
      default: "Prayer Times|Today salah and iqamah schedule|#prayer-times|islamic-prayer-times\nPlan a Visit|Parking, accessibility, and welcome notes|#contact|islamic-location\nQur'an Classes|Youth, adults, and new Muslim learning|#services|islamic-quran\nDonate|Sadaqah, zakat, and campaigns|#donate|islamic-donation",
      placeholder: 'Title|Description|URL|Icon, one item per line'
    },
    { key: 'featuredIcon', label: 'Featured icon', type: 'select', default: 'islamic-mosque', options: islamicIconOptions },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'columns', label: 'Columns (tiles)', type: 'select', default: '2', group: 'Display', span: 'half', options: [
      { label: '2 columns', value: '2' },
      { label: '3 columns', value: '3' }
    ] },
    { key: 'showHeaderIcon', label: 'Show header icon', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showIcon', label: 'Show link icons', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showDescription', label: 'Show descriptions', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showArrow', label: 'Show arrows', type: 'toggle', default: true, group: 'Display', span: 'half' }
  ]
}
