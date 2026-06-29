import type { Component } from 'vue'
import WidgetHero from '~/components/widgets/WidgetHero.vue'
import WidgetCarousel from '~/components/widgets/WidgetCarousel.vue'
import WidgetPrayerTimes from '~/components/widgets/WidgetPrayerTimes.vue'
import WidgetPrayerCountdown from '~/components/widgets/WidgetPrayerCountdown.vue'
import WidgetJummahTimes from '~/components/widgets/WidgetJummahTimes.vue'
import WidgetAnnouncements from '~/components/widgets/WidgetAnnouncements.vue'
import WidgetEvents from '~/components/widgets/WidgetEvents.vue'
import WidgetDonationCta from '~/components/widgets/WidgetDonationCta.vue'
import WidgetAboutMosque from '~/components/widgets/WidgetAboutMosque.vue'
import WidgetServices from '~/components/widgets/WidgetServices.vue'
import WidgetGallery from '~/components/widgets/WidgetGallery.vue'
import WidgetContact from '~/components/widgets/WidgetContact.vue'
import WidgetLocationMap from '~/components/widgets/WidgetLocationMap.vue'
import WidgetText from '~/components/widgets/WidgetText.vue'
import WidgetRichText from '~/components/widgets/WidgetRichText.vue'
import WidgetImage from '~/components/widgets/WidgetImage.vue'
import WidgetQuickLinks from '~/components/widgets/WidgetQuickLinks.vue'
import FattanHero from '~/components/templates/fattan/widgets/FattanHero.vue'
import FattanPrayerTimes from '~/components/templates/fattan/widgets/FattanPrayerTimes.vue'
import NoorHero from '~/components/templates/noor/widgets/NoorHero.vue'
import NoorPrayerBoard from '~/components/templates/noor/widgets/NoorPrayerBoard.vue'
import SacredModernHero from '~/components/templates/sacred-modern/widgets/SacredModernHero.vue'
import SacredModernPrayerTimes from '~/components/templates/sacred-modern/widgets/SacredModernPrayerTimes.vue'
import SacredModernIqamahPanel from '~/components/templates/sacred-modern/widgets/SacredModernIqamahPanel.vue'
import SacredModernKhutbahCard from '~/components/templates/sacred-modern/widgets/SacredModernKhutbahCard.vue'
import SacredModernEvents from '~/components/templates/sacred-modern/widgets/SacredModernEvents.vue'
import SacredModernDonationCta from '~/components/templates/sacred-modern/widgets/SacredModernDonationCta.vue'
import SacredModernPathways from '~/components/templates/sacred-modern/widgets/SacredModernPathways.vue'

export const widgetComponents: Record<string, Component> = {
  hero: WidgetHero,
  carousel: WidgetCarousel,
  'prayer-times': WidgetPrayerTimes,
  'prayer-countdown': WidgetPrayerCountdown,
  'jummah-times': WidgetJummahTimes,
  announcements: WidgetAnnouncements,
  events: WidgetEvents,
  'donation-cta': WidgetDonationCta,
  'about-mosque': WidgetAboutMosque,
  services: WidgetServices,
  gallery: WidgetGallery,
  contact: WidgetContact,
  'location-map': WidgetLocationMap,
  text: WidgetText,
  'rich-text': WidgetRichText,
  image: WidgetImage,
  'quick-links': WidgetQuickLinks
}

const namedWidgetComponents: Record<string, Component> = {
  WidgetHero,
  WidgetCarousel,
  WidgetPrayerTimes,
  WidgetPrayerCountdown,
  WidgetJummahTimes,
  WidgetAnnouncements,
  WidgetEvents,
  WidgetDonationCta,
  WidgetAboutMosque,
  WidgetServices,
  WidgetGallery,
  WidgetContact,
  WidgetLocationMap,
  WidgetText,
  WidgetRichText,
  WidgetImage,
  WidgetQuickLinks,
  FattanHero,
  FattanPrayerTimes,
  NoorHero,
  NoorPrayerBoard,
  SacredModernHero,
  SacredModernPrayerTimes,
  SacredModernIqamahPanel,
  SacredModernKhutbahCard,
  SacredModernEvents,
  SacredModernDonationCta,
  SacredModernPathways
}

export function resolveWidgetComponent(component?: string, widgetId?: string) {
  if (component && namedWidgetComponents[component]) {
    return namedWidgetComponents[component]
  }

  if (import.meta.dev && component && widgetId && widgetComponents[widgetId]) {
    console.warn(`Unknown widget component "${component}" for "${widgetId}". Falling back to the global widget.`)
  }

  if (widgetId && widgetComponents[widgetId]) {
    return widgetComponents[widgetId]
  }

  if (import.meta.dev && (component || widgetId)) {
    console.warn(`Unable to resolve widget component for "${component ?? widgetId}".`)
  }

  return undefined
}
