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
    allowedRoles: ['any'],
    requiredPermissions: [],
  },

  login: {
    handler: loginHandler,
    schema: authSchema.login,
    allowedRoles: ['any'],
    requiredPermissions: [],
  },

  logout: {
    handler: logoutHandler,
    schema: authSchema.logout,
    allowedRoles: ['any'],
    requiredPermissions: [],
  },
};
