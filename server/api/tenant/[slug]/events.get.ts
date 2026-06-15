import { prisma } from '~~/server/utils/db'
import { getTenantOrThrow } from '~~/server/utils/tenant-data'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  const tenant = await getTenantOrThrow(slug)
  return prisma.event.findMany({ where: { tenantId: tenant.id, status: 'PUBLISHED' }, orderBy: { date: 'asc' } })
})
