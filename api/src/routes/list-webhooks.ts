import { db } from '@/db'
import { webhooks } from '@/db/schema'
import { desc, lt } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { z } from 'zod'

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks',
    {
      schema: {
        summary: 'List webhooks',
        tags: ['Webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          cursor: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              }),
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, cursor } = request.query

      const result = await db
        .select({
          id: webhooks.id,
          method: webhooks.method,
          pathname: webhooks.pathname,
          createdAt: webhooks.createdAt,
        })
        .from(webhooks)
        .where(cursor ? lt(webhooks.id, cursor) : undefined)
        .orderBy(desc(webhooks.id))
        .limit(limit + 1)

      const hasMoreRegisters = result.length > limit
      const items = hasMoreRegisters ? result.slice(0, limit) : result

      const nextCursor = hasMoreRegisters ? items[items.length - 1].id : null

      return reply.status(200).send({
        webhooks: items,
        nextCursor,
      })
    },
  )
}
