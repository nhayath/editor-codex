import type { TemplateDefinition } from '~~/types/template'

export const classicTemplate: TemplateDefinition = {
  id: 'classic',
  name: 'Classic',
  description: 'Traditional mosque homepage with clear prayer times, announcements, and events.',
  thumbnail: '/templates/classic.svg',
  defaultPaletteId: 'sacred-modern',
  defaultFontPairId: 'inter-amiri',
  header: {
    component: 'TenantHeader',
    props: {
      sticky: true,
      style: 'classic',
      ctaLabel: 'Donate',
      ctaHref: '#donation-cta',
      ctaIcon: 'i-lucide-hand-heart'
    }
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
        showDate: true,
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
        variant: 'split',
        eyebrow: 'Welcome to',
        title: 'Al-Noor Mosque',
        subtitle: 'A welcoming place for prayer, learning, and community service.',
        imageUrl: '/templates/mosque-hero-1.svg',
        primaryLabel: 'View prayer times',
        primaryUrl: '#prayer-times',
        secondaryLabel: 'Support the masjid',
        secondaryUrl: '#donation-cta',
        overlayOpacity: 0,
        textTone: 'dark',
        texture: 'mihrab-arches'
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
        title: "Today's Prayer Times",
        accent: 'primary',
        background: {
          type: 'theme',
          pattern: { presetId: 'eight-point-star', color: '#DDBB32', scale: 132, intensity: 0.04 }
        },
        align: 'left',
        showIcons: true,
        highlightNext: true,
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
      defaultProps: {
        title: "Jumu'ah prayers",
        subtitle: 'Friday congregational prayer times',
        variant: 'feature',
        accent: 'primary',
        background: {
          type: 'theme',
          pattern: { presetId: 'jumuah-lines', color: '#DDBB32', scale: 112, intensity: 0.04 }
        },
        showLocation: true,
        countdown: true
      }
    },
    {
      id: 'donation-cta',
      title: 'Donation CTA',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'donation-cta',
      defaultProps: {
        variant: 'featured',
        title: 'Support the house of Allah',
        subtitle: 'Your sadaqah sustains daily prayers, learning, and care for the community.',
        buttonLabel: 'Donate now',
        imageUrl: '/uploads/cmqvigb8x0001a85rnwf799wo/donation-box-7eff6832-27a0-4d13-8bba-c1990c82f698.png',
        eyebrow: 'Giving',
        accent: 'primary',
        background: {
          type: 'theme',
          pattern: { presetId: 'rosette-bloom', color: '#DDBB32', scale: 128, intensity: 0.04 }
        },
        showAmounts: true,
        presetAmounts: '30,50,100',
        showProgress: true,
        showRaised: true
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
        variant: 'agenda',
        eyebrow: 'Programmes',
        title: 'Upcoming events',
        maxItems: 4,
        accent: 'primary',
        background: {
          type: 'theme',
          pattern: { presetId: 'palm-leaf-fan', color: '#004532', scale: 148, intensity: 0.03 }
        },
        showImage: true,
        showCategory: true,
        showDate: true,
        showLocation: true,
        showDescription: true
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
        variant: 'feature',
        eyebrow: 'Notices',
        title: 'Announcements',
        maxItems: 3,
        showPinnedOnly: false,
        accent: 'primary',
        background: {
          type: 'theme',
          pattern: { presetId: 'girih-diamonds', color: '#DDBB32', scale: 140, intensity: 0.03 }
        },
        showImage: true,
        showIcon: true,
        showPriorityBadge: true,
        showContent: true
      }
    },
    {
      id: 'donation-campaigns',
      title: 'Donation Campaigns',
      type: 'single',
      required: false,
      removable: true,
      widgetId: 'donation-campaigns',
      defaultProps: {
        variant: 'spotlight',
        eyebrow: 'Campaigns',
        title: 'Give with purpose',
        subtitle: 'Support the projects and services that keep the masjid serving every generation.',
        buttonLabel: 'Donate',
        accent: 'primary',
        background: {
          type: 'theme',
          pattern: { presetId: 'mihrab-arches', color: '#DDBB32', scale: 124, intensity: 0.04 }
        },
        showImages: true,
        showProgress: true,
        showRaised: true,
        maxItems: 3
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
        variant: 'feature',
        eyebrow: 'About us',
        title: 'About our mosque',
        imageUrl: '/templates/mosque-hero-2.svg',
        imagePosition: 'right',
        imageRatio: 'landscape',
        background: {
          type: 'theme',
          pattern: { presetId: 'arabesque-vines', color: '#004532', scale: 136, intensity: 0.03 }
        },
        showStats: true,
        stats: '5|Daily prayers\n2|Jumuah gatherings\nOpen|To everyone',
        ctaLabel: 'View prayer times',
        ctaUrl: '#prayer-times'
      }
    }
  ]
}
