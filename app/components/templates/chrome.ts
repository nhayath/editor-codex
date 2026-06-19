export interface ChromeNavItem {
  id?: string
  label: string
  href: string
}

export function getTenantInitials(tenant?: Record<string, any> | null, fallback = 'SM') {
  const name = typeof tenant?.name === 'string' ? tenant.name : ''
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()

  return initials || fallback
}

export function getTenantLogoUrl(tenant?: Record<string, any> | null) {
  const logoUrl = tenant?.settings?.logoUrl
  return typeof logoUrl === 'string' && logoUrl.trim().length ? logoUrl.trim() : ''
}

export const sacredModernNavItems: ChromeNavItem[] = [
  { id: 'prayer-times', label: 'Prayer Times', href: '#prayer-times' },
  { id: 'events', label: 'Events', href: '#events' },
  { id: 'announcements', label: 'Announcements', href: '#announcements' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' }
]

export const footerExploreItems: ChromeNavItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#events' },
  { label: 'Programs', href: '#announcements' },
  { label: 'Get Involved', href: '#donate' }
]
