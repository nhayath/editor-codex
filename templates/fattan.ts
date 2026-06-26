import type { TemplateDefinition } from '~~/types/template'

export const fattanTemplate: TemplateDefinition = {
  id: 'fattan',
  name: 'Fattan',
  description: 'Warm plum and gold mosque homepage inspired by editorial community sites.',
  thumbnail: '/templates/fattan.svg',
  defaultPaletteId: 'plum-gold',
  defaultFontPairId: 'playfair-lato',
  widgets: {
    'fattan-hero': {
      name: 'Fattan Hero',
      description: 'Animated plum and gold hero with Islamic arch ornament and next-prayer chip.',
      component: 'FattanHero',
      propSchema: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Welcome home', group: 'Content' },
        { key: 'title', label: 'Title', type: 'text', default: 'A radiant home for prayer, learning, and service.', group: 'Content' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Gather for salah, grow through knowledge, and serve the community with ihsan.', group: 'Content' },
        { key: 'primaryLabel', label: 'Primary button', type: 'text', default: 'Prayer times', group: 'Buttons', span: 'half' },
        { key: 'primaryUrl', label: 'Primary URL', type: 'url', default: '#prayer-times', group: 'Buttons', span: 'half' },
        { key: 'secondaryLabel', label: 'Secondary button', type: 'text', default: 'Upcoming events', group: 'Buttons', span: 'half' },
        { key: 'secondaryUrl', label: 'Secondary URL', type: 'url', default: '#events', group: 'Buttons', span: 'half' },
        { key: 'backgroundImageUrl', label: 'Hero background image', type: 'image', default: '', group: 'Images' },
        { key: 'imageUrl', label: 'Feature image', type: 'image', default: '/templates/mosque-hero-3.svg', group: 'Images' },
        { key: 'showNextPrayer', label: 'Show next prayer chip', type: 'toggle', default: true, group: 'Display' }
      ]
    },
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
        { key: 'subtitle', label: 'Subtitle', type: 'text', default: 'Today at the mosque' },
        { key: 'hijriDate', label: 'Hijri date', type: 'text', default: '16 Dhul Qaadah 1447' },
        { key: 'showIqamah', label: 'Show iqamah times', type: 'toggle', default: true },
        { key: 'showSunrise', label: 'Show sunrise', type: 'toggle', default: false }
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
      widgetId: 'fattan-hero',
      defaultProps: {
        eyebrow: 'Welcome home',
        title: 'A radiant home for prayer, learning, and service.',
        subtitle: 'Gather for salah, grow through knowledge, and serve the community with ihsan.',
        primaryLabel: 'Prayer times',
        primaryUrl: '#prayer-times',
        secondaryLabel: 'Upcoming events',
        secondaryUrl: '#events',
        backgroundImageUrl: '',
        imageUrl: '/templates/mosque-hero-3.svg',
        showNextPrayer: true
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
        variant: 'feature-panel',
        title: 'Prayer Times',
        subtitle: 'Today at the mosque',
        showIqamah: true,
        showSunrise: false,
        hijriDate: '16 Dhul Qaadah 1447'
      }
    },
    {
      id: 'events',
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
            defaultProps: {
              variant: 'agenda',
              eyebrow: 'This week',
              title: 'Gatherings & learning',
              maxItems: 4,
              accent: 'soft',
              background: 'surface',
              showImage: false,
              showDescription: true
            }
          },
          {
            slot: 'side',
            widgetId: 'jummah-times',
            defaultProps: {
              title: "Jumu'ah Khutbah",
              subtitle: 'Friday congregation',
              variant: 'timeline',
              accent: 'soft',
              background: 'surface',
              showLocation: true
            }
          }
        ]
      }
    },
    {
      id: 'services',
      title: 'Community Pathways',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'services',
      defaultProps: {
        variant: 'feature',
        eyebrow: 'Start here',
        title: 'Ways the masjid serves',
        items: 'Visit the mosque|Everything a first-time visitor needs for daily salah, Jumuah, and family visits.|i-lucide-map-pin|/templates/mosque-hero-1.svg|#contact\nLearning circles|Quran, tafsir, reminders, and classes for every age and stage.|i-lucide-book-open|/templates/mosque-hero-2.svg|#lectures\nFamily support|Pastoral care, advice, and community support when life feels heavy.|i-lucide-heart-handshake|/templates/mosque-hero-3.svg|#contact\nYouth & volunteers|A place to build confidence, serve others, and belong.|i-lucide-users-round||#events',
        accent: 'soft',
        background: 'surface',
        columns: '4',
        showCta: true,
        showImage: true,
        showIcon: true
      }
    },
    {
      id: 'lectures',
      title: 'Reflections',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'carousel',
      defaultProps: {
        variant: 'split',
        eyebrow: 'Reflections',
        title: 'Recent reminders from the mosque',
        subtitle: 'Feature khutbahs, tafsir circles, youth reminders, and seasonal programmes.',
        slides: 'Mercy in everyday conduct|Friday khutbah reflections for family and community life.|/templates/mosque-hero-1.svg|#events|Listen now\nLessons from Surah Maryam|A weekly study on patience, prayer, and hope.|/templates/mosque-hero-2.svg|#events|View series\nFaith under pressure|Practical reminders for young people and families.|/templates/mosque-hero-3.svg|#events|Explore',
        accent: 'soft',
        background: 'surface',
        autoplay: true,
        showDots: true,
        showArrows: true
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
        variant: 'featured',
        eyebrow: 'Sadaqah',
        title: 'Build lasting good with your giving',
        subtitle: 'Support worship, education, welfare, and youth programmes with one-off or monthly sadaqah.',
        buttonLabel: 'Give sadaqah',
        accent: 'soft',
        background: 'gradient',
        showAmounts: true,
        presetAmounts: '10,25,50,100',
        frequencyToggle: true,
        showProgress: true
      }
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
        title: 'A welcoming centre for worship, learning, and service.',
        body: '<p>Our mosque serves families, students, new Muslims, elders, and neighbours through daily prayers, weekly learning circles, charitable care, and community gatherings.</p><p>Use this section for the imam message, visitor welcome, or your mosque story.</p>',
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
      defaultProps: {
        variant: 'split',
        title: 'Stay connected',
        intro: 'Receive lectures, prayer updates, and community notices.',
        showSocials: true
      }
    }
  ]
}
