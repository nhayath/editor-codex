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
  image: WidgetImage
}
