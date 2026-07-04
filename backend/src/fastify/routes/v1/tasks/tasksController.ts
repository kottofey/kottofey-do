import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';

import type { RouteController } from '@/fastify/types';
import { taskSchema } from '@/fastify/schemas';

export const tasksController: RouteController = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: taskSchema.getAll,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: taskSchema.getById,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: taskSchema.create,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: taskSchema.update,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: taskSchema.delete,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: taskSchema.restore,
    allowedRoles: ['admin', 'user'],
  },
};
