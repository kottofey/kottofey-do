import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';

import type { RouteController } from '@/fastify/types';
import { userSchema } from '@/fastify/schemas';

export const usersController: RouteController = {
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
    allowedRoles: ['admin'],
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
};
