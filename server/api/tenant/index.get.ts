import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  return prisma.tenant.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      domain: true,
      status: true,
      settings: true,
      homepageConfig: true
    }
  })
})
