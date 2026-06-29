import type { TemplateDefinition } from '~~/types/template'

export const classicTemplate: TemplateDefinition = {
  id: 'classic',
  name: 'Classic',
  description: 'Traditional mosque homepage with clear prayer times, announcements, and events.',
  thumbnail: '/templates/classic.svg',
  header: {
    component: 'TenantHeader',
    props: { sticky: true, style: 'classic' }
  },
  footer: {
    component: 'TenantFooter',
    props: { style: 'classic' }
  },
  dataDependencies: ['settings', 'navItems', 'prayerTimes', 'jummahTimes', 'events', 'announcements', 'donations'],
  sections: [
    {
      id: 'next-prayer',
      title: 'Next Prayer',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'prayer-countdown',
      defaultProps: {
        title: 'Next salah',
        showIqamah: true,
        showIcon: true,
        showProgress: false,
        precision: 'minutes',
        texture: 'girih-diamonds',
        variant: 'iqamah-panel'
      }
    },
    {
      id: 'hero',
      title: 'Hero',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'hero',
      defaultProps: {
        variant: 'with-buttons',
        eyebrow: 'Welcome to',
        title: 'Al-Noor Mosque',
        subtitle: 'A welcoming place for prayer, learning, and community service.',
        imageUrl: '/templates/mosque-hero-1.svg',
        align: 'left'
      }
    },
    {
      id: 'prayer-times',
      title: 'Prayer Times',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'prayer-times',
      defaultProps: {
        variant: 'cards',
        title: 'Todays Prayer Times',
        showIqamah: true,
        showSunrise: true
      }
    },
    {
      id: 'jummah-prayers',
      title: "Jumu'ah Prayers",
      type: 'single',
      required: false,
      removable: false,
      widgetId: 'jummah-times',
      defaultProps: { title: "Jumu'ah prayers", variant: 'card', showLocation: true }
    },
    {
      id: 'announcements',
      title: 'Announcements',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'announcements',
      defaultProps: { variant: 'cards', title: 'Announcements', maxItems: 3, showPinnedOnly: false }
    },
    {
      id: 'events',
      title: 'Events',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'events',
      defaultProps: { variant: 'grid', title: 'Upcoming events', maxItems: 3 }
    },
    {
      id: 'donation-cta',
      title: 'Donation CTA',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'donation-cta',
      defaultProps: { variant: 'banner', title: 'Support your mosque' }
    },
    {
      id: 'about-mosque',
      title: 'About',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'about-mosque',
      defaultProps: {
        variant: 'split',
        title: 'About our mosque',
        imageUrl: '/templates/mosque-hero-2.svg',
        imagePosition: 'right'
      }
    },
    {
      id: 'contact',
      title: 'Contact',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'contact',
      defaultProps: { variant: 'split', title: 'Contact us', showSocials: true }
    }
  ]
}
