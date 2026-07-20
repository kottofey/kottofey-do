import { z } from 'zod';

// import { metaSchema } from '@/fastify/schemas/metaSchema';
import { RouteSchema } from '@/fastify/types';
import {
  roleCreateSchema,
  roleResponseSchema,
  roleUpdateSchema,
} from '@/modules/roles/schemas/partials';
import { metaSchema } from '@/fastify/schemas';

export const roleSchema: RouteSchema = {
  getAll: {
    querystring: z.object({
      includes: z.string().array().optional(),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      // filter: z.string().optional(),
      // search: z.string().optional(),
      // sort: z.string().optional(),
    }),

    response: {
      200: z.object({
        data: z.array(roleResponseSchema),
        meta: metaSchema,
      }),
      // 401: z.object({}),
      // 403: z.object({}),
      // 400: z.object({}),
    },
  },

  getById: {
    params: z.object({
      id: z.string().transform(s => Number(s)),
    }),
    //   querystring: z.object({
    //     includes: z.string().array().optional(),
    //     scopes: scopesSchema,
    // }),
    response: {
      200: roleResponseSchema,
      // 401: z.object({}),
      // 403: z.object({}),
      // 404: z.object({}),
    },
  },

  create: {
    body: roleCreateSchema,
    response: {
      201: roleResponseSchema,
      // 400: z.object({ message: z.string() }),
      // 409: z.object({ message: z.string() }),
    },
  },

  update: {
    body: roleUpdateSchema,
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {
      200: z.object({
        message: z.string(),
        role: roleResponseSchema,
      }),
    },
  },

  delete: {
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  restore: {
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
};
