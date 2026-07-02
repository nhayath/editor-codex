import type { WidgetDefinition } from '~~/types/widget'

export const announcementsWidget: WidgetDefinition = {
  id: 'announcements',
  name: 'Announcements',
  icon: 'i-lucide-megaphone',
  description: 'Pinned and recent mosque announcements.',
  category: 'engagement',
  variants: [
    { id: 'cards', name: 'Cards' },
    { id: 'list', name: 'List' },
    { id: 'feature', name: 'Feature' },
    { id: 'ticker', name: 'Ticker' },
    { id: 'banner', name: 'Banner' }
  ],
  component: 'WidgetAnnouncements',
  dataDependencies: ['announcements'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'cards', options: [
      { label: 'Cards', value: 'cards' },
      { label: 'List', value: 'list' },
      { label: 'Feature', value: 'feature' },
      { label: 'Ticker', value: 'ticker' },
      { label: 'Banner', value: 'banner' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Announcements' },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Notices', span: 'half' },
    { key: 'maxItems', label: 'Maximum items', type: 'number', default: 3, span: 'half' },
    { key: 'showPinnedOnly', label: 'Pinned only', type: 'toggle', default: false, span: 'half' },

    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', span: 'half', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' } },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'columns', label: 'Card columns', type: 'select', default: '3', group: 'Display', span: 'half', showWhen: { key: 'variant', value: 'cards' }, options: [
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ] },
    { key: 'showImage', label: 'Show images', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showIcon', label: 'Show icon', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showPriorityBadge', label: 'Show pinned/urgent badge', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showContent', label: 'Show body text', type: 'toggle', default: true, group: 'Display', span: 'half' }
  ]
}
