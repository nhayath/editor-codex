import type { WidgetDefinition } from '~~/types/widget'

export const jummahTimesWidget: WidgetDefinition = {
  id: 'jummah-times',
  name: "Jumu'ah Times",
  icon: 'i-lucide-calendar-clock',
  description: "Friday prayer schedule, labels, and locations.",
  category: 'data',
  component: 'WidgetJummahTimes',
  dataDependencies: ['jummahTimes'],
  propSchema: [
    { key: 'title', label: 'Title', type: 'text', default: "Jumu'ah prayers" },
    { key: 'showLocation', label: 'Show location', type: 'toggle', default: true }
  ]
}
