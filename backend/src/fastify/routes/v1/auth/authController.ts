import { loginHandler, logoutHandler, meHandler } from './handlers';

import type { RouteController } from '@/fastify/types';
import { authSchema } from '@/fastify/schemas';

export const authController: RouteController = {
  // -----------------------------------------------------------------------------
  // Me
  // -----------------------------------------------------------------------------
  me: {
    handler: meHandler,
    schema: authSchema.me,
    allowedRoles: ['admin', 'user', 'guest'],
  },

  login: {
    handler: loginHandler,
    schema: authSchema.login,
    allowedRoles: ['admin', 'user', 'guest'],
  },

  logout: {
    handler: logoutHandler,
    schema: authSchema.logout,
    allowedRoles: ['admin', 'user', 'guest'],
  },
};
