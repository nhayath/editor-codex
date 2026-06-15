import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const host = getRequestHost(event).split(':')[0] ?? ''

  if (!host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
    return
  }

  const subdomain = host.split('.')[0]

  if (!subdomain || ['www'].includes(subdomain)) {
    return
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug: subdomain },
        { domain: host }
      ]
    },
    select: { id: true, slug: true, name: true }
  })

  if (tenant) {
    event.context.tenant = tenant
  }
})
