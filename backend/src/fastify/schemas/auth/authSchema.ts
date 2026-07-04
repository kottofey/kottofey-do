import { z } from 'zod';

import { jwtUser } from './partials/jwtUser';

import { RouteControllerConfig } from '@/fastify/types';

export const authSchema: Record<string, RouteControllerConfig['schema']> = {
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
