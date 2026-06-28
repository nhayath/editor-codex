import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const passwordHash = await bcrypt.hash('password123', 10)

const tenantSeeds = [
  {
    owner: { email: 'owner@alnoor.test', name: 'Al-Noor Owner' },
    tenant: {
      name: 'Al-Noor Mosque',
      slug: 'al-noor',
      domain: 'al-noor.msaas.test',
      templateId: 'classic',
      paletteId: 'emerald',
      fontPairId: 'inter-amiri',
      settings: {
        address: '14 Crescent Road',
        city: 'London',
        postcode: 'E12 6AA',
        phone: '+44 20 7946 1010',
        email: 'info@alnoor.test',
        logoUrl: '',
        primaryColor: '#1B6B4A',
        secondaryColor: '#D4AF37',
        aboutText: 'Al-Noor Mosque serves local families through daily prayers, Islamic education, youth work, and community support.',
        facebook: 'https://facebook.com/alnoor',
        instagram: 'https://instagram.com/alnoor',
        youtube: 'https://youtube.com/@alnoor',
        timezone: 'Europe/London'
      },
      overrides: {
        hero: {
          props: {
            title: 'Al-Noor Mosque',
            subtitle: 'Serving our community with prayer, learning, and care.',
            imageUrl: '/templates/mosque-hero-1.svg'
          }
        },
        'about-mosque': {
          props: {
            body: '<p>Al-Noor Mosque is open daily for salah, classes, family activities, and neighbourhood support. Everyone is welcome.</p>'
          }
        }
      }
    }
  },
  {
    owner: { email: 'owner@elic.test', name: 'East London IC Owner' },
    tenant: {
      name: 'East London Islamic Centre',
      slug: 'east-london-ic',
      domain: 'elic.msaas.test',
      templateId: 'modern',
      paletteId: 'midnight',
      fontPairId: 'outfit-inter',
      settings: {
        address: '88 Whitechapel Road',
        city: 'London',
        postcode: 'E1 1JQ',
        phone: '+44 20 7946 2020',
        email: 'office@elic.test',
        logoUrl: '',
        primaryColor: '#1E3A5F',
        secondaryColor: '#C9A84C',
        aboutText: 'A busy Islamic centre offering worship, education, counselling, and welfare programmes in East London.',
        facebook: 'https://facebook.com/elic',
        instagram: 'https://instagram.com/elic',
        youtube: 'https://youtube.com/@elic',
        timezone: 'Europe/London'
      },
      overrides: {
        carousel: {
          props: {
            variant: 'feature',
            eyebrow: '',
            title: '',
            subtitle: '',
            slides: [
              "prayer|The weight of salah|Anchor your day in prayer|إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ|Indeed, prayer restrains from shameful and unjust deeds.|Qur'an 29:45|#prayer-times|View timetable",
              'donation|Sadaqah jariyah|Give, and watch it multiply|مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ|The likeness of those who spend in the way of Allah is as a grain that grows seven ears.|Qur\'an 2:261||',
              'events|This week|Happening across the centre||Classes, learning circles, and welfare programmes for every generation.||#events|See all events'
            ].join('\n')
          }
        },
        'rich-text': {
          props: {
            content: '<h2>A place for every generation</h2><p>From children learning Quran to elders gathering for reminders, our centre is built around worship and service.</p>'
          }
        }
      }
    }
  },
  {
    owner: { email: 'owner@bcm.test', name: 'Birmingham Central Owner' },
    tenant: {
      name: 'Birmingham Central Mosque',
      slug: 'birmingham-central',
      domain: 'bcm.msaas.test',
      templateId: 'classic',
      paletteId: 'burgundy',
      fontPairId: 'playfair-lato',
      settings: {
        address: '180 Belgrave Middleway',
        city: 'Birmingham',
        postcode: 'B12 0XS',
        phone: '+44 121 555 3030',
        email: 'admin@bcm.test',
        logoUrl: '',
        primaryColor: '#7B2D3B',
        secondaryColor: '#D4A574',
        aboutText: 'Birmingham Central Mosque welcomes worshippers and visitors with daily prayer, Islamic learning, and community services.',
        facebook: 'https://facebook.com/bcm',
        instagram: 'https://instagram.com/bcm',
        youtube: 'https://youtube.com/@bcm',
        timezone: 'Europe/London'
      },
      overrides: {
        hero: {
          props: {
            title: 'Birmingham Central Mosque',
            subtitle: 'Prayer, education, and service in the heart of Birmingham.',
            imageUrl: '/templates/mosque-hero-3.svg'
          }
        },
        'donation-cta': {
          props: {
            title: 'Help sustain the masjid',
            subtitle: 'Your regular support keeps essential services available every day.'
          }
        }
      }
    }
  },
  {
    owner: { email: 'owner@fattan.test', name: 'Fattan IC Owner' },
    tenant: {
      name: 'Fattan Islamic Centre',
      slug: 'fattan-islamic-centre',
      domain: 'fattan.msaas.test',
      templateId: 'fattan',
      paletteId: 'plum-gold',
      fontPairId: 'playfair-lato',
      settings: {
        address: '27 Lantern Lane',
        city: 'London',
        postcode: 'E7 9FT',
        phone: '+44 20 7946 4040',
        email: 'salam@fattan.test',
        logoUrl: '',
        primaryColor: '#5B244A',
        secondaryColor: '#D6AD47',
        aboutText: 'Fattan Islamic Centre is a warm community masjid for daily salah, Quran learning, family support, youth work, and service.',
        facebook: 'https://facebook.com/fattanic',
        instagram: 'https://instagram.com/fattanic',
        youtube: 'https://youtube.com/@fattanic',
        timezone: 'Europe/London'
      },
      navItems: [
        { label: 'Home', href: '#top', order: 0 },
        { label: 'Prayer Times', href: '#prayer-times', order: 1 },
        { label: 'Events', href: '#events', order: 2 },
        { label: 'Services', href: '#services', order: 3 },
        { label: 'Contact', href: '#contact', order: 4 }
      ],
      footerLinks: [
        { label: 'Prayer Times', href: '#prayer-times', order: 0 },
        { label: 'Services', href: '#services', order: 1 },
        { label: 'Reflections', href: '#lectures', order: 2 },
        { label: 'Donate', href: '#donate', order: 3 },
        { label: 'Contact', href: '#contact', order: 4 }
      ],
      overrides: {
        hero: {
          props: {
            title: 'Fattan Islamic Centre',
            subtitle: 'A radiant home for prayer, learning, family support, and service in East London.'
          }
        },
        'about-mosque': {
          props: {
            body: '<p>Fattan Islamic Centre welcomes worshippers, families, students, elders, and neighbours through daily prayers, weekly learning circles, youth programmes, and community care.</p><p>Our doors are open for worship, counsel, service, and belonging.</p>'
          }
        },
        donate: {
          props: {
            title: 'Support Fattan Islamic Centre',
            subtitle: 'Your sadaqah sustains worship, education, welfare, and youth programmes.'
          }
        }
      }
    }
  },
  {
    owner: { email: 'owner@sacredmodern.test', name: 'Sacred Modern Owner' },
    tenant: {
      name: 'Sacred Modern Centre',
      slug: 'sacred-modern-centre',
      domain: 'sacredmodern.msaas.test',
      templateId: 'sacred-modern',
      paletteId: 'sacred-modern',
      fontPairId: 'playfair-jakarta',
      settings: {
        address: '41 Garden Crescent',
        city: 'London',
        postcode: 'N1 8SM',
        phone: '+44 20 7946 5050',
        email: 'salam@sacredmodern.test',
        logoUrl: '',
        primaryColor: '#004532',
        secondaryColor: '#DDBB32',
        aboutText: 'Sacred Modern Centre is a welcoming masjid for prayer, learning, service, and neighbourly care.',
        facebook: 'https://facebook.com/sacredmodern',
        instagram: 'https://instagram.com/sacredmodern',
        youtube: 'https://youtube.com/@sacredmodern',
        timezone: 'Europe/London'
      },
      navItems: [
        { label: 'Home', href: '#top', order: 0 },
        { label: 'Prayer Times', href: '#prayer-times', order: 1 },
        { label: 'Pathways', href: '#community-pathways', order: 2 },
        { label: 'Events', href: '#events', order: 3 },
        { label: 'Donate', href: '#donate', order: 4 },
        { label: 'Contact', href: '#contact', order: 5 }
      ],
      footerLinks: [
        { label: 'Prayer Times', href: '#prayer-times', order: 0 },
        { label: 'Pathways', href: '#community-pathways', order: 1 },
        { label: 'Events', href: '#events', order: 2 },
        { label: 'Donate', href: '#donate', order: 3 },
        { label: 'Contact', href: '#contact', order: 4 }
      ],
      overrides: {
        hero: {
          props: {
            title: 'Sacred Modern Centre',
            subtitle: 'A calm home for daily salah, Quran learning, service, and community care.',
            locationLabel: 'Sacred Modern Centre, London'
          }
        },
        about: {
          props: {
            body: '<p>Our centre welcomes worshippers, families, students, elders, and neighbours through daily prayers, weekly reminders, youth programmes, and charitable support.</p><p>Use this section for your imam message, visitor welcome, or mosque story.</p>'
          }
        },
        donate: {
          props: {
            title: 'Sustain worship, learning, and care',
            subtitle: 'Your sadaqah keeps the masjid open, warm, and ready to serve every generation.'
          }
        }
      }
    }
  }
]

