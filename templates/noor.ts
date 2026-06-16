import type { TemplateDefinition } from '~~/types/template'

export const noorTemplate: TemplateDefinition = {
  id: 'noor',
  name: 'Noor',
  description: 'Deep navy, coral, mint, and gold mosque homepage with grouped action widgets.',
  thumbnail: '/templates/noor.svg',
  defaultPaletteId: 'navy-coral',
  defaultFontPairId: 'outfit-inter',
  header: {
    component: 'TenantHeader',
    props: { sticky: true, style: 'modern' }
  },
  footer: {
    component: 'TenantFooter',
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
        variant: 'immersive',
        eyebrow: 'Open daily for worship, learning, and care',
        title: 'A calmer, sharper mosque homepage variation.',
        subtitle: 'A fresh layout for prayer times, events, giving, classes, and community updates.',
        imageUrl: '/templates/mosque-hero-2.svg',
        primaryLabel: 'Today times',
        primaryUrl: '#prayer-times',
        secondaryLabel: 'See events',
        secondaryUrl: '#events',
        align: 'left'
      }
    },
    {
      id: 'community-actions',
      title: 'Community Actions',
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
            widgetId: 'quick-links',
            defaultProps: {
              title: 'Start here',
              eyebrow: 'Community shortcuts',
              featuredIcon: 'islamic-mosque',
              items: "Prayer Times|Today salah and iqamah schedule|#prayer-times|islamic-prayer-times\nPlan a Visit|Parking, accessibility, and welcome notes|#contact|islamic-location\nQur'an Classes|Youth, adults, and new Muslim learning|#services|islamic-quran\nDonate|Sadaqah, zakat, and campaigns|#donate|islamic-donation"
            }
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
              variant: 'feature-panel',
              title: 'Prayer Times',
              showIqamah: true,
              showSunrise: false
            }
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
        title: 'Plan your visit',
        intro: 'Find the mosque, contact the office, and stay connected with community updates.',
        showSocials: true
      }
    }
  ]
}
