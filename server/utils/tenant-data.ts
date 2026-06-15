import { createError } from 'h3'
import { prisma } from './db'
import { getTemplateDefinition } from '~~/templates'
import { buildDraftFromDatabase, normaliseDraft, resolveSections, serialiseDraftForDatabase } from '~~/utils/homepage'
import type { HomepageConfigDraft } from '~~/types/template'

export async function getTenantOrThrow(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      settings: true,
      homepageConfig: true,
      navItems: { where: { isActive: true }, orderBy: { order: 'asc' } }
    }
  })

  if (!tenant) {
    throw createError({ statusCode: 404, statusMessage: 'Tenant not found' })
  }

  return tenant
}

export async function getTenantContentData(tenantId: string) {
  const today = new Date().toISOString().slice(0, 10)
  const prayerTimes = await prisma.prayerTime.findFirst({
    where: { tenantId, date: { gte: today } },
    orderBy: { date: 'asc' }
  }) ?? await prisma.prayerTime.findFirst({
    where: { tenantId },
    orderBy: { date: 'asc' }
  })

  const [jummahTimes, events, announcements, donations] = await Promise.all([
    prisma.jummahTime.findMany({ where: { tenantId }, orderBy: { time: 'asc' } }),
    prisma.event.findMany({ where: { tenantId, status: 'PUBLISHED' }, orderBy: { date: 'asc' } }),
    prisma.announcement.findMany({
      where: { tenantId, status: 'PUBLISHED' },
      orderBy: [{ isPinned: 'desc' }, { priority: 'asc' }]
    }),
    prisma.donationCampaign.findMany({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }]
    })
  ])

  return {
    prayerTimes,
    jummahTimes,
    events,
    announcements,
    donations
  }
}

export async function buildHomepageConfigResponse(slug: string) {
  const tenant = await getTenantOrThrow(slug)
  const template = getTemplateDefinition(tenant.homepageConfig?.templateId ?? 'classic')
  const config = buildDraftFromDatabase(tenant.homepageConfig)
  const data = await getTenantContentData(tenant.id)

  return {
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain,
      status: tenant.status,
      settings: tenant.settings,
      navItems: tenant.navItems
    },
    template,
    config,
    resolvedSections: resolveSections(template, config),
    data: {
      ...data,
      settings: tenant.settings,
      navItems: tenant.navItems
    }
  }
}

export async function saveHomepageConfig(slug: string, body: Partial<HomepageConfigDraft>) {
  const tenant = await getTenantOrThrow(slug)
  const template = getTemplateDefinition(body.templateId ?? tenant.homepageConfig?.templateId ?? 'classic')
  const current = buildDraftFromDatabase(tenant.homepageConfig)
  const draft = normaliseDraft(template, {
    ...current,
    ...body,
    templateId: template.id,
    sectionOverrides: body.sectionOverrides ?? current.sectionOverrides,
    sectionsEnabled: body.sectionsEnabled ?? current.sectionsEnabled,
    sectionOrder: body.sectionOrder ?? current.sectionOrder
  })

  const data = serialiseDraftForDatabase(draft)

  await prisma.homepageConfig.upsert({
    where: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      ...data
    },
    update: data
  })

  return buildHomepageConfigResponse(slug)
}
