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
    allowedRoles: ['admin'],
    requiredPermissions: ['user:read'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: userSchema.getById,
    allowedRoles: ['admin'],
    requiredPermissions: ['user:read'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: userSchema.create,
    allowedRoles: ['admin'],
    requiredPermissions: ['user:create'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: userSchema.update,
    allowedRoles: ['admin', 'user'],
    requiredPermissions: ['user:update'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: userSchema.delete,
    allowedRoles: ['admin'],
    requiredPermissions: ['user:delete'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: userSchema.restore,
    allowedRoles: ['admin'],
    requiredPermissions: ['user:restore'],
  },

  me: {
    method: 'GET',
    url: 'me',
    handler: meHandler,
    schema: userSchema.me,
    allowedRoles: ['any'],
    requiredPermissions: [],
  },

  login: {
    method: 'POST',
    url: 'login',
    handler: loginHandler,
    schema: userSchema.login,
    allowedRoles: [],
    requiredPermissions: [],
  },

  logout: {
    method: 'DELETE',
    url: 'logout',
    handler: logoutHandler,
    schema: userSchema.logout,
    allowedRoles: ['any'],
    requiredPermissions: [],
  },
};
