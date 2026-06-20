<script setup lang="ts">
import type { TenantSettingsDraft } from '~/composables/useHomepageEditor'

type SettingsPanel = 'root' | 'header' | 'navigation' | 'domain' | 'footer' | 'footerDescription' | 'footerContact' | 'footerSocial' | 'footerLinks'

const editor = useHomepageEditor()

const tenantId = computed(() => editor.tenant.value?.id as string | undefined)
const panelStack = ref<SettingsPanel[]>(['root'])
const transitionName = ref('settings-slide-forward')
const activeNavIndex = ref(0)
const activeFooterIndex = ref(0)

const currentPanel = computed(() => panelStack.value[panelStack.value.length - 1] ?? 'root')
const panelTitle = computed(() => {
  const titles: Record<SettingsPanel, string> = {
    root: 'Settings',
    header: 'Header',
    navigation: 'Navigation',
    domain: 'Domain',
    footer: 'Footer',
    footerDescription: 'Description',
    footerContact: 'Contact details',
    footerSocial: 'Social links',
    footerLinks: 'Footer links'
  }

  return titles[currentPanel.value]
})

function settingsField(key: keyof TenantSettingsDraft) {
  return computed({
    get: () => editor.settingsDraft.value?.[key] ?? '',
    set: value => editor.updateSettingsDraft({ [key]: value } as Partial<TenantSettingsDraft>)
  })
}

const domain = settingsField('domain')
const logoUrl = settingsField('logoUrl')
const aboutText = settingsField('aboutText')
const address = settingsField('address')
const city = settingsField('city')
const postcode = settingsField('postcode')
const phone = settingsField('phone')
const email = settingsField('email')
const facebook = settingsField('facebook')
const instagram = settingsField('instagram')
const youtube = settingsField('youtube')

const activeNavItem = computed(() => editor.navItemsDraft.value[activeNavIndex.value] ?? null)
const activeFooterLink = computed(() => editor.footerLinksDraft.value[activeFooterIndex.value] ?? null)

const anchorSuggestions = computed(() => {
  const sectionAnchors = editor.resolvedSections.value
    .filter(section => section.enabled)
    .map(section => ({
      label: section.title ?? section.name ?? section.id,
      href: `#${section.id}`
    }))

  return [
    { label: 'Top', href: '#top' },
    ...sectionAnchors,
    { label: 'Contact', href: '#contact' },
    { label: 'Donate', href: '#donate' }
  ]
})

function openPanel(panel: SettingsPanel) {
  transitionName.value = 'settings-slide-forward'
  panelStack.value.push(panel)
}

function goBack() {
  if (panelStack.value.length <= 1) return

  transitionName.value = 'settings-slide-back'
  panelStack.value.pop()
}

function syncPreviewChrome() {
  if (!editor.tenant.value) return

  const settings = (editor.tenant.value.settings ?? {}) as Record<string, unknown>
  const activeNavItems = editor.navItemsDraft.value
    .filter(item => item.isActive)
    .map((item, index) => ({
      id: item.id ?? `draft-${index}`,
      label: item.label,
      href: item.href,
      order: index,
      isActive: true
    }))
  const activeFooterLinks = editor.footerLinksDraft.value
    .filter(item => item.isActive)
    .map((item, index) => ({
      id: item.id ?? `draft-footer-${index}`,
      label: item.label,
      href: item.href,
      order: index,
      isActive: true
    }))

  editor.tenant.value = {
    ...editor.tenant.value,
    domain: domain.value,
    settings: {
      ...settings,
      logoUrl: logoUrl.value,
      aboutText: aboutText.value,
      address: address.value,
      city: city.value,
      postcode: postcode.value,
      phone: phone.value,
      email: email.value,
      facebook: facebook.value,
      instagram: instagram.value,
      youtube: youtube.value
    },
    navItems: activeNavItems,
    allNavItems: editor.navItemsDraft.value,
    footerLinks: activeFooterLinks,
    allFooterLinks: editor.footerLinksDraft.value
  }
}

function removeLogo() {
  logoUrl.value = ''
}

function addNavItem() {
  editor.addNavItem()
  activeNavIndex.value = editor.navItemsDraft.value.length - 1
}

