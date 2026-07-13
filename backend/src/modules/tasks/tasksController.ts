import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';
import { taskSchema } from './schemas/taskSchema';

import type { RouteController } from '@/fastify/types';

export const tasksController: RouteController = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: taskSchema.getAll,
    allowedRoles: ['admin'],
    requiredPermissions: ['task:read'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: taskSchema.getById,
    allowedRoles: ['admin'],
    requiredPermissions: ['task:read'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: taskSchema.create,
    allowedRoles: ['admin'],
    requiredPermissions: ['task:create'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: taskSchema.update,
    allowedRoles: ['admin'],
    requiredPermissions: ['task:update'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: taskSchema.delete,
    allowedRoles: ['admin'],
    requiredPermissions: ['task:delete'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: taskSchema.restore,
    allowedRoles: ['admin'],
    requiredPermissions: ['task:restore'],
  },
};
