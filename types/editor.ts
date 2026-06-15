import type { TemplateDefinition, HomepageConfigDraft, ResolvedSection } from './template'

export interface TenantSummary {
  id: string
  name: string
  slug: string
  domain?: string | null
  status: string
}

export interface HomepageConfigResponse {
  tenant: Record<string, unknown>
  template: TemplateDefinition
  config: HomepageConfigDraft
  resolvedSections: ResolvedSection[]
  data: Record<string, unknown>
}
