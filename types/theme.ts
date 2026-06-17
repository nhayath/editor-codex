export interface ColorPalette {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
}

export interface FontPair {
  id: string
  name: string
  heading: string
  body: string
}

export const colorPalettes: ColorPalette[] = [
  {
    id: 'emerald',
    name: 'Emerald & Gold',
    primary: '#1B6B4A',
    secondary: '#D4AF37',
    accent: '#2E8B6E',
    background: '#FAFDF9',
    surface: '#FFFFFF',
    text: '#1A1A2E',
    textMuted: '#64748B'
  },
  {
    id: 'sacred-modern',
    name: 'Sacred Modern',
    primary: '#004532',
    secondary: '#DDBB32',
    accent: '#0B7658',
    background: '#FBF9F5',
    surface: '#FFFFFF',
    text: '#1B1C1A',
    textMuted: '#4B5563'
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    primary: '#1E3A5F',
    secondary: '#C9A84C',
    accent: '#2B5EA7',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B'
  },
  {
    id: 'burgundy',
    name: 'Burgundy & Cream',
    primary: '#7B2D3B',
    secondary: '#D4A574',
    accent: '#9B4554',
    background: '#FFF8F6',
    surface: '#FFFFFF',
    text: '#2D1B1E',
    textMuted: '#78716C'
  },
  {
    id: 'plum-gold',
    name: 'Plum & Gold',
    primary: '#45143E',
    secondary: '#F5BC42',
    accent: '#8F6A78',
    background: '#D4C39F',
    surface: '#F8F6F2',
    text: '#2A092A',
    textMuted: '#876F65'
  },
  {
    id: 'navy-coral',
    name: 'Navy, Coral & Mint',
    primary: '#16213E',
    secondary: '#FFD166',
    accent: '#F26B5E',
    background: '#F7F8F3',
    surface: '#FFFFFF',
    text: '#1F2933',
    textMuted: '#64748B'
  },
  {
    id: 'teal',
    name: 'Teal Serenity',
    primary: '#0D9488',
    secondary: '#F59E0B',
    accent: '#14B8A6',
    background: '#F0FDFA',
    surface: '#FFFFFF',
    text: '#134E4A',
    textMuted: '#5EEAD4'
  },
  {
    id: 'slate',
    name: 'Slate Modern',
    primary: '#334155',
    secondary: '#6366F1',
    accent: '#475569',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#94A3B8'
  }
]

export const fontPairs: FontPair[] = [
  { id: 'inter-amiri', name: 'Inter & Amiri', heading: 'Amiri', body: 'Inter' },
  { id: 'outfit-inter', name: 'Outfit & Inter', heading: 'Outfit', body: 'Inter' },
  { id: 'playfair-lato', name: 'Playfair & Lato', heading: 'Playfair Display', body: 'Lato' },
  { id: 'playfair-jakarta', name: 'Playfair & Jakarta', heading: 'Playfair Display', body: 'Plus Jakarta Sans' },
  { id: 'poppins-roboto', name: 'Poppins & Roboto', heading: 'Poppins', body: 'Roboto' }
]
