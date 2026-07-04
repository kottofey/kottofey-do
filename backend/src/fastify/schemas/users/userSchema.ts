import { z } from 'zod';

import { metaSchema } from '../metaSchema';

import { userBaseSchema, userCreateSchema, userResponseSchema, userUpdateSchema } from './partials';

import { AllCrudMethods, RouteControllerConfig } from '@/fastify/types';
import { USER_SCOPE_HANDLERS } from '@/sequelize/models/User';

const scopeKeys = Object.keys(USER_SCOPE_HANDLERS) as [string, ...string[]];
const scopesSchema = z.array(z.enum(scopeKeys)).or(z.record(z.string(), z.unknown())).optional();

export const userSchema: Record<AllCrudMethods, RouteControllerConfig['schema']> = {
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
        data: z.array(userBaseSchema),
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
      200: userResponseSchema,

      // 401: z.object({}),
      // 403: z.object({}),
      // 404: z.object({}),
    },
  },

  create: {
    body: userCreateSchema,
    response: {
      201: userResponseSchema,
      // 400: z.object({ message: z.string() }),
      // 409: z.object({ message: z.string() }),
    },
  },

  update: {
    body: userUpdateSchema,
    params: z.object({
      id: z.coerce.number(),
    }),
    response: {
      200: userResponseSchema,
    },
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
