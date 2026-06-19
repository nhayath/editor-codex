import type { TemplateDefinition } from '~~/types/template'

export const fattanTemplate: TemplateDefinition = {
  id: 'fattan',
  name: 'Fattan',
  description: 'Warm plum and gold mosque homepage inspired by editorial community sites.',
  thumbnail: '/templates/fattan.svg',
  defaultPaletteId: 'plum-gold',
  defaultFontPairId: 'playfair-lato',
  widgets: {
    'prayer-times': {
      name: 'Fattan Prayer Times',
      description: 'Plum and gold feature panel with highlighted next prayer.',
      component: 'FattanPrayerTimes',
      variants: [
        { id: 'feature-panel', name: 'Feature panel' }
      ],
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'feature-panel', options: [
          { label: 'Feature panel', value: 'feature-panel' }
        ] },
        { key: 'hijriDate', label: 'Hijri date', type: 'text', default: '16 Dhul Qaadah 1447' },
        { key: 'backgroundImageUrl', label: 'Background image', type: 'image', default: '/templates/mosque-hero-3.svg' }
      ]
    }
  },
  header: {
    component: 'FattanHeader',
    props: { sticky: true, style: 'fattan' }
  },
  footer: {
    component: 'FattanFooter',
    props: { style: 'fattan' }
  },
  dataDependencies: ['settings', 'navItems', 'prayerTimes', 'jummahTimes', 'events', 'announcements', 'donations'],
  sections: [
    {
      id: 'hero',
      title: 'Hero',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'hero',
      defaultProps: {
        variant: 'with-buttons',
        eyebrow: 'Welcome home',
        title: 'A place of worship, unity & positive change.',
        subtitle: 'Nourish your faith, serve the community, and inspire a better tomorrow.',
        imageUrl: '/templates/mosque-hero-3.svg',
        primaryLabel: 'Plan your visit',
        primaryUrl: '#prayers',
        secondaryLabel: 'Watch events',
        secondaryUrl: '#events',
        align: 'left'
      }
    },
    {
      id: 'prayers',
      title: 'Prayer Times',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'prayer-times',
      defaultProps: {
        variant: 'feature-panel',
        title: 'Prayer Times',
        showIqamah: true,
        showSunrise: false,
        hijriDate: '16 Dhul Qaadah 1447',
        backgroundImageUrl: '/templates/mosque-hero-3.svg'
      }
    },
    {
      id: 'featured',
      title: "Jumu'ah & Events",
      type: 'group',
      required: false,
      removable: true,
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
            widgetId: 'events',
            defaultProps: { variant: 'list', title: 'Upcoming Events', maxItems: 3 }
          },
          {
            slot: 'side',
            widgetId: 'jummah-times',
            defaultProps: { title: "Jumu'ah Khutbah", showLocation: true }
          }
        ]
      }
    },
    {
      id: 'donate',
      title: 'Donation CTA',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'donation-cta',
      defaultProps: {
        variant: 'banner',
        title: 'Your donation builds a better hereafter',
        subtitle: 'Help sustain worship, education, youth programmes, and community support.',
        buttonLabel: 'Donate now'
      }
    },
    {
      id: 'services',
      title: 'Support Options',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'services',
      defaultProps: {
        variant: 'grid',
        title: 'How you can support',
        items: 'Make a Donation|Support essential programmes and daily services.|i-lucide-hand-heart\nSponsor an Event|Fund gatherings, circles, and community meals.|i-lucide-calendar-heart\nMonthly Giving|Help the mosque plan ahead with reliable support.|i-lucide-repeat-2'
      }
    },
    {
      id: 'about',
      title: 'About',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'about-mosque',
      defaultProps: {
        title: 'A welcoming center for worship, learning, and service.',
        body: '<p>Our mosque serves families, students, new Muslims, elders, and neighbours through daily prayers, weekly learning circles, charitable care, and community gatherings.</p><p>Use this section for the imam message, visitor welcome, or your mosque story.</p>',
        imageUrl: '/templates/mosque-hero-2.svg',
        imagePosition: 'right'
      }
    },
    {
      id: 'lectures',
      title: 'Lectures',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'carousel',
      defaultProps: {
        variant: 'multi-slide',
        title: 'Recent talks from the mosque',
        subtitle: 'Feature khutbahs, tafsir circles, youth reminders, and special programmes.',
        slides: 'Mercy in everyday conduct|Friday khutbah reflections for family and community life.|/templates/mosque-hero-1.svg\nLessons from Surah Maryam|A weekly study on patience, prayer, and hope.|/templates/mosque-hero-2.svg\nFaith under pressure|Practical reminders for young people.|/templates/mosque-hero-3.svg',
        autoplay: true
      }
    },
    {
      id: 'contact',
      title: 'Contact',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'contact',
      defaultProps: {
        title: 'Stay connected',
        intro: 'Receive lectures, prayer updates, and community notices.',
        showSocials: true
      }
    }
  ]
}
