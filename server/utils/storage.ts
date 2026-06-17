import { mkdir, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'
import { randomUUID } from 'node:crypto'

export const uploadRoot = join(process.cwd(), 'public', 'uploads')

export function sanitizeFilename(filename: string) {
  const parsed = parse(filename)
  const base = parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const ext = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, '')
  return `${base || 'upload'}-${randomUUID()}${ext}`
}

export async function saveUploadBuffer(tenantId: string, filename: string, buffer: Buffer) {
  const safeTenantId = tenantId.replace(/[^a-zA-Z0-9_-]/g, '')
  const safeFilename = sanitizeFilename(filename)
  const tenantDir = join(uploadRoot, safeTenantId)

  await mkdir(tenantDir, { recursive: true })
  await writeFile(join(tenantDir, safeFilename), buffer)

  return {
    filename: safeFilename,
    url: `/uploads/${safeTenantId}/${safeFilename}`
  }
}
