import { prisma } from '~~/server/utils/db'
import { getTenantOrThrow } from '~~/server/utils/tenant-data'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  const tenant = await getTenantOrThrow(slug)
  return prisma.donationCampaign.findMany({
    where: { tenantId: tenant.id, status: 'ACTIVE' },
    orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }]
  })
})
