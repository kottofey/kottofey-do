import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';
import { roleSchema } from './schemas/roleSchema';

import type { RouteController } from '@/fastify/types';

export const rolesController: RouteController = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: roleSchema.getAll,
    requiredPermissions: ['role:read'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: roleSchema.getById,
    requiredPermissions: ['role:read'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: roleSchema.create,
    requiredPermissions: ['role:create'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: roleSchema.update,
    requiredPermissions: ['role:update'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: roleSchema.delete,
    requiredPermissions: ['role:delete'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: roleSchema.restore,
    requiredPermissions: ['role:restore'],
  },
};
