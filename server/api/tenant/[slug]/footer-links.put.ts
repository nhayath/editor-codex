import { prisma } from '~~/server/utils/db'
import { buildHomepageConfigResponse, getTenantOrThrow } from '~~/server/utils/tenant-data'

interface FooterLinkInput {
  id?: string
  label?: string
  href?: string
  isActive?: boolean
}

function normaliseFooterLink(item: FooterLinkInput, index: number) {
  const label = typeof item.label === 'string' ? item.label.trim() : ''
  const href = typeof item.href === 'string' ? item.href.trim() : ''

  if (!label || !href) {
    throw createError({
      statusCode: 400,
      statusMessage: `Footer link ${index + 1} needs a label and link`
    })
  }

  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : undefined,
    label,
    href,
    order: index,
    isActive: item.isActive !== false
  }
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  const body = await readBody<{ items?: FooterLinkInput[] } | FooterLinkInput[]>(event)
  const rawItems = Array.isArray(body) ? body : body.items

  if (!Array.isArray(rawItems)) {
    throw createError({ statusCode: 400, statusMessage: 'Footer links must be an array' })
  }

  const tenant = await getTenantOrThrow(slug)
  const items = rawItems.map(normaliseFooterLink)
  const existingItems = await prisma.footerLink.findMany({ where: { tenantId: tenant.id } })
  const existingIds = new Set(existingItems.map(item => item.id))
  const incomingExistingIds = items
    .map(item => item.id)
    .filter((id): id is string => Boolean(id))

  const invalidId = incomingExistingIds.find(id => !existingIds.has(id))
  if (invalidId) {
    throw createError({ statusCode: 400, statusMessage: 'Footer link does not belong to this tenant' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.footerLink.deleteMany({
      where: {
        tenantId: tenant.id,
        id: { notIn: incomingExistingIds }
      }
    })

    for (const item of items) {
      if (item.id) {
        await tx.footerLink.update({
          where: { id: item.id },
          data: {
            label: item.label,
            href: item.href,
            order: item.order,
            isActive: item.isActive
          }
        })
      } else {
        await tx.footerLink.create({
          data: {
            tenantId: tenant.id,
            label: item.label,
            href: item.href,
            order: item.order,
            isActive: item.isActive
          }
        })
      }
    }
  })

  return buildHomepageConfigResponse(slug)
})
