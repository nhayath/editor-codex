import type { WidgetDefinition } from '~~/types/widget'

export const prayerCountdownWidget: WidgetDefinition = {
  id: 'prayer-countdown',
  name: 'Prayer Countdown',
  icon: 'i-lucide-timer',
  description: 'Highlights the next prayer from today’s timetable with a live countdown.',
  category: 'data',
  variants: [
    { id: 'card', name: 'Card' },
    { id: 'banner', name: 'Banner' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'split', name: 'Split' },
    { id: 'iqamah-panel', name: 'Iqamah Panel' }
  ],
  component: 'WidgetPrayerCountdown',
  dataDependencies: ['prayerTimes'],
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'card', options: [
      { label: 'Card', value: 'card' },
      { label: 'Banner', value: 'banner' },
      { label: 'Minimal', value: 'minimal' },
      { label: 'Split', value: 'split' },
      { label: 'Iqamah Panel', value: 'iqamah-panel' }
    ] },
    { key: 'title', label: 'Title', type: 'text', default: 'Next prayer' },
    { key: 'accent', label: 'Accent', type: 'select', default: 'primary', group: 'Display', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Soft', value: 'soft' },
      { label: 'Neutral', value: 'neutral' }
    ] },
    { key: 'background', label: 'Background', type: 'select', default: 'solid', group: 'Display', options: [
      { label: 'Solid', value: 'solid' },
      { label: 'Gradient', value: 'gradient' },
      { label: 'Surface', value: 'surface' }
    ] },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', group: 'Display', span: 'half', options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'precision', label: 'Countdown', type: 'select', default: 'minutes', group: 'Display', span: 'half', options: [
      { label: 'Minutes', value: 'minutes' },
      { label: 'Seconds', value: 'seconds' }
    ] },
    { key: 'showIqamah', label: 'Prefer iqamah time', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showIcon', label: 'Show icon', type: 'toggle', default: true, group: 'Display', span: 'half' },
    { key: 'showDate', label: 'Show date', type: 'toggle', default: false, group: 'Display', span: 'half' },
    { key: 'showProgress', label: 'Show progress bar', type: 'toggle', default: true, group: 'Display', span: 'half' }
  ]
}
