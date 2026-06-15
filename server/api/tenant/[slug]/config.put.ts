import { saveHomepageConfig } from '~~/server/utils/tenant-data'
import type { HomepageConfigDraft } from '~~/types/template'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  const body = await readBody<Partial<HomepageConfigDraft>>(event)

  return saveHomepageConfig(slug, body)
})
