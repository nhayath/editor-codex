import type { AnnouncementBarConfig, HomepageConfigDraft, ResolvedSection, SectionOverride, TemplateDefinition, TemplateSectionDef } from '~~/types/template'
import type { WidgetDefinition, WidgetPropSchema } from '~~/types/widget'
import { getTemplateDefinition } from '~~/templates'
import { getWidgetDefinition } from '~~/widgets'

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function stringifyJsonField(value: unknown) {
  return JSON.stringify(value ?? {})
}

function schemaDefaults(schema: WidgetPropSchema[] = []) {
  return Object.fromEntries(schema.map(field => [field.key, field.default]))
}

function mergePropSchema(base: WidgetPropSchema[] = [], override: WidgetPropSchema[] = []) {
  const overrideByKey = new Map(override.map(field => [field.key, field]))
  const baseKeys = new Set(base.map(field => field.key))

  return [
    ...base.map(field => overrideByKey.get(field.key) ?? field),
    ...override.filter(field => !baseKeys.has(field.key))
  ]
}

function isCustomSection(sectionId: string, overrides: Record<string, SectionOverride>) {
  return Boolean(overrides[sectionId]?.customWidgetId)
}

export function resolveWidgetDefinition(template: TemplateDefinition, widgetId: string): WidgetDefinition | undefined {
  const base = getWidgetDefinition(widgetId)
  const override = template.widgets?.[widgetId]

  if (!base && !override) return undefined

  if (!base) {
    return {
      id: widgetId,
      name: override?.name ?? widgetId,
      icon: override?.icon ?? 'i-lucide-box',
      description: override?.description ?? '',
      category: override?.category ?? 'content',
      variants: override?.variants,
      propSchema: override?.propSchema ?? [],
      dataDependencies: override?.dataDependencies,
      component: override?.component ?? ''
    }
  }

  if (!override) return base

  return {
    ...base,
    ...override,
    id: widgetId,
    propSchema: mergePropSchema(base.propSchema, override.propSchema)
  }
}

function getSectionDefaultProps(section: TemplateSectionDef, widget?: WidgetDefinition) {
  return {
    ...schemaDefaults(widget?.propSchema),
    ...(section.defaultProps ?? {})
  }
}

export function defaultSectionOrder(template: TemplateDefinition) {
  return template.sections.map(section => section.id)
}

export function defaultSectionsEnabled(template: TemplateDefinition) {
  return Object.fromEntries(template.sections.map(section => [section.id, true]))
}

export function normaliseDraft(template: TemplateDefinition, partial: Partial<HomepageConfigDraft> = {}): HomepageConfigDraft {
  const templateIds = template.sections.map(section => section.id)
  const templateIdSet = new Set(templateIds)
  const sectionOverrides = partial.sectionOverrides ?? {}
  const providedOrder = partial.sectionOrder?.filter(id => templateIdSet.has(id) || isCustomSection(id, sectionOverrides)) ?? []
  const sectionOrder = [
    ...providedOrder,
    ...templateIds.filter(id => !providedOrder.includes(id))
  ]

  const sectionsEnabled = defaultSectionsEnabled(template)
  for (const section of template.sections) {
    const requested = partial.sectionsEnabled?.[section.id]
    sectionsEnabled[section.id] = section.required ? true : requested ?? true
  }
  for (const sectionId of sectionOrder) {
    if (!templateIdSet.has(sectionId) && isCustomSection(sectionId, sectionOverrides)) {
      sectionsEnabled[sectionId] = partial.sectionsEnabled?.[sectionId] ?? true
    }
  }

  return {
    templateId: partial.templateId ?? template.id,
    paletteId: partial.paletteId ?? template.defaultPaletteId ?? 'emerald',
    fontPairId: partial.fontPairId ?? template.defaultFontPairId ?? 'inter-amiri',
    customColors: partial.customColors ?? null,
    sectionOrder,
    sectionsEnabled,
    sectionOverrides,
    announcementBar: partial.announcementBar ?? null
  }
}

