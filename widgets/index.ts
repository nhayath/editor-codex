import type { WidgetDefinition } from '~~/types/widget'
import { heroWidget } from './hero'
import { carouselWidget } from './carousel'
import { prayerTimesWidget } from './prayer-times'
import { prayerCountdownWidget } from './prayer-countdown'
import { jummahTimesWidget } from './jummah-times'
import { announcementsWidget } from './announcements'
import { announcementBarWidget } from './announcement-bar'
import { eventsWidget } from './events'
import { donationCtaWidget } from './donation-cta'
import { aboutMosqueWidget } from './about-mosque'
import { servicesWidget } from './services'
import { galleryWidget } from './gallery'
import { contactWidget } from './contact'
import { locationMapWidget } from './location-map'
import { textWidget } from './text'
import { richTextWidget } from './rich-text'
import { imageWidget } from './image'
import { quickLinksWidget } from './quick-links'

export const widgets: WidgetDefinition[] = [
  heroWidget,
  carouselWidget,
  prayerTimesWidget,
  prayerCountdownWidget,
  jummahTimesWidget,
  announcementsWidget,
  announcementBarWidget,
  eventsWidget,
  donationCtaWidget,
  aboutMosqueWidget,
  servicesWidget,
  galleryWidget,
  contactWidget,
  locationMapWidget,
  textWidget,
  richTextWidget,
  imageWidget,
  quickLinksWidget
]

export const widgetMap = Object.fromEntries(widgets.map(widget => [widget.id, widget])) as Record<string, WidgetDefinition>

export function getWidgetDefinition(id: string) {
  return widgetMap[id]
}
