import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { z} from 'zod'

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get('/app/webhooks',
    {
      schema: {
        summary: 'List webhooks',
        tags: ['Webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20)
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              method: z.string()
            })
          )
        }
      }
    },
    (request, reply) => {
      const { limit } = request.query

      return [
        {
          id: 'asdasdasd',
          method: 'GET'
        }
      ]
    })
}
