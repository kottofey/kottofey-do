import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';

import type { RouteController } from '@/fastify/types';
import { projectSchema } from '@/fastify/schemas';

export const projectsController: RouteController = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: projectSchema.getAll,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: projectSchema.getById,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: projectSchema.create,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: projectSchema.update,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: projectSchema.delete,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: projectSchema.restore,
    allowedRoles: ['admin', 'user'],
  },
};
