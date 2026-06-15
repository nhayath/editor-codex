import { getTenantContentData, getTenantOrThrow } from '~~/server/utils/tenant-data'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  const tenant = await getTenantOrThrow(slug)
  const data = await getTenantContentData(tenant.id)
  return data.prayerTimes
})
