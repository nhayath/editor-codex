import { prisma } from '~~/server/utils/db'
import { buildHomepageConfigResponse, getTenantOrThrow } from '~~/server/utils/tenant-data'

const editableSettingKeys = [
  'logoUrl',
  'faviconUrl',
  'address',
  'city',
  'postcode',
  'country',
  'phone',
  'email',
  'aboutText',
  'facebook',
  'instagram',
  'youtube',
  'timezone'
] as const

type EditableSettingKey = typeof editableSettingKeys[number]

function normaliseOptionalString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant slug' })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const tenant = await getTenantOrThrow(slug)

  const settingsData: Partial<Record<EditableSettingKey, string | null>> = {}

  for (const key of editableSettingKeys) {
    if (key in body) {
      settingsData[key] = normaliseOptionalString(body[key])
    }
  }

  const domain = normaliseOptionalString(body.domain)

  await prisma.$transaction(async (tx) => {
    if ('domain' in body) {
      await tx.tenant.update({
        where: { id: tenant.id },
        data: { domain }
      })
    }

    if (Object.keys(settingsData).length) {
      await tx.tenantSettings.upsert({
        where: { tenantId: tenant.id },
        create: {
          tenantId: tenant.id,
          ...settingsData
        },
        update: settingsData
      })
    }
  })

  return buildHomepageConfigResponse(slug)
})
