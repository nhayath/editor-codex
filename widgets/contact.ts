import type { WidgetDefinition } from '~~/types/widget'

export const contactWidget: WidgetDefinition = {
  id: 'contact',
  name: 'Contact',
  icon: 'i-lucide-mail',
  description: 'Contact details and a simple contact block.',
  category: 'content',
  component: 'WidgetContact',
  dataDependencies: ['settings'],
  propSchema: [
    { key: 'title', label: 'Title', type: 'text', default: 'Contact us' },
    { key: 'intro', label: 'Intro', type: 'textarea', default: 'Get in touch with the mosque office.' },
    { key: 'showSocials', label: 'Show social links', type: 'toggle', default: true }
  ]
}
