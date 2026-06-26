import type { TemplateDefinition } from '~~/types/template'

export const noorTemplate: TemplateDefinition = {
  id: 'noor',
  name: 'Noor',
  description: 'Deep navy, coral, mint, and gold mosque homepage with grouped action widgets.',
  thumbnail: '/templates/noor.svg',
  defaultPaletteId: 'navy-coral',
  defaultFontPairId: 'outfit-inter',
  widgets: {
    hero: {
      name: 'Noor Hero',
      description: 'Illuminated navy hero with a gold glow, arabesque texture, and a live next-prayer pill.',
      component: 'NoorHero',
      variants: [
        { id: 'illuminated', name: 'Illuminated' }
      ],
      // `illuminated` is not in the global hero's showWhen gates, so re-declare
      // the image + button fields here (replace-by-key) to keep them editable.
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'illuminated', options: [
          { label: 'Illuminated', value: 'illuminated' }
        ] },
        { key: 'imageUrl', label: 'Image', type: 'image', default: '/templates/mosque-hero-2.svg', group: 'Content' },
        { key: 'showNextPrayer', label: 'Show next-prayer pill', type: 'toggle', default: true, group: 'Content' },
        { key: 'primaryLabel', label: 'Primary button', type: 'text', default: 'Today times', group: 'Buttons', span: 'half' },
        { key: 'primaryUrl', label: 'Primary URL', type: 'url', default: '#prayer-times', group: 'Buttons', span: 'half' },
        { key: 'secondaryLabel', label: 'Secondary button', type: 'text', default: 'See events', group: 'Buttons', span: 'half' },
        { key: 'secondaryUrl', label: 'Secondary URL', type: 'url', default: '#events', group: 'Buttons', span: 'half' }
      ]
    },
    'prayer-times': {
      name: 'Noor Prayer Board',
      description: 'Navy illuminated prayer board with gold cells, a live next-prayer highlight, and a countdown.',
      component: 'NoorPrayerBoard',
      variants: [
        { id: 'illuminated-board', name: 'Illuminated board' }
      ],
      // title / showIqamah / showSunrise merge in from the global prayer-times schema.
      propSchema: [
        { key: 'variant', label: 'Style', type: 'select', default: 'illuminated-board', options: [
          { label: 'Illuminated board', value: 'illuminated-board' }
        ] },
        { key: 'subtitle', label: 'Subtitle (optional)', type: 'text', default: '', group: 'Content' }
      ]
    }
  },
  header: {
    component: 'NoorHeader',
    props: { sticky: true, style: 'modern' }
  },
  footer: {
    component: 'NoorFooter',
    props: { style: 'modern' }
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
        variant: 'illuminated',
        eyebrow: 'Open daily for worship, learning, and care',
        title: 'A place of light, prayer, and belonging.',
        subtitle: 'Prayer times, events, giving, classes, and community updates — gathered into one calm, luminous home.',
        imageUrl: '/templates/mosque-hero-2.svg',
        primaryLabel: 'Today times',
        primaryUrl: '#prayer-times',
        secondaryLabel: 'See events',
        secondaryUrl: '#events',
        showNextPrayer: true
      }
    },
    {
      id: 'prayer-times',
      title: "Prayer & Jumu'ah",
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
            defaultProps: {
              variant: 'illuminated-board',
              title: 'Prayer Times',
              showIqamah: true,
              showSunrise: false
            }
          },
          {
            slot: 'side',
            widgetId: 'jummah-times',
            defaultProps: { title: "Jumu'ah Khutbah", variant: 'card', showLocation: true }
          }
        ]
      }
    },
    {
      id: 'community-actions',
      title: 'Community Shortcuts',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'quick-links',
      defaultProps: {
        variant: 'tiles',
        columns: '2',
        title: 'Start here',
        eyebrow: 'Community shortcuts',
        featuredIcon: 'islamic-mosque',
        items: "Prayer Times|Today salah and iqamah schedule|#prayer-times|islamic-prayer-times\nPlan a Visit|Parking, accessibility, and welcome notes|#contact|islamic-location\nQur'an Classes|Youth, adults, and new Muslim learning|#services|islamic-quran\nDonate|Sadaqah, zakat, and campaigns|#donate|islamic-donation"
      }
    },
    {
      id: 'events',
      title: 'Events & Notices',
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
            defaultProps: { variant: 'list', title: 'Gather, learn, serve', maxItems: 4 }
          },
          {
            slot: 'side',
            widgetId: 'announcements',
            defaultProps: { variant: 'list', title: 'Community updates', maxItems: 3, showPinnedOnly: false }
          }
        ]
      }
    },
    {
      id: 'donate',
      title: 'Donate & Support',
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
            widgetId: 'donation-cta',
            defaultProps: {
              variant: 'cards',
              title: 'Support the masjid',
              subtitle: 'Help sustain worship, education, youth programmes, and community care.',
              buttonLabel: 'Give now'
            }
          },
          {
            slot: 'side',
            widgetId: 'services',
            defaultProps: {
              variant: 'list',
              title: 'Ways to serve',
              items: "Daily prayers|Congregational salah throughout the day|islamic-prayer-times\nEducation|Qur'an and Islamic studies for all ages|islamic-classes\nCommunity care|Support for families and neighbours|islamic-community"
            }
          }
        ]
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
        title: 'Faith, service, and belonging',
        body: '<p>Use this section for a message from the imam, a Ramadan notice, or a short welcome for first-time visitors.</p>',
        imageUrl: '/templates/mosque-hero-1.svg',
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
        title: 'Plan your visit',
        intro: 'Find the mosque, contact the office, and stay connected with community updates.',
        showSocials: true
      }
    }
  ]
}
