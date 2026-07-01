import type { WidgetDefinition } from '~~/types/widget'

// Variants that use an image as a side/dominant panel (vs. a full background).
const imagePanelVariants = ['with-image', 'split', 'immersive']
// Variants that show one or more action buttons.
const buttonVariants = ['with-image', 'with-buttons', 'split', 'immersive', 'banner']
// Variants whose look is driven by the unified background picker.
const backgroundVariants = ['simple', 'with-buttons', 'banner']
// The image-panel image controls only apply to the image-panel variants; the
// background-driven variants get their imagery through the `background` picker.
const imagePanelCondition = { key: 'variant', value: imagePanelVariants }

export const heroWidget: WidgetDefinition = {
  id: 'hero',
  name: 'Hero Banner',
  icon: 'i-lucide-panels-top-left',
  description: 'Prominent homepage introduction with optional image and actions.',
  category: 'content',
  variants: [
    { id: 'simple', name: 'Simple' },
    { id: 'split', name: 'Split' },
    { id: 'with-image', name: 'Spotlight' },
    { id: 'with-buttons', name: 'Action' },
    { id: 'immersive', name: 'Immersive' },
    { id: 'banner', name: 'Banner' }
  ],
  component: 'WidgetHero',
  propSchema: [
    { key: 'variant', label: 'Style', type: 'select', default: 'with-buttons', options: [
      { label: 'Simple — centered text only', value: 'simple' },
      { label: 'Split — text and image side by side', value: 'split' },
      { label: 'Spotlight — large image with text card', value: 'with-image' },
      { label: 'Action — bold call-to-action buttons', value: 'with-buttons' },
      { label: 'Immersive — full background image', value: 'immersive' },
      { label: 'Banner — short strip', value: 'banner' }
    ] },
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', default: 'Welcome to', group: 'Content' },
    { key: 'title', label: 'Title', type: 'text', default: 'Al-Noor Mosque', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea', default: 'A welcoming place for prayer, learning, and community.', group: 'Content' },
    { key: 'align', label: 'Text alignment', type: 'select', default: 'left', group: 'Content', showWhen: { key: 'variant', value: ['simple', 'with-buttons'] }, options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' }
    ] },
    { key: 'imageUrl', label: 'Image', type: 'image', default: '', group: 'Image', showWhen: imagePanelCondition },
    { key: 'overlayOpacity', label: 'Darkness (0-100)', type: 'number', default: 50, group: 'Image', span: 'half', showWhen: imagePanelCondition },
    { key: 'textTone', label: 'Text colour', type: 'select', default: 'light', group: 'Image', span: 'half', options: [
      { label: 'Light text', value: 'light' },
      { label: 'Dark text', value: 'dark' }
    ], showWhen: imagePanelCondition },
    { key: 'texture', label: 'Pattern', type: 'pattern-select', default: 'eight-point-star', group: 'Texture', groupDefaultOpen: false, showWhen: imagePanelCondition, options: [
      { label: 'None', value: 'none' },
      { label: 'Eight-point stars', value: 'eight-point-star' },
      { label: 'Girih diamonds', value: 'girih-diamonds' },
      { label: 'Arabesque vines', value: 'arabesque-vines' },
      { label: 'Rosette bloom', value: 'rosette-bloom' },
      { label: 'Palm-leaf fan', value: 'palm-leaf-fan' },
      { label: 'Mihrab arches', value: 'mihrab-arches' },
      { label: 'Ramadan lanterns', value: 'ramadan-crescent-lantern' },
      { label: 'Eid al-Fitr stars', value: 'eid-fitr-stars' },
      { label: 'Eid al-Adha arches', value: 'eid-adha-arches' },
      { label: 'Laylat al-Qadr night', value: 'laylat-qadr-night' },
      { label: 'Hajj tawaf rings', value: 'hajj-tawaf-rings' },
      { label: 'Jumuah lines', value: 'jumuah-lines' }
    ] },
    { key: 'spotlightCardBg', label: 'Card background', type: 'color', default: '#16213E', group: 'Card', showWhen: { key: 'variant', value: 'with-image' } },
    { key: 'spotlightCardOpacity', label: 'Card opacity (0-100)', type: 'number', default: 72, group: 'Card', span: 'half', showWhen: { key: 'variant', value: 'with-image' } },
    { key: 'spotlightCardBlur', label: 'Card blur', type: 'number', default: 8, group: 'Card', span: 'half', showWhen: { key: 'variant', value: 'with-image' } },
    { key: 'primaryLabel', label: 'Primary button', type: 'text', default: 'View prayer times', group: 'Buttons', span: 'half', showWhen: { key: 'variant', value: buttonVariants } },
    { key: 'primaryUrl', label: 'Primary URL', type: 'url', default: '#prayer-times', group: 'Buttons', span: 'half', showWhen: { key: 'variant', value: buttonVariants } },
    { key: 'secondaryLabel', label: 'Secondary button', type: 'text', default: 'Upcoming events', group: 'Buttons', span: 'half', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    { key: 'secondaryUrl', label: 'Secondary URL', type: 'url', default: '#events', group: 'Buttons', span: 'half', showWhen: { key: 'variant', value: ['with-image', 'with-buttons', 'split', 'immersive'] } },
    // Unified background picker (colour / gradient / image + darken / pattern),
    // shared with sections and other widgets. Replaces the old background select
    // + separate colour/gradient/overlay fields for the background-driven
    // variants. Image-panel variants keep the Image controls above instead.
    { key: 'background', label: 'Background', type: 'background', default: { type: 'theme' }, showWhen: { key: 'variant', value: backgroundVariants } }
  ]
}
