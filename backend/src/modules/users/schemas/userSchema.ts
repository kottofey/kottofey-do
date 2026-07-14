import { z } from 'zod';

import {
  userCreateSchema,
  userResponseSchema,
  userUpdateSchema,
  jwtUser,
} from './partials';

import { metaSchema } from '@/fastify/schemas/metaSchema';
import {
  AllCrudMethods,
  AuthMethods,
  RouteControllerConfig,
} from '@/fastify/types';
import { USER_SCOPE_HANDLERS } from '@/sequelize/models/User';

const scopeKeys = Object.keys(USER_SCOPE_HANDLERS) as [string, ...string[]];
const scopesSchema = z
  .array(z.enum(scopeKeys))
  .or(z.record(z.string(), z.unknown()))
  .optional();

export const userSchema: Record<
  AllCrudMethods | AuthMethods,
  RouteControllerConfig['schema']
> = {
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
        data: z.array(userResponseSchema),
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
      200: z.object({
        message: z.string(),
        user: userResponseSchema,
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

  me: {
    response: {
      200: jwtUser,
      // 401: z.object({}),
      // 403: z.object({}),
      // 400: z.object({}),
    },
  },

  login: {
    body: z.object({
      email: z.email(),
      password: z.string(),
    }),
    response: {
      200: z.object({
        message: z.string(),
        user: jwtUser,
      }),
    },
  },

  logout: {
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
};