function removeNavItem(index: number) {
  editor.removeNavItem(index)
  activeNavIndex.value = Math.max(0, Math.min(activeNavIndex.value, editor.navItemsDraft.value.length - 1))
}

function moveNavItem(index: number, direction: -1 | 1) {
  editor.moveNavItem(index, direction)
  activeNavIndex.value = index + direction
}

function addFooterLink() {
  editor.addFooterLink()
  activeFooterIndex.value = editor.footerLinksDraft.value.length - 1
}

function removeFooterLink(index: number) {
  editor.removeFooterLink(index)
  activeFooterIndex.value = Math.max(0, Math.min(activeFooterIndex.value, editor.footerLinksDraft.value.length - 1))
}

function moveFooterLink(index: number, direction: -1 | 1) {
  editor.moveFooterLink(index, direction)
  activeFooterIndex.value = index + direction
}

watch(
  [() => editor.settingsDraft.value, () => editor.navItemsDraft.value, () => editor.footerLinksDraft.value],
  syncPreviewChrome,
  { deep: true }
)

watch(
  () => editor.navItemsDraft.value.length,
  length => {
    if (!length) {
      activeNavIndex.value = 0
      return
    }

    activeNavIndex.value = Math.min(activeNavIndex.value, length - 1)
  }
)

watch(
  () => editor.footerLinksDraft.value.length,
  length => {
    if (!length) {
      activeFooterIndex.value = 0
      return
    }

    activeFooterIndex.value = Math.min(activeFooterIndex.value, length - 1)
  }
)
</script>

