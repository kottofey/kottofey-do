import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
  logoutHandler,
  loginHandler,
  meHandler,
} from './handlers';
import { userSchema } from './schemas/userSchema';

import type { RouteController } from '@/fastify/types';

export const usersController: RouteController<'me' | 'login' | 'logout'> = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: userSchema.getAll,
    requiredPermissions: ['user:read'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: userSchema.getById,
    requiredPermissions: ['user:read'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: userSchema.create,
    requiredPermissions: ['user:create'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: userSchema.update,
    requiredPermissions: ['user:update'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: userSchema.delete,
    requiredPermissions: ['user:delete'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: userSchema.restore,
    requiredPermissions: ['user:restore'],
  },

  // -----------------------------------------------------------------------------
  // Auth module
  // -----------------------------------------------------------------------------

  me: {
    method: 'GET',
    url: 'me',
    handler: meHandler,
    schema: userSchema.me,
    requiredPermissions: ['user:read'],
  },

  login: {
    method: 'POST',
    url: 'login',
    handler: loginHandler,
    schema: userSchema.login,
    requiredPermissions: [],
    isPublic: true,
  },

  logout: {
    method: 'DELETE',
    url: 'logout',
    handler: logoutHandler,
    schema: userSchema.logout,
    requiredPermissions: ['user:read'],
  },
};
