import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';
import { projectSchema } from './schemas/projectSchema';

import type { RouteController } from '@/fastify/types';

export const projectsController: RouteController = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: projectSchema.getAll,
    allowedRoles: ['admin'],
    requiredPermissions: ['project:read'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: projectSchema.getById,
    allowedRoles: ['admin'],
    requiredPermissions: ['project:read'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: projectSchema.create,
    allowedRoles: ['admin'],
    requiredPermissions: ['project:create'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: projectSchema.update,
    allowedRoles: ['admin'],
    requiredPermissions: ['project:update'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: projectSchema.delete,
    allowedRoles: ['admin'],
    requiredPermissions: ['project:delete'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: projectSchema.restore,
    allowedRoles: ['admin'],
    requiredPermissions: ['project:restore'],
  },
};
