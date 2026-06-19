import type { TemplateDefinition } from '~~/types/template'

export const modernTemplate: TemplateDefinition = {
  id: 'modern',
  name: 'Modern',
  description: 'Contemporary mosque homepage with carousel, cards, gallery, and flexible content.',
  thumbnail: '/templates/modern.svg',
  header: {
    component: 'ModernHeader',
    props: { sticky: true, style: 'modern' }
  },
  footer: {
    component: 'ModernFooter',
    props: { style: 'modern' }
  },
  dataDependencies: ['settings', 'navItems', 'prayerTimes', 'jummahTimes', 'events', 'announcements', 'donations'],
  sections: [
    {
      id: 'carousel',
      title: 'Carousel',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'carousel',
      defaultProps: {
        variant: 'single-slide',
        title: 'A mosque at the heart of community',
        subtitle: 'Prayer, learning, care, and connection throughout the week.',
        autoplay: true
      }
    },
    {
      id: 'prayer-overview',
      title: 'Prayer Overview',
      type: 'group',
      required: true,
      removable: false,
      group: {
        layout: 'row',
        groupProps: [
          { key: 'layout', label: 'Layout', type: 'select', default: 'row', options: [
            { label: 'Side by side', value: 'row' },
            { label: 'Stacked', value: 'stack' }
          ] }
        ],
        widgets: [
          {
            slot: 'main',
            widgetId: 'prayer-times',
            defaultProps: { variant: 'compact', title: 'Prayer times', showIqamah: true, showSunrise: false }
          },
          {
            slot: 'side',
            widgetId: 'prayer-countdown',
            defaultProps: { title: 'Next prayer', showIqamah: true, compact: true }
          }
        ]
      }
    },
    {
      id: 'services',
      title: 'Services',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'services',
      defaultProps: { variant: 'grid', title: 'Services' }
    },
    {
      id: 'events',
      title: 'Events',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'events',
      defaultProps: { variant: 'grid', title: 'Upcoming events', maxItems: 4 }
    },
    {
      id: 'gallery',
      title: 'Gallery',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'gallery',
      defaultProps: { variant: 'masonry', title: 'Around the mosque' }
    },
    {
      id: 'donation-cta',
      title: 'Donation CTA',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'donation-cta',
      defaultProps: { variant: 'cards', title: 'Give with confidence' }
    },
    {
      id: 'rich-text',
      title: 'Rich Text',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'rich-text',
      defaultProps: {
        content: '<h2>Faith, service, and belonging</h2><p>Use this section for a message from the imam, a Ramadan notice, or a short welcome for first-time visitors.</p>'
      }
    },
    {
      id: 'contact',
      title: 'Contact',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'contact',
      defaultProps: { title: 'Visit us', showSocials: true }
    }
  ]
}
