import { getTemplateDefinition, templateMap } from '~~/templates'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !templateMap[id]) {
    throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  }

  return getTemplateDefinition(id)
})
