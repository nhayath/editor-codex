import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const tenantId = getRouterParam(event, 'tenantId')

  if (!tenantId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant id' })
  }

  return prisma.mediaAsset.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })
})