export function buildDraftFromDatabase(config?: {
  templateId?: string
  paletteId?: string
  fontPairId?: string
  customColors?: string | null
  sectionOrder?: string
  sectionsEnabled?: string
  sectionOverrides?: string
  announcementBar?: string | null
} | null) {
  const template = getTemplateDefinition(config?.templateId ?? 'classic')

  return normaliseDraft(template, {
    templateId: template.id,
    paletteId: config?.paletteId,
    fontPairId: config?.fontPairId,
    customColors: parseJsonField<Record<string, string> | null>(config?.customColors, null),
    sectionOrder: parseJsonField<string[]>(config?.sectionOrder, []),
    sectionsEnabled: parseJsonField<Record<string, boolean>>(config?.sectionsEnabled, {}),
    sectionOverrides: parseJsonField<Record<string, SectionOverride>>(config?.sectionOverrides, {}),
    announcementBar: parseJsonField<AnnouncementBarConfig | null>(config?.announcementBar, null)
  })
}

export function serialiseDraftForDatabase(draft: HomepageConfigDraft) {
  const template = getTemplateDefinition(draft.templateId)
  const normalised = normaliseDraft(template, draft)

  return {
    templateId: normalised.templateId,
    paletteId: normalised.paletteId,
    fontPairId: normalised.fontPairId,
    customColors: normalised.customColors ? stringifyJsonField(normalised.customColors) : null,
    sectionOrder: stringifyJsonField(normalised.sectionOrder),
    sectionsEnabled: stringifyJsonField(normalised.sectionsEnabled),
    sectionOverrides: stringifyJsonField(normalised.sectionOverrides),
    announcementBar: normalised.announcementBar ? stringifyJsonField(normalised.announcementBar) : null
  }
}

export function resolveSections(template: TemplateDefinition, draft: HomepageConfigDraft): ResolvedSection[] {
  const sectionMap = new Map(template.sections.map(section => [section.id, section]))
  const orderedSections = draft.sectionOrder
    .map((id) => {
      const templateSection = sectionMap.get(id)
      if (templateSection) return templateSection

      const override = draft.sectionOverrides[id]
      if (!override?.customWidgetId) return undefined

      return {
        id,
        title: override.customTitle,
        type: 'single',
        required: false,
        removable: true,
        widgetId: override.customWidgetId
      } satisfies TemplateSectionDef
    })
    .filter((section): section is TemplateSectionDef => Boolean(section))

  return orderedSections.map((section) => {
    const override = draft.sectionOverrides[section.id] ?? {}
    const enabled = section.required ? true : draft.sectionsEnabled[section.id] ?? true

    if (section.type === 'single' && section.widgetId) {
      const isCustomWidgetSection = Boolean(override.customWidgetId)
      const widget = isCustomWidgetSection
        ? getWidgetDefinition(section.widgetId)
        : resolveWidgetDefinition(template, section.widgetId)

      return {
        id: section.id,
        title: section.title ?? widget?.name,
        type: 'single',
        required: section.required,
        removable: section.removable,
        enabled,
        widgetId: section.widgetId,
        name: widget?.name,
        icon: widget?.icon,
        component: widget?.component,
        propSchema: widget?.propSchema ?? [],
        resolvedProps: {
          ...getSectionDefaultProps(section, widget),
          ...(override.props ?? {})
        }
      }
    }

    const groupProps = Object.fromEntries((section.group?.groupProps ?? []).map(prop => [prop.key, prop.default]))

    return {
      id: section.id,
      title: section.title,
      type: 'group',
      required: section.required,
      removable: section.removable,
      enabled,
      resolvedGroupProps: {
        layout: section.group?.layout ?? 'row',
        ...groupProps,
        ...(override.groupProps ?? {})
      },
      groupPropSchema: section.group?.groupProps ?? [],
      resolvedWidgets: section.group?.widgets.map((groupWidget) => {
        const widget = resolveWidgetDefinition(template, groupWidget.widgetId)
        const widgetOverride = override.widgets?.[groupWidget.slot]?.props ?? {}

        return {
          slot: groupWidget.slot,
          widgetId: groupWidget.widgetId,
          name: widget?.name,
          icon: widget?.icon,
          component: widget?.component,
          propSchema: widget?.propSchema ?? [],
          resolvedProps: {
            ...schemaDefaults(widget?.propSchema),
            ...(groupWidget.defaultProps ?? {}),
            ...widgetOverride
          }
        }
      }) ?? []
    }
  })
}
