import type { WidgetDefinition } from '~~/types/widget'

export const announcementBarWidget: WidgetDefinition = {
  id: 'announcement-bar',
  name: 'Announcement Bar',
  icon: 'i-lucide-megaphone',
  description: 'A custom message pinned to the top of the page. Sticks while scrolling and can be dismissed.',
  category: 'engagement',
  variants: [
    { id: 'single', name: 'Single' },
    { id: 'rotating', name: 'Rotating' }
  ],
  component: 'WidgetAnnouncementBar',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'single', options: [
      { label: 'Single message', value: 'single' },
      { label: 'Rotating', value: 'rotating' }
    ] },
    // One message per line. Optionally add a link: `Message text|Link label|https://…`
    { key: 'messages', label: 'Messages (one per line · Text|Link label|URL)', type: 'textarea', default: "Jumu'ah is at 1:15 PM — doors open 30 minutes early." },
    { key: 'rotateSeconds', label: 'Rotate every (seconds)', type: 'number', default: 5, span: 'half', showWhen: { key: 'variant', value: 'rotating' } },
    { key: 'sticky', label: 'Stick to top of page', type: 'toggle', default: true, span: 'half' },
    { key: 'dismissible', label: 'Allow dismiss', type: 'toggle', default: true, span: 'half' },

    { key: 'background', label: 'Background', type: 'select', default: 'solid', group: 'Display', span: 'half', options: [
      { label: 'Surface', value: 'surface' },
      { label: 'Solid', value: 'solid' },
      { label: 'Gradient', value: 'gradient' }
    ] },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', span: 'half', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'align', label: 'Alignment', type: 'select', default: 'center', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'icon', label: 'Icon', type: 'icon', default: 'i-lucide-megaphone', group: 'Display', span: 'half' },
    { key: 'showIcon', label: 'Show icon', type: 'toggle', default: true, group: 'Display', span: 'half' }
  ]
}
