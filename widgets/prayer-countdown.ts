import type { WidgetDefinition } from '~~/types/widget'

export const prayerCountdownWidget: WidgetDefinition = {
  id: 'prayer-countdown',
  name: 'Prayer Countdown',
  icon: 'i-lucide-timer',
  description: 'Highlights the next prayer from today’s timetable.',
  category: 'data',
  component: 'WidgetPrayerCountdown',
  dataDependencies: ['prayerTimes'],
  propSchema: [
    { key: 'title', label: 'Title', type: 'text', default: 'Next prayer' },
    { key: 'showIqamah', label: 'Prefer iqamah time', type: 'toggle', default: true },
    { key: 'compact', label: 'Compact layout', type: 'toggle', default: false }
  ]
}
