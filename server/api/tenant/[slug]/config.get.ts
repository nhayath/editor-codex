import { buildHomepageConfigResponse } from '~~/server/utils/tenant-data'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  return buildHomepageConfigResponse(slug)
})