<template>
  <div class="settings-panel-shell">
    <div
      v-if="currentPanel !== 'root'"
      class="mb-4 flex items-center gap-2"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-chevron-left"
        aria-label="Back"
        @click="goBack"
      />
      <h2 class="truncate text-sm font-semibold text-default">
        {{ panelTitle }}
      </h2>
    </div>

    <Transition
      :name="transitionName"
      mode="out-in"
    >
      <section
        v-if="currentPanel === 'root'"
        key="root"
        class="grid gap-2"
      >
        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('header')"
        >
          <span class="i-lucide-panel-top size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Header</span>
            <span class="block truncate text-xs text-muted">Logo and navigation links</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('domain')"
        >
          <span class="i-lucide-globe size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Domain</span>
            <span class="block truncate text-xs text-muted">{{ domain || `${editor.tenant.value?.slug}.msaas.test` }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('footer')"
        >
          <span class="i-lucide-panel-bottom size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Footer</span>
            <span class="block truncate text-xs text-muted">Description, contact, social, and links</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>
      </section>

      <section
        v-else-if="currentPanel === 'header'"
        key="header"
        class="grid gap-4"
      >
        <div class="grid gap-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-xs font-semibold uppercase text-muted">
              Logo
            </h3>

            <UTooltip text="Templates decide placement and shape; this only changes the mosque mark.">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-info"
                aria-label="Logo help"
              />
            </UTooltip>
          </div>

          <UFormField label="Logo">
            <ImagePicker
              v-model="logoUrl"
              :tenant-id="tenantId"
            />
          </UFormField>

          <div class="flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              label="Remove logo"
              :disabled="!logoUrl"
              @click="removeLogo"
            />
          </div>
        </div>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('navigation')"
        >
          <span class="i-lucide-menu size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Navigation</span>
            <span class="block truncate text-xs text-muted">{{ editor.navItemsDraft.value.length }} menu links</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>
      </section>

      <section
        v-else-if="currentPanel === 'domain'"
        key="domain"
        class="grid gap-3"
      >
        <UFormField label="Subdomain">
          <UInput
            :model-value="`${editor.tenant.value?.slug}.msaas.test`"
            readonly
            icon="i-lucide-globe"
          />
        </UFormField>

        <UFormField label="Custom domain">
          <UInput
            v-model="domain"
            icon="i-lucide-link"
            placeholder="www.example-mosque.org"
          />
        </UFormField>
      </section>

      <section
        v-else-if="currentPanel === 'navigation'"
        key="navigation"
        class="grid gap-3"
      >
        <div class="flex justify-end">
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            icon="i-lucide-plus"
            label="Add link"
            @click="addNavItem"
          />
        </div>

        <div class="grid gap-2">
          <div
            v-for="(item, index) in editor.navItemsDraft.value"
            :key="item.id ?? `new-${index}`"
            class="flex items-center gap-2 rounded-md border p-2 transition"
            :class="index === activeNavIndex ? 'border-primary bg-primary/10' : 'border-muted bg-default'"
          >
            <button
              type="button"
              class="grid min-w-0 flex-1 gap-0.5 text-left"
              @click="activeNavIndex = index"
            >
              <span class="truncate text-sm font-medium text-default">{{ item.label || 'Untitled link' }}</span>
              <span class="truncate text-xs text-muted">{{ item.href || 'No link set' }}</span>
            </button>

            <USwitch
              v-model="item.isActive"
              aria-label="Show in menu"
            />
          </div>
        </div>

        <div
          v-if="activeNavItem"
          class="grid gap-3 rounded-md border border-muted bg-default p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <h3 class="truncate text-xs font-semibold uppercase text-muted">
              Edit selected link
            </h3>

            <div class="flex shrink-0 items-center gap-1">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-arrow-up"
                aria-label="Move link up"
                :disabled="activeNavIndex === 0"
                @click="moveNavItem(activeNavIndex, -1)"
              />
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-arrow-down"
                aria-label="Move link down"
                :disabled="activeNavIndex === editor.navItemsDraft.value.length - 1"
                @click="moveNavItem(activeNavIndex, 1)"
              />
              <UButton
                color="error"
                variant="ghost"
                size="xs"
                icon="i-lucide-trash-2"
                aria-label="Remove link"
                @click="removeNavItem(activeNavIndex)"
              />
            </div>
          </div>

          <UFormField label="Label">
            <UInput
              v-model="activeNavItem.label"
              aria-label="Navigation label"
            />
          </UFormField>

          <UFormField label="Link">
            <UInput
              v-model="activeNavItem.href"
              aria-label="Navigation URL"
            />
          </UFormField>

          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="anchor in anchorSuggestions"
              :key="`nav-${activeNavIndex}-${anchor.href}`"
              color="neutral"
              variant="ghost"
              size="xs"
              :label="anchor.label"
              @click="activeNavItem.href = anchor.href"
            />
          </div>
        </div>
      </section>

      <section
        v-else-if="currentPanel === 'footer'"
        key="footer"
        class="grid gap-2"
      >
        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('footerDescription')"
        >
          <span class="i-lucide-align-left size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Description</span>
            <span class="block truncate text-xs text-muted">{{ aboutText || 'No footer description set' }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('footerContact')"
        >
          <span class="i-lucide-address-book size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Contact details</span>
            <span class="block truncate text-xs text-muted">{{ email || phone || address || 'Address, email, and phone' }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('footerSocial')"
        >
          <span class="i-lucide-share-2 size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Social links</span>
            <span class="block truncate text-xs text-muted">{{ facebook || instagram || youtube || 'Facebook, Instagram, and YouTube' }}</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <button
          type="button"
          class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-muted bg-default p-3 text-left transition hover:border-primary"
          @click="openPanel('footerLinks')"
        >
          <span class="i-lucide-list size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-default">Footer links</span>
            <span class="block truncate text-xs text-muted">{{ editor.footerLinksDraft.value.length }} footer links</span>
          </span>
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-muted"
          />
        </button>
      </section>

      <section
        v-else-if="currentPanel === 'footerDescription'"
        key="footerDescription"
        class="grid gap-3"
      >
        <UFormField label="Footer description">
          <UTextarea
            v-model="aboutText"
            :rows="4"
            placeholder="A short description of your mosque and community."
          />
        </UFormField>
      </section>

      <section
        v-else-if="currentPanel === 'footerContact'"
        key="footerContact"
        class="grid gap-3"
      >
        <UFormField label="Address">
          <UInput
            v-model="address"
            icon="i-lucide-map-pin"
            placeholder="14 Crescent Road"
          />
        </UFormField>

        <div class="grid gap-3 sm:grid-cols-2">
          <UFormField label="City">
            <UInput
              v-model="city"
              placeholder="London"
            />
          </UFormField>

          <UFormField label="Postcode">
            <UInput
              v-model="postcode"
              placeholder="E12 6AA"
            />
          </UFormField>
        </div>

        <UFormField label="Email">
          <UInput
            v-model="email"
            icon="i-lucide-mail"
            placeholder="info@example.org"
          />
        </UFormField>

        <UFormField label="Phone">
          <UInput
            v-model="phone"
            icon="i-lucide-phone"
            placeholder="+44 20 7946 1010"
          />
        </UFormField>
      </section>

      <section
        v-else-if="currentPanel === 'footerSocial'"
        key="footerSocial"
        class="grid gap-3"
      >
        <UFormField label="Facebook">
          <UInput
            v-model="facebook"
            icon="i-lucide-facebook"
            placeholder="https://facebook.com/your-mosque"
          />
        </UFormField>

        <UFormField label="Instagram">
          <UInput
            v-model="instagram"
            icon="i-lucide-instagram"
            placeholder="https://instagram.com/your-mosque"
          />
        </UFormField>

        <UFormField label="YouTube">
          <UInput
            v-model="youtube"
            icon="i-lucide-youtube"
            placeholder="https://youtube.com/@your-mosque"
          />
        </UFormField>
      </section>

      <section
        v-else
        key="footerLinks"
        class="grid gap-3"
      >
        <div class="flex justify-end">
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            icon="i-lucide-plus"
            label="Add link"
            @click="addFooterLink"
          />
        </div>

        <div class="grid gap-2">
          <div
            v-for="(item, index) in editor.footerLinksDraft.value"
            :key="item.id ?? `new-footer-${index}`"
            class="flex items-center gap-2 rounded-md border p-2 transition"
            :class="index === activeFooterIndex ? 'border-primary bg-primary/10' : 'border-muted bg-default'"
          >
            <button
              type="button"
              class="grid min-w-0 flex-1 gap-0.5 text-left"
              @click="activeFooterIndex = index"
            >
              <span class="truncate text-sm font-medium text-default">{{ item.label || 'Untitled link' }}</span>
              <span class="truncate text-xs text-muted">{{ item.href || 'No link set' }}</span>
            </button>

            <USwitch
              v-model="item.isActive"
              aria-label="Show in footer"
            />
          </div>
        </div>

        <div
          v-if="activeFooterLink"
          class="grid gap-3 rounded-md border border-muted bg-default p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <h3 class="truncate text-xs font-semibold uppercase text-muted">
              Edit selected footer link
            </h3>

            <div class="flex shrink-0 items-center gap-1">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-arrow-up"
                aria-label="Move footer link up"
                :disabled="activeFooterIndex === 0"
                @click="moveFooterLink(activeFooterIndex, -1)"
              />
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-arrow-down"
                aria-label="Move footer link down"
                :disabled="activeFooterIndex === editor.footerLinksDraft.value.length - 1"
                @click="moveFooterLink(activeFooterIndex, 1)"
              />
              <UButton
                color="error"
                variant="ghost"
                size="xs"
                icon="i-lucide-trash-2"
                aria-label="Remove footer link"
                @click="removeFooterLink(activeFooterIndex)"
              />
            </div>
          </div>

          <UFormField label="Label">
            <UInput
              v-model="activeFooterLink.label"
              aria-label="Footer link label"
            />
          </UFormField>

          <UFormField label="Link">
            <UInput
              v-model="activeFooterLink.href"
              aria-label="Footer link URL"
            />
          </UFormField>

          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="anchor in anchorSuggestions"
              :key="`footer-${activeFooterIndex}-${anchor.href}`"
              color="neutral"
              variant="ghost"
              size="xs"
              :label="anchor.label"
              @click="activeFooterLink.href = anchor.href"
            />
          </div>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.settings-panel-shell {
  max-width: 100%;
  overflow: hidden;
}

.settings-slide-forward-enter-active,
.settings-slide-forward-leave-active,
.settings-slide-back-enter-active,
.settings-slide-back-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.settings-slide-forward-enter-from,
.settings-slide-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.settings-slide-forward-leave-to,
.settings-slide-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
