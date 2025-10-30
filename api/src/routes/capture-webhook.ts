import { db } from '@/db'
import { webhooks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { z } from 'zod'

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  app.all(
    '/capture/*',
    {
      schema: {
        summary: 'Capture incoming webhook requests',
        tags: ['External'],
        response: {
          201: z.object({
            id: z.uuidv7(),
          }),
        },
      },
    },
    async (request, reply) => {
      const method = request.method
      const ip = request.ip
      const contentType = request.headers['content-type']
      const contentLength = request.headers['content-length']
        ? Number(request.headers['content-length'])
        : null

      let body: string | null = null

      if (request.body) {
        body =
          typeof request.body === 'string' ? request.body : String(request.body)
      }

      const pathname = new URL(request.url).pathname.replace('/capture', '')

      const headers = Object.fromEntries(
        Object.entries(request.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : value,
        ]),
      )
      const queryParams = request.query

      const result = await db
        .insert(webhooks)
        .values({
          contentLength,
          method,
          ip,
          contentType,
          pathname,
          body,
          headers,
          queryParams,
        })
        .returning()

      return reply.status(201).send(result[0])
    },
  )
}
