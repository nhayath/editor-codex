import type { WidgetDefinition } from '~~/types/widget'

export const locationMapWidget: WidgetDefinition = {
  id: 'location-map',
  name: 'Location/Map',
  icon: 'i-lucide-map-pin',
  description: 'Address and map embed area.',
  category: 'content',
  component: 'WidgetLocationMap',
  dataDependencies: ['settings'],
  propSchema: [
    { key: 'title', label: 'Title', type: 'text', default: 'Find us' },
    { key: 'address', label: 'Address override', type: 'textarea', default: '' },
    { key: 'embedUrl', label: 'Map embed URL', type: 'url', default: '' },
    { key: 'showDirections', label: 'Show directions button', type: 'toggle', default: true }
  ]
}
