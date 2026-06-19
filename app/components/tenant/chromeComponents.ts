import type { Component } from 'vue'
import TenantHeader from '~/components/tenant/TenantHeader.vue'
import TenantFooter from '~/components/tenant/TenantFooter.vue'
import ModernHeader from '~/components/templates/modern/chrome/ModernHeader.vue'
import ModernFooter from '~/components/templates/modern/chrome/ModernFooter.vue'
import FattanHeader from '~/components/templates/fattan/chrome/FattanHeader.vue'
import FattanFooter from '~/components/templates/fattan/chrome/FattanFooter.vue'
import NoorHeader from '~/components/templates/noor/chrome/NoorHeader.vue'
import NoorFooter from '~/components/templates/noor/chrome/NoorFooter.vue'
import SacredModernHeader from '~/components/templates/sacred-modern/chrome/SacredModernHeader.vue'
import SacredModernFooter from '~/components/templates/sacred-modern/chrome/SacredModernFooter.vue'

const headerComponents: Record<string, Component> = {
  TenantHeader,
  ModernHeader,
  FattanHeader,
  NoorHeader,
  SacredModernHeader
}

const footerComponents: Record<string, Component> = {
  TenantFooter,
  ModernFooter,
  FattanFooter,
  NoorFooter,
  SacredModernFooter
}

export function resolveHeaderComponent(component?: string) {
  if (component && headerComponents[component]) {
    return headerComponents[component]
  }

  if (import.meta.dev && component) {
    console.warn(`Unknown header component "${component}". Falling back to TenantHeader.`)
  }

  return TenantHeader
}

export function resolveFooterComponent(component?: string) {
  if (component && footerComponents[component]) {
    return footerComponents[component]
  }

  if (import.meta.dev && component) {
    console.warn(`Unknown footer component "${component}". Falling back to TenantFooter.`)
  }

  return TenantFooter
}
