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
            title: 'East London Islamic Centre',
            subtitle: 'A centre for worship, knowledge, service, and belonging.',
            slides: 'Daily worship|Five daily prayers and Jumuah services|/templates/mosque-hero-2.svg\nLearning circles|Classes for children, youth, and adults|/templates/mosque-hero-1.svg\nCommunity welfare|Support for families across East London|/templates/mosque-hero-3.svg'
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
  }
]

const prayerRows = [
  { date: '2026-06-15', fajr: '02:43', sunrise: '04:39', dhuhr: '13:07', asr: '17:26', maghrib: '21:24', isha: '22:43', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:29', ishaIqamah: '23:00' },
  { date: '2026-06-16', fajr: '02:42', sunrise: '04:39', dhuhr: '13:07', asr: '17:27', maghrib: '21:25', isha: '22:44', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:30', ishaIqamah: '23:00' },
  { date: '2026-06-17', fajr: '02:42', sunrise: '04:39', dhuhr: '13:08', asr: '17:27', maghrib: '21:25', isha: '22:45', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:30', ishaIqamah: '23:00' },
  { date: '2026-06-18', fajr: '02:42', sunrise: '04:39', dhuhr: '13:08', asr: '17:28', maghrib: '21:26', isha: '22:46', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:31', ishaIqamah: '23:00' },
  { date: '2026-06-19', fajr: '02:42', sunrise: '04:39', dhuhr: '13:08', asr: '17:28', maghrib: '21:26', isha: '22:46', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:31', ishaIqamah: '23:00' },
  { date: '2026-06-20', fajr: '02:43', sunrise: '04:40', dhuhr: '13:08', asr: '17:28', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' },
  { date: '2026-06-21', fajr: '02:43', sunrise: '04:40', dhuhr: '13:09', asr: '17:29', maghrib: '21:27', isha: '22:47', fajrIqamah: '03:15', dhuhrIqamah: '13:30', asrIqamah: '18:00', maghribIqamah: '21:32', ishaIqamah: '23:00' }
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
      data: [
        { tenantId: tenant.id, label: 'Home', href: '#top', order: 0 },
        { tenantId: tenant.id, label: 'Prayer Times', href: '#prayer-times', order: 1 },
        { tenantId: tenant.id, label: 'Events', href: '#events', order: 2 },
        { tenantId: tenant.id, label: 'About', href: '#about-mosque', order: 3 },
        { tenantId: tenant.id, label: 'Contact', href: '#contact', order: 4 }
      ]
    })

    await prisma.footerLink.createMany({
      data: [
        { tenantId: tenant.id, label: 'Home', href: '#top', order: 0 },
        { tenantId: tenant.id, label: 'About Us', href: '#about-mosque', order: 1 },
        { tenantId: tenant.id, label: 'Services', href: '#events', order: 2 },
        { tenantId: tenant.id, label: 'Programs', href: '#announcements', order: 3 },
        { tenantId: tenant.id, label: 'Get Involved', href: '#donate', order: 4 }
      ]
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
