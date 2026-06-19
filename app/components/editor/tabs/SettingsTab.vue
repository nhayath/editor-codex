<script setup lang="ts">
const editor = useHomepageEditor()

const tenantId = computed(() => editor.tenant.value?.id as string | undefined)
const domain = computed({
  get: () => editor.settingsDraft.value?.domain ?? '',
  set: value => editor.updateSettingsDraft({ domain: value })
})
const logoUrl = computed({
  get: () => editor.settingsDraft.value?.logoUrl ?? '',
  set: value => editor.updateSettingsDraft({ logoUrl: value })
})

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

  editor.tenant.value = {
    ...editor.tenant.value,
    domain: domain.value,
    settings: {
      ...settings,
      logoUrl: logoUrl.value
    },
    navItems: activeNavItems,
    allNavItems: editor.navItemsDraft.value
  }
}

function removeLogo() {
  logoUrl.value = ''
}

watch(
  [() => editor.settingsDraft.value, () => editor.navItemsDraft.value],
  syncPreviewChrome,
  { deep: true }
)
</script>

<template>
  <div class="grid gap-6">
    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Brand
        </h2>
      </div>

      <UFormField
        label="Logo"
        description="Templates decide placement and shape; this only changes the mosque mark."
      >
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
    </section>

    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Domain
        </h2>
      </div>

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

    <section class="grid gap-3">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-default">
          Navigation
        </h2>

        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-plus"
          label="Add link"
          @click="editor.addNavItem"
        />
      </div>

      <div class="grid gap-2">
        <div
          v-for="(item, index) in editor.navItemsDraft.value"
          :key="item.id ?? `new-${index}`"
          class="grid gap-3 rounded-md border border-muted bg-default p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <UFormField
              class="min-w-0 flex-1"
              label="Label"
            >
              <UInput
                v-model="item.label"
                aria-label="Navigation label"
              />
            </UFormField>

            <div class="mt-6 flex shrink-0 items-center gap-1">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-arrow-up"
                aria-label="Move link up"
                :disabled="index === 0"
                @click="editor.moveNavItem(index, -1)"
              />
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-arrow-down"
                aria-label="Move link down"
                :disabled="index === editor.navItemsDraft.value.length - 1"
                @click="editor.moveNavItem(index, 1)"
              />
              <UButton
                color="error"
                variant="ghost"
                size="xs"
                icon="i-lucide-trash-2"
                aria-label="Remove link"
                @click="editor.removeNavItem(index)"
              />
            </div>
          </div>

          <UFormField label="Link">
            <UInput
              v-model="item.href"
              aria-label="Navigation URL"
            />
          </UFormField>

          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="anchor in anchorSuggestions"
              :key="`${index}-${anchor.href}`"
              color="neutral"
              variant="ghost"
              size="xs"
              :label="anchor.label"
              @click="item.href = anchor.href"
            />
          </div>

          <USwitch
            v-model="item.isActive"
            label="Show in menu"
          />
        </div>
      </div>
    </section>
  </div>
</template>
