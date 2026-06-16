import type { TemplateDefinition } from '~~/types/template'
import { classicTemplate } from './classic'
import { modernTemplate } from './modern'
import { fattanTemplate } from './fattan'
import { noorTemplate } from './noor'

export const templates: TemplateDefinition[] = [
  classicTemplate,
  modernTemplate,
  fattanTemplate,
  noorTemplate
]

export const templateMap = Object.fromEntries(templates.map(template => [template.id, template])) as Record<string, TemplateDefinition>

export function getTemplateDefinition(id = 'classic') {
  return templateMap[id] ?? classicTemplate
}
