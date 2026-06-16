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
    { id: 'rail', name: 'Rail' }
  ],
  component: 'WidgetQuickLinks',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'tiles', options: [
      { label: 'Tiles', value: 'tiles' },
      { label: 'Rail', value: 'rail' }
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
    { key: 'featuredIcon', label: 'Featured icon', type: 'select', default: 'islamic-mosque', options: islamicIconOptions }
  ]
}
