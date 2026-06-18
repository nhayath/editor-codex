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
  const focusedSectionId = useState<string | null>('editorFocusedSectionId', () => null)
  const recentlyAddedSectionId = useState<string | null>('editorRecentlyAddedSectionId', () => null)
  const recentlyEditedSectionId = useState<string | null>('editorRecentlyEditedSectionId', () => null)
  const previewScrollRequest = useState<{ sectionId: string, nonce: number } | null>('editorPreviewScrollRequest', () => null)
  const editorScrollRequest = useState<{ sectionId: string, nonce: number } | null>('editorSectionScrollRequest', () => null)
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
      focusedSectionId.value = null
      recentlyAddedSectionId.value = null
      recentlyEditedSectionId.value = null
      previewScrollRequest.value = null
      editorScrollRequest.value = null
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
      focusedSectionId.value = null
      recentlyAddedSectionId.value = null
      recentlyEditedSectionId.value = null
      previewScrollRequest.value = null
      editorScrollRequest.value = null
      lastSavedAt.value = new Date().toISOString()
    } finally {
      saving.value = false
    }
  }

  function updateSectionProps(sectionId: string, props: Record<string, unknown>) {
    if (!draft.value) return

    markSectionEdited(sectionId)
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

    markSectionEdited(sectionId)
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

    markSectionEdited(sectionId)
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

    const templateIds = template.value.sections.map(section => section.id)
    const customIds = Object.entries(draft.value.sectionOverrides)
      .filter(([, override]) => Boolean(override.customWidgetId))
      .map(([id]) => id)
    const validIds = new Set([...templateIds, ...customIds])
    draft.value.sectionOrder = newOrder.filter(id => validIds.has(id))
  }

  function addWidgetSection(widgetId: string, title: string) {
    if (!draft.value) return

    const sectionId = `custom-${widgetId}-${Date.now().toString(36)}`
    draft.value.sectionOverrides[sectionId] = {
      customWidgetId: widgetId,
      customTitle: title
    }
    draft.value.sectionsEnabled[sectionId] = true
    draft.value.sectionOrder.push(sectionId)
    activeSectionId.value = sectionId
    focusedSectionId.value = sectionId
    recentlyAddedSectionId.value = sectionId
    activeTab.value = 'sections'
  }

  function removeSection(sectionId: string) {
    if (!draft.value || !template.value) return

    const templateSection = template.value.sections.find(section => section.id === sectionId)
    if (templateSection?.required) return

    draft.value.sectionOrder = draft.value.sectionOrder.filter(id => id !== sectionId)
    delete draft.value.sectionsEnabled[sectionId]
    delete draft.value.sectionOverrides[sectionId]

    if (activeSectionId.value === sectionId) {
      activeSectionId.value = draft.value.sectionOrder[0] ?? null
    }
    if (focusedSectionId.value === sectionId) {
      focusedSectionId.value = null
    }
    if (recentlyAddedSectionId.value === sectionId) {
      recentlyAddedSectionId.value = null
    }
    if (recentlyEditedSectionId.value === sectionId) {
      recentlyEditedSectionId.value = null
    }
    if (previewScrollRequest.value?.sectionId === sectionId) {
      previewScrollRequest.value = null
    }
    if (editorScrollRequest.value?.sectionId === sectionId) {
      editorScrollRequest.value = null
    }
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
    focusedSectionId.value = null
    recentlyAddedSectionId.value = null
    recentlyEditedSectionId.value = null
    previewScrollRequest.value = null
    editorScrollRequest.value = null
  }

  function setPalette(paletteId: string) {
    if (!draft.value) return
    draft.value.paletteId = paletteId
  }

  function setFontPair(fontPairId: string) {
    if (!draft.value) return
    draft.value.fontPairId = fontPairId
  }

  function focusSection(sectionId: string | null) {
    focusedSectionId.value = sectionId
  }

  function markSectionEdited(sectionId: string) {
    activeSectionId.value = sectionId
    focusedSectionId.value = sectionId
    recentlyEditedSectionId.value = sectionId
    activeTab.value = 'sections'
  }

  function requestPreviewScroll(sectionId: string) {
    previewScrollRequest.value = {
      sectionId,
      nonce: Date.now()
    }
  }

  function requestEditorScroll(sectionId: string) {
    editorScrollRequest.value = {
      sectionId,
      nonce: Date.now()
    }
  }

  function openSectionEditor(sectionId: string) {
    activeTab.value = 'sections'
    activeSectionId.value = sectionId
    focusedSectionId.value = sectionId
    requestEditorScroll(sectionId)
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
    focusedSectionId,
    recentlyAddedSectionId,
    recentlyEditedSectionId,
    previewScrollRequest,
    editorScrollRequest,
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
    addWidgetSection,
    removeSection,
    setTemplate,
    setPalette,
    setFontPair,
    focusSection,
    markSectionEdited,
    requestPreviewScroll,
    requestEditorScroll,
    openSectionEditor
  }
}
