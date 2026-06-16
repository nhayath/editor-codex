export const islamicIconNames = [
  'islamic-mosque',
  'islamic-prayer-times',
  'islamic-fajr',
  'islamic-dhuhr',
  'islamic-asr',
  'islamic-maghrib',
  'islamic-isha',
  'islamic-jummah',
  'islamic-donation',
  'islamic-zakat',
  'islamic-quran',
  'islamic-community',
  'islamic-calendar',
  'islamic-announcement',
  'islamic-location',
  'islamic-classes'
] as const

export type IslamicIconName = typeof islamicIconNames[number]

export const islamicIconOptions = [
  { label: 'Mosque', value: 'islamic-mosque' },
  { label: 'Prayer Times', value: 'islamic-prayer-times' },
  { label: 'Fajr', value: 'islamic-fajr' },
  { label: 'Dhuhr', value: 'islamic-dhuhr' },
  { label: 'Asr', value: 'islamic-asr' },
  { label: 'Maghrib', value: 'islamic-maghrib' },
  { label: 'Isha', value: 'islamic-isha' },
  { label: "Jumu'ah", value: 'islamic-jummah' },
  { label: 'Donation', value: 'islamic-donation' },
  { label: 'Zakat', value: 'islamic-zakat' },
  { label: "Qur'an", value: 'islamic-quran' },
  { label: 'Community', value: 'islamic-community' },
  { label: 'Calendar', value: 'islamic-calendar' },
  { label: 'Announcement', value: 'islamic-announcement' },
  { label: 'Location', value: 'islamic-location' },
  { label: 'Classes', value: 'islamic-classes' }
]

export function isIslamicIconName(name?: string): name is IslamicIconName {
  return Boolean(name && islamicIconNames.includes(name as IslamicIconName))
}
