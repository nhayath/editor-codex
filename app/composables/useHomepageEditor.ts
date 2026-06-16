import type { HomepageConfigDraft, ResolvedSection, TemplateDefinition } from '~~/types/template'
import type { HomepageConfigResponse } from '~~/types/editor'
import { normaliseDraft, resolveSections } from '~~/utils/homepage'

function cloneDraft(draft: HomepageConfigDraft): HomepageConfigDraft {
  return JSON.parse(JSON.stringify(draft)) as HomepageConfigDraft
}

export function useHomepageEditor() {
  const tenant = useState<Record<string, unknown> | null>('editorTenant', () => null)
  const template = useState<TemplateDefinition | null>('editorTemplate', () => null)
  const availableTemplates = useState<TemplateDefinition[]>('editorTemplates', () => [])
  const siteData = useState<Record<string, unknown>>('editorSiteData', () => ({}))
  const originalConfig = useState<HomepageConfigDraft | null>('editorOriginalConfig', () => null)
  const draft = useState<HomepageConfigDraft | null>('editorDraft', () => null)
  const activeSectionId = useState<string | null>('editorActiveSectionId', () => null)
  const activeTab = useState<'theme' | 'sections' | 'settings'>('editorActiveTab', () => 'theme')
  const previewDevice = useState<'desktop' | 'tablet' | 'mobile'>('editorPreviewDevice', () => 'desktop')
  const loading = useState('editorLoading', () => false)
  const saving = useState('editorSaving', () => false)
  const lastSavedAt = useState<string | null>('editorLastSavedAt', () => null)

  const resolvedSections = computed<ResolvedSection[]>(() => {
    if (!template.value || !draft.value) return []
    return resolveSections(template.value, draft.value)
  })

  const isDirty = computed(() => {
    if (!originalConfig.value || !draft.value) return false
    return JSON.stringify(originalConfig.value) !== JSON.stringify(draft.value)
  })

  async function loadConfig(slug: string) {
    loading.value = true

    try {
      const [payload, templates] = await Promise.all([
        $fetch<HomepageConfigResponse>(`/api/tenant/${slug}/config`),
        $fetch<TemplateDefinition[]>('/api/templates')
      ])

      tenant.value = payload.tenant
      template.value = payload.template
      siteData.value = payload.data
      availableTemplates.value = templates
      originalConfig.value = cloneDraft(payload.config)
      draft.value = cloneDraft(payload.config)
      activeSectionId.value = payload.resolvedSections[0]?.id ?? null
      lastSavedAt.value = new Date().toISOString()
    } finally {
      loading.value = false
    }
  }

  async function saveConfig() {
    if (!draft.value || !tenant.value?.slug) return

    saving.value = true
    try {
      const payload = await $fetch<HomepageConfigResponse>(`/api/tenant/${tenant.value.slug}/config`, {
        method: 'PUT',
        body: draft.value
      })

      tenant.value = payload.tenant
      template.value = payload.template
      siteData.value = payload.data
      originalConfig.value = cloneDraft(payload.config)
      draft.value = cloneDraft(payload.config)
      lastSavedAt.value = new Date().toISOString()
    } finally {
      saving.value = false
    }
  }

  function updateSectionProps(sectionId: string, props: Record<string, unknown>) {
    if (!draft.value) return

    draft.value.sectionOverrides[sectionId] = {
      ...(draft.value.sectionOverrides[sectionId] ?? {}),
      props: {
        ...(draft.value.sectionOverrides[sectionId]?.props ?? {}),
        ...props
      }
    }
  }

  function updateGroupProps(sectionId: string, groupProps: Record<string, unknown>) {
    if (!draft.value) return

    draft.value.sectionOverrides[sectionId] = {
      ...(draft.value.sectionOverrides[sectionId] ?? {}),
      groupProps: {
        ...(draft.value.sectionOverrides[sectionId]?.groupProps ?? {}),
        ...groupProps
      }
    }
  }

  function updateGroupWidgetProps(sectionId: string, slot: string, props: Record<string, unknown>) {
    if (!draft.value) return

    const override = draft.value.sectionOverrides[sectionId] ?? {}
    draft.value.sectionOverrides[sectionId] = {
      ...override,
      widgets: {
        ...(override.widgets ?? {}),
        [slot]: {
          props: {
            ...(override.widgets?.[slot]?.props ?? {}),
            ...props
          }
        }
      }
    }
  }

  function toggleSection(sectionId: string, enabled: boolean) {
    if (!draft.value || !template.value) return

    const section = template.value.sections.find(item => item.id === sectionId)
    draft.value.sectionsEnabled[sectionId] = section?.required ? true : enabled
  }

  function reorderSections(newOrder: string[]) {
    if (!draft.value || !template.value) return

    const validIds = new Set(template.value.sections.map(section => section.id))
    draft.value.sectionOrder = newOrder.filter(id => validIds.has(id))
  }

  function setTemplate(templateId: string) {
    const nextTemplate = availableTemplates.value.find(item => item.id === templateId)
    if (!nextTemplate) return

    template.value = nextTemplate
    draft.value = normaliseDraft(nextTemplate, {
      templateId,
      paletteId: nextTemplate.defaultPaletteId ?? draft.value?.paletteId,
      fontPairId: nextTemplate.defaultFontPairId ?? draft.value?.fontPairId,
      customColors: draft.value?.customColors ?? null
    })
    activeSectionId.value = draft.value.sectionOrder[0] ?? null
  }

  function setPalette(paletteId: string) {
    if (!draft.value) return
    draft.value.paletteId = paletteId
  }

  function setFontPair(fontPairId: string) {
    if (!draft.value) return
    draft.value.fontPairId = fontPairId
  }

  return {
    tenant,
    template,
    availableTemplates,
    siteData,
    originalConfig,
    draft,
    resolvedSections,
    isDirty,
    activeSectionId,
    activeTab,
    previewDevice,
    loading,
    saving,
    lastSavedAt,
    loadConfig,
    saveConfig,
    updateSectionProps,
    updateGroupProps,
    updateGroupWidgetProps,
    toggleSection,
    reorderSections,
    setTemplate,
    setPalette,
    setFontPair
  }
}
