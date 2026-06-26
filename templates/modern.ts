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
  // Template-only widget: a prayer-forward carousel. It reuses the global
  // WidgetCarousel `feature` renderer but ships its own trimmed schema — no
  // base widget means resolveWidgetDefinition returns this propSchema verbatim,
  // so none of the generic carousel's style/display controls leak in.
  widgets: {
    'modern-prayer-carousel': {
      name: 'Prayer carousel',
      icon: 'i-lucide-gallery-horizontal',
      description: 'Prayer-forward feature carousel: ayah panels paired with live prayer, donation, and event widgets.',
      category: 'media',
      component: 'WidgetCarousel',
      variants: [{ id: 'feature', name: 'Feature panels' }],
      dataDependencies: ['prayerTimes', 'donations', 'events'],
      propSchema: [
        { key: 'slides', label: 'Slides', type: 'feature-slides', default: '' },

        { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: '', group: 'Heading (optional)', groupDefaultOpen: false },
        { key: 'title', label: 'Title', type: 'text', default: '', group: 'Heading (optional)' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: '', group: 'Heading (optional)' },

        { key: 'autoplay', label: 'Autoplay', type: 'toggle', default: true, group: 'Display', span: 'half' },
        { key: 'autoplaySpeed', label: 'Autoplay speed (ms)', type: 'number', default: 7000, group: 'Display', span: 'half', showWhen: { key: 'autoplay', value: true } },
        { key: 'showArrows', label: 'Show arrows', type: 'toggle', default: true, group: 'Display', span: 'half' },
        { key: 'showDots', label: 'Show dots', type: 'toggle', default: true, group: 'Display', span: 'half' },
        { key: 'loop', label: 'Loop', type: 'toggle', default: true, group: 'Display', span: 'half' }
      ]
    }
  },
  sections: [
    {
      id: 'prayer-times',
      title: 'Prayer Times',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'prayer-times',
      defaultProps: {
        variant: 'strip',
        background: 'solid',
        accent: 'primary',
        highlightNext: true,
        showSunrise: false,
        scheduleHref: ''
      }
    },
    {
      id: 'carousel',
      title: 'Carousel',
      type: 'single',
      required: true,
      removable: false,
      widgetId: 'modern-prayer-carousel',
      defaultProps: {
        variant: 'feature',
        eyebrow: '',
        title: '',
        subtitle: '',
        background: 'surface',
        autoplay: true,
        autoplaySpeed: 7000,
        slides: [
          "prayer|The weight of salah|Anchor your day in prayer|إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ|Indeed, prayer restrains from shameful and unjust deeds.|Qur'an 29:45|#prayer-times|View timetable",
          'donation|Sadaqah jariyah|Give, and watch it multiply|مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ|The likeness of those who spend in the way of Allah is as a grain that grows seven ears.|Qur\'an 2:261||',
          'events|This week|Happening at the mosque||Classes, halaqas, and community gatherings throughout the week.||#events|See all events'
        ].join('\n')
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
      defaultProps: { variant: 'split', title: 'Visit us', showSocials: true }
    }
  ]
}