const prayerRows = [
  { date: '2026-06-15', fajr: '02:43', sunrise: '04:39', dhuhr: '13:07', asr: '17:26', maghrib: '21:24', isha: '22:43', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:29', ishaIqamah: '23:00' },
  { date: '2026-06-16', fajr: '02:42', sunrise: '04:39', dhuhr: '13:07', asr: '17:27', maghrib: '21:25', isha: '22:44', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:30', ishaIqamah: '23:00' },
  { date: '2026-06-17', fajr: '02:42', sunrise: '04:39', dhuhr: '13:08', asr: '17:27', maghrib: '21:25', isha: '22:45', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:30', ishaIqamah: '23:00' },
  { date: '2026-06-18', fajr: '02:42', sunrise: '04:39', dhuhr: '13:08', asr: '17:28', maghrib: '21:26', isha: '22:46', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:31', ishaIqamah: '23:00' },
  { date: '2026-06-19', fajr: '02:42', sunrise: '04:39', dhuhr: '13:08', asr: '17:28', maghrib: '21:26', isha: '22:46', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:31', ishaIqamah: '23:00' },
  { date: '2026-06-20', fajr: '02:43', sunrise: '04:40', dhuhr: '13:08', asr: '17:28', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-21', fajr: '02:43', sunrise: '04:40', dhuhr: '13:09', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-22', fajr: '02:44', sunrise: '04:40', dhuhr: '13:09', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-23', fajr: '02:45', sunrise: '04:41', dhuhr: '13:09', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-24', fajr: '02:46', sunrise: '04:41', dhuhr: '13:10', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-25', fajr: '02:47', sunrise: '04:42', dhuhr: '13:10', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-26', fajr: '02:49', sunrise: '04:42', dhuhr: '13:10', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-27', fajr: '02:50', sunrise: '04:43', dhuhr: '13:10', asr: '17:29', maghrib: '21:27', isha: '22:46', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-28', fajr: '02:52', sunrise: '04:44', dhuhr: '13:10', asr: '17:29', maghrib: '21:27', isha: '22:46', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-29', fajr: '02:54', sunrise: '04:44', dhuhr: '13:10', asr: '17:29', maghrib: '21:26', isha: '22:45', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:31', ishaIqamah: '23:00' },
  { date: '2026-06-30', fajr: '02:56', sunrise: '04:45', dhuhr: '13:11', asr: '17:29', maghrib: '21:26', isha: '22:45', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:31', ishaIqamah: '23:00' }
]

async function main() {
  await prisma.mediaAsset.deleteMany()
  await prisma.footerLink.deleteMany()
  await prisma.navItem.deleteMany()
  await prisma.donationCampaign.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.event.deleteMany()
  await prisma.jummahTime.deleteMany()
  await prisma.prayerTime.deleteMany()
  await prisma.homepageConfig.deleteMany()
  await prisma.tenantSettings.deleteMany()
  await prisma.tenantMembership.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      email: 'admin@msaas.test',
      name: 'MSaaS Admin',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  })

  for (const seed of tenantSeeds) {
    const owner = await prisma.user.create({
      data: {
        ...seed.owner,
        passwordHash,
        role: 'USER'
      }
    })

    const tenant = await prisma.tenant.create({
      data: {
        name: seed.tenant.name,
        slug: seed.tenant.slug,
        domain: seed.tenant.domain,
        settings: {
          create: seed.tenant.settings
        },
        homepageConfig: {
          create: {
            templateId: seed.tenant.templateId,
            paletteId: seed.tenant.paletteId,
            fontPairId: seed.tenant.fontPairId,
            sectionOrder: '[]',
            sectionsEnabled: '{}',
            sectionOverrides: JSON.stringify(seed.tenant.overrides)
          }
        },
        memberships: {
          create: {
            userId: owner.id,
            role: 'OWNER'
          }
        }
      }
    })

    await prisma.prayerTime.createMany({
      data: prayerRows.map(row => ({ ...row, tenantId: tenant.id }))
    })

    await prisma.jummahTime.createMany({
      data: [
        { tenantId: tenant.id, label: 'First Jumuah', time: '13:15', location: 'Main prayer hall' },
        { tenantId: tenant.id, label: 'Second Jumuah', time: '14:15', location: 'Main prayer hall' }
      ]
    })

    await prisma.event.createMany({
      data: [
        { tenantId: tenant.id, title: 'Quran circle', description: 'Weekly recitation and reflection for adults.', date: '2026-06-19', location: 'Education room', category: 'Education' },
        { tenantId: tenant.id, title: 'Youth night', description: 'Discussion, activities, and food for young people.', date: '2026-06-21', location: 'Community hall', category: 'Youth' },
        { tenantId: tenant.id, title: 'Family open day', description: 'Meet the team and learn about mosque services.', date: '2026-06-27', location: 'Main hall', category: 'Community' },
        { tenantId: tenant.id, title: 'New Muslim support', description: 'A welcoming session for new Muslims and guests.', date: '2026-07-02', location: 'Library', category: 'Support' }
      ]
    })

    await prisma.announcement.createMany({
      data: [
        { tenantId: tenant.id, title: 'Summer timetable now live', content: 'Prayer times have been updated for the summer period.', priority: 'NORMAL', isPinned: true },
        { tenantId: tenant.id, title: 'Car park notice', content: 'Please use nearby public parking for Friday prayers where possible.', priority: 'URGENT', isPinned: true },
        { tenantId: tenant.id, title: 'Volunteer rota', content: 'New volunteer slots are available for weekend programmes.', priority: 'NORMAL', isPinned: false }
      ]
    })

    await prisma.donationCampaign.createMany({
      data: [
        { tenantId: tenant.id, title: 'General mosque fund', description: 'Support daily operations and essential community services.', goal: 25000, raised: 11450, paymentUrl: 'https://example.com/donate/general', status: 'ACTIVE', isFeatured: true },
        { tenantId: tenant.id, title: 'Education programme', description: 'Help keep classes accessible for children and families.', goal: 10000, raised: 3620, paymentUrl: 'https://example.com/donate/education', status: 'ACTIVE', isFeatured: false }
      ]
    })

    await prisma.navItem.createMany({
      data: (seed.tenant.navItems ?? [
        { tenantId: tenant.id, label: 'Home', href: '#top', order: 0 },
        { tenantId: tenant.id, label: 'Prayer Times', href: '#prayer-times', order: 1 },
        { tenantId: tenant.id, label: 'Events', href: '#events', order: 2 },
        { tenantId: tenant.id, label: 'About', href: '#about-mosque', order: 3 },
        { tenantId: tenant.id, label: 'Contact', href: '#contact', order: 4 }
      ]).map(item => ({ ...item, tenantId: tenant.id }))
    })

    await prisma.footerLink.createMany({
      data: (seed.tenant.footerLinks ?? [
        { tenantId: tenant.id, label: 'Home', href: '#top', order: 0 },
        { tenantId: tenant.id, label: 'About Us', href: '#about-mosque', order: 1 },
        { tenantId: tenant.id, label: 'Services', href: '#events', order: 2 },
        { tenantId: tenant.id, label: 'Programs', href: '#announcements', order: 3 },
        { tenantId: tenant.id, label: 'Get Involved', href: '#donate', order: 4 }
      ]).map(item => ({ ...item, tenantId: tenant.id }))
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
