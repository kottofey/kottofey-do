import { z } from 'zod';

import {
  projectCreateSchema,
  projectBaseSchema,
  projectUpdateSchema,
} from './partials';

import { metaSchema } from '@/fastify/schemas/metaSchema';
import { RouteSchema } from '@/fastify/types';
import { PROJECT_SCOPE_HANDLERS } from '@/sequelize/models/Project';

const scopeKeys = Object.keys(PROJECT_SCOPE_HANDLERS) as [string, ...string[]];
const scopesSchema = z
  .array(z.enum(scopeKeys))
  .or(z.record(z.string(), z.unknown()))
  .optional();

export const projectSchema: RouteSchema = {
  getAll: {
    querystring: z.object({
      includes: z.string().array().optional(),
      scopes: scopesSchema,
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      // filter: z.string().optional(),
      // search: z.string().optional(),
      // sort: z.string().optional(),
    }),

    response: {
      200: z.object({
        data: z.array(projectBaseSchema),
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
    querystring: z.object({
      includes: z.string().array().optional(),
      // scopes: scopesSchema,
    }),
    response: {
      200: projectBaseSchema,
      // 401: z.object({}),
      // 403: z.object({}),
      // 404: z.object({}),
    },
  },

  create: {
    body: projectCreateSchema,
    response: {
      201: projectBaseSchema,

      // 400: z.object({ message: z.string() }),
      // 409: z.object({ message: z.string() }),
    },
  },

  update: {
    body: projectUpdateSchema,
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {},
  },

  delete: {
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {},
  },

  restore: {
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {},
  },
};
