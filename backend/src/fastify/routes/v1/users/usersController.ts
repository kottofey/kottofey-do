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
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: userSchema.getById,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: userSchema.create,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: userSchema.update,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: userSchema.delete,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: userSchema.restore,
    allowedRoles: ['admin', 'user'],
  },
};
