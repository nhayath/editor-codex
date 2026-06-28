import type { TemplateDefinition } from '~~/types/template'

export const sacredModernTemplate: TemplateDefinition = {
  id: 'sacred-modern',
  name: 'Sacred Modern',
  description: 'Cream, emerald, and gold editorial mosque homepage with feature prayer, khutbah, and action groups.',
  thumbnail: '/templates/sacred-modern.svg',
  defaultPaletteId: 'sacred-modern',
  defaultFontPairId: 'playfair-jakarta',
  widgets: {
    hero: {
      name: 'Sacred Modern Hero',
      description: 'Editorial split hero with location chip, large serif headline, and mosque image.',
      component: 'SacredModernHero',
      variants: [
        { id: 'editorial-split', name: 'Editorial split' }
      ],
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'editorial-split', options: [
          { label: 'Editorial split', value: 'editorial-split' }
        ] },
        { key: 'locationLabel', label: 'Location label', type: 'text', default: 'Fattan Mosque, Berlin, Germany' },
        { key: 'showLocationPill', label: 'Show location pill', type: 'toggle', default: true },
        { key: 'showNextPrayer', label: 'Show next prayer chip', type: 'toggle', default: true }
      ]
    },
    'prayer-times': {
      name: 'Sacred Modern Prayer Times',
      description: "Emerald feature board with highlighted next prayer and Jumu'ah times.",
      component: 'SacredModernPrayerTimes',
      variants: [
        { id: 'feature-board', name: 'Feature board' }
      ],
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'feature-board', options: [
          { label: 'Feature board', value: 'feature-board' }
        ] },
        { key: 'hijriDate', label: 'Hijri date', type: 'text', default: '16 Dhul Qadah 1447' },
        { key: 'showCountdown', label: 'Show next prayer chip', type: 'toggle', default: true },
        { key: 'countdownLabel', label: 'Countdown label', type: 'text', default: 'time in' }
      ]
    },
    events: {
      name: 'Sacred Modern Events',
      description: 'Compact cream event list with date badges and detail actions.',
      component: 'SacredModernEvents',
      variants: [
        { id: 'compact-list', name: 'Compact list' }
      ],
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'compact-list', options: [
          { label: 'Compact list', value: 'compact-list' }
        ] },
        { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Upcoming Events' }
      ]
    },
    'donation-cta': {
      name: 'Sacred Modern Donation',
      description: 'Split emerald donation card with gold action button.',
      component: 'SacredModernDonationCta',
      variants: [
        { id: 'split-card', name: 'Split card' }
      ],
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'split-card', options: [
          { label: 'Split card', value: 'split-card' }
        ] },
        { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Giving' }
      ]
    },
    'sacred-modern-pathways': {
      name: 'Sacred Modern Pathways',
      description: 'Three refined action pathways for visitors, learners, and volunteers.',
      component: 'SacredModernPathways',
      variants: [
        { id: 'pathways', name: 'Pathways' }
      ],
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'pathways', options: [
          { label: 'Pathways', value: 'pathways' }
        ] },
        { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Community pathways' },
        { key: 'title', label: 'Title', type: 'text', default: 'Begin with clarity' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'Three simple ways to connect with the masjid this week.' },
        { key: 'items', label: 'Pathways', type: 'textarea', default: 'Visit the mosque|Prayer spaces, visitor guidance, and directions for first-time guests|#contact|i-lucide-map-pin\nLearn with us|Quran circles, reminders, and classes for every age and stage|#events|i-lucide-book-open\nServe the community|Volunteer, give time, and support neighbours with care|#donate|i-lucide-heart-handshake' }
      ]
    },
    'sacred-khutbah-card': {
      name: "Jumu'ah Khutbah Card",
      icon: 'i-lucide-mic-2',
      description: 'Imam profile and weekly khutbah quote card.',
      category: 'content',
      component: 'SacredModernKhutbahCard',
      propSchema: [
        { key: 'label', label: 'Label', type: 'text', default: "Jumu'ah Khutbah" },
        { key: 'imamName', label: 'Imam name', type: 'text', default: 'Imam Rashid Al-Qasimi' },
        { key: 'quote', label: 'Quote', type: 'textarea', default: 'Indeed, with hardship comes ease.' },
        { key: 'quoteSource', label: 'Quote source', type: 'text', default: "Qur'an 94:6" },
        { key: 'imageUrl', label: 'Decorative image (optional)', type: 'image', default: '' },
        { key: 'buttonLabel', label: 'Button label', type: 'text', default: 'Meet the Imam' },
        { key: 'buttonUrl', label: 'Button URL', type: 'url', default: '#about' }
      ]
    }
  },
  header: {
    component: 'SacredModernHeader',
    props: { sticky: true, style: 'sacred-modern' }
  },
  footer: {
    component: 'SacredModernFooter',
    props: { style: 'sacred-modern' }
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
        variant: 'editorial-split',
        locationLabel: 'Fattan Mosque, Berlin, Germany',
        showLocationPill: true,
        eyebrow: '',
        title: 'A place of worship, unity & positive change.',
        subtitle: 'Nourish your faith. Serve the community. Inspire a better tomorrow.',
        imageUrl: '/templates/sacred-modern-courtyard.webp',
        primaryLabel: 'Prayer Times',
        primaryUrl: '#prayer-times',
        secondaryLabel: 'Plan Your Visit',
        secondaryUrl: '#about',
        showNextPrayer: true,
        align: 'left'
      }
    },
    {
      id: 'prayer-times',
      title: "Khutbah & Prayer Times",
      type: 'group',
      required: true,
      removable: false,
      group: {
        layout: 'row',
        groupProps: [
          { key: 'layout', label: 'Layout', type: 'select', default: 'row', options: [
            { label: 'Side by side', value: 'row' },
            { label: 'Stacked', value: 'stack' }
          ] },
          { key: 'arrangement', label: 'Arrangement', type: 'select', default: 'side-main', options: [
            { label: 'Side card and main board', value: 'side-main' },
            { label: 'Main board and side card', value: 'main-side' }
          ] }
        ],
        widgets: [
          {
            slot: 'khutbah',
            widgetId: 'sacred-khutbah-card',
            defaultProps: {
              label: "Jumu'ah Khutbah",
              imamName: 'Imam Rashid Al-Qasimi',
              quote: 'Indeed, with hardship comes ease.',
              quoteSource: "Qur'an 94:6",
              imageUrl: '',
              buttonLabel: 'Meet the Imam',
              buttonUrl: '#about'
            }
          },
          {
            slot: 'prayers',
            widgetId: 'prayer-times',
            defaultProps: {
              variant: 'feature-board',
              title: 'Prayer Times',
              showIqamah: true,
              showSunrise: false,
              hijriDate: '16 Dhul Qadah 1447',
              showCountdown: true,
              countdownLabel: 'time in'
            }
          }
        ]
      }
    },
    {
      id: 'community-pathways',
      title: 'Community Pathways',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'sacred-modern-pathways',
      defaultProps: {
        variant: 'pathways',
        eyebrow: 'Community pathways',
        title: 'Begin with clarity',
        subtitle: 'Three simple ways to connect with the masjid this week.',
        items: 'Visit the mosque|Prayer spaces, visitor guidance, and directions for first-time guests|#contact|i-lucide-map-pin\nLearn with us|Quran circles, reminders, and classes for every age and stage|#events|i-lucide-book-open\nServe the community|Volunteer, give time, and support neighbours with care|#donate|i-lucide-heart-handshake'
      }
    },
    {
      id: 'events',
      title: 'Events',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'events',
      defaultProps: {
        variant: 'compact-list',
        eyebrow: 'Upcoming Events',
        title: 'Upcoming Events',
        maxItems: 3
      }
    },
    {
      id: 'donate',
      title: 'Donate',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'donation-cta',
      defaultProps: {
        variant: 'split-card',
        eyebrow: 'Giving',
        title: 'Your donation builds a better hereafter',
        subtitle: 'Support our mission of worship, education and community.',
        buttonLabel: 'Donate Now'
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
        variant: 'split',
        title: 'A welcoming centre for worship, learning, and service.',
        body: '<p>Share the story of your mosque, the imam message, and practical guidance for first-time visitors.</p><p>Keep this section warm, concise, and community-focused.</p>',
        imageUrl: '/templates/sacred-modern-courtyard.webp',
        imagePosition: 'right',
        showStats: true,
        stats: '5|Daily prayers\n3|Weekly circles\n1|Open community',
        ctaLabel: 'Visit us',
        ctaUrl: '#contact'
      }
    },
    {
      id: 'announcements',
      title: 'Announcements',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'announcements',
      defaultProps: {
        variant: 'list',
        title: 'Community Announcements',
        maxItems: 3,
        showPinnedOnly: false
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
        title: 'Plan your visit',
        intro: 'Find the mosque, contact the office, and stay connected with community updates.',
        showSocials: true
      }
    }
  ]
}
