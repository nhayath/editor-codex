import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { sendStream } from 'h3'
import { uploadRoot } from '~~/server/utils/storage'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
}

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({ statusCode: 404, statusMessage: 'Upload not found' })
  }

  const root = resolve(uploadRoot)
  const filePath = resolve(root, path)

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid upload path' })
  }

  const file = await stat(filePath).catch(() => null)

  if (!file?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Upload not found' })
  }

  const contentType = contentTypes[extname(filePath).toLowerCase()]
  if (contentType) setHeader(event, 'content-type', contentType)
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')

  return sendStream(event, createReadStream(filePath))
})
