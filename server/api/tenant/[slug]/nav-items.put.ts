import { prisma } from '~~/server/utils/db'
import { buildHomepageConfigResponse, getTenantOrThrow } from '~~/server/utils/tenant-data'

interface NavItemInput {
  id?: string
  label?: string
  href?: string
  isActive?: boolean
}

function normaliseNavItem(item: NavItemInput, index: number) {
  const label = typeof item.label === 'string' ? item.label.trim() : ''
  const href = typeof item.href === 'string' ? item.href.trim() : ''

  if (!label || !href) {
    throw createError({
      statusCode: 400,
      statusMessage: `Navigation item ${index + 1} needs a label and link`
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

  const body = await readBody<{ items?: NavItemInput[] } | NavItemInput[]>(event)
  const rawItems = Array.isArray(body) ? body : body.items

  if (!Array.isArray(rawItems)) {
    throw createError({ statusCode: 400, statusMessage: 'Navigation items must be an array' })
  }

  const tenant = await getTenantOrThrow(slug)
  const items = rawItems.map(normaliseNavItem)
  const existingItems = await prisma.navItem.findMany({ where: { tenantId: tenant.id } })
  const existingIds = new Set(existingItems.map(item => item.id))
  const incomingExistingIds = items
    .map(item => item.id)
    .filter((id): id is string => Boolean(id))

  const invalidId = incomingExistingIds.find(id => !existingIds.has(id))
  if (invalidId) {
    throw createError({ statusCode: 400, statusMessage: 'Navigation item does not belong to this tenant' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.navItem.deleteMany({
      where: {
        tenantId: tenant.id,
        id: { notIn: incomingExistingIds }
      }
    })

    for (const item of items) {
      if (item.id) {
        await tx.navItem.update({
          where: { id: item.id },
          data: {
            label: item.label,
            href: item.href,
            order: item.order,
            isActive: item.isActive
          }
        })
      } else {
        await tx.navItem.create({
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
