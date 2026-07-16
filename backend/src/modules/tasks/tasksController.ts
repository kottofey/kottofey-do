import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
  removeProjectHandler,
  attachProjectHandler,
} from './handlers';
import { taskSchema } from './schemas/taskSchema';

import type { RouteController } from '@/fastify/types';

export const tasksController: RouteController<
  'attachProject' | 'removeProject'
> = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: taskSchema.getAll,
    requiredPermissions: ['task:read'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: taskSchema.getById,
    requiredPermissions: ['task:read'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: taskSchema.create,
    requiredPermissions: ['task:create'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: taskSchema.update,
    requiredPermissions: ['task:update'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: taskSchema.delete,
    requiredPermissions: ['task:delete'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: taskSchema.restore,
    requiredPermissions: ['task:restore'],
  },

  attachProject: {
    method: 'PUT',
    url: '/:id/attach-project/:projectId',
    handler: attachProjectHandler,
    schema: taskSchema.attachProject,
    requiredPermissions: ['task:update'],
  },

  removeProject: {
    method: 'PUT',
    url: '/:id/remove-project',
    handler: removeProjectHandler,
    schema: taskSchema.removeProject,
    requiredPermissions: ['task:update'],
  },
};
