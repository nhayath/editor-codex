import { readFile } from 'node:fs/promises'
import formidable, { type Fields, type Files, type Part } from 'formidable'
import { prisma } from '~~/server/utils/db'
import { saveUploadBuffer } from '~~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const form = formidable({
    multiples: false,
    maxFileSize: 8 * 1024 * 1024,
    filter: (part: Part) => part.mimetype?.startsWith('image/') ?? false
  })

  const { fields, files } = await new Promise<{
    fields: Fields
    files: Files
  }>((resolve, reject) => {
    form.parse(event.node.req, (error, fields, files) => {
      if (error) reject(error)
      else resolve({ fields, files })
    })
  })

  const tenantIdField = Array.isArray(fields.tenantId) ? fields.tenantId[0] : fields.tenantId
  const altField = Array.isArray(fields.alt) ? fields.alt[0] : fields.alt
  const fileField = Array.isArray(files.file) ? files.file[0] : files.file

  if (!tenantIdField || typeof tenantIdField !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing tenant id' })
  }

  if (!fileField) {
    throw createError({ statusCode: 400, statusMessage: 'Missing image file' })
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantIdField } })

  if (!tenant) {
    throw createError({ statusCode: 404, statusMessage: 'Tenant not found' })
  }

  const buffer = await readFile(fileField.filepath)
  const saved = await saveUploadBuffer(tenantIdField, fileField.originalFilename ?? 'upload', buffer)

  return prisma.mediaAsset.create({
    data: {
      tenantId: tenantIdField,
      filename: saved.filename,
      url: saved.url,
      mimeType: fileField.mimetype,
      size: fileField.size,
      alt: typeof altField === 'string' ? altField : null
    }
  })
})
