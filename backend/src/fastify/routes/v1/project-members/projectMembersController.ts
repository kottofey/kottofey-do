import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  restoreHandler,
} from './handlers';

import type { RouteController } from '@/fastify/types';
import { projectMemberSchema } from '@/fastify/schemas';

export const projectMembersController: RouteController = {
  // -----------------------------------------------------------------------------
  // Get All Items
  // -----------------------------------------------------------------------------
  getAll: {
    handler: getAllHandler,
    schema: projectMemberSchema.getAll,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Get Item By ID
  // -----------------------------------------------------------------------------
  getById: {
    handler: getByIdHandler,
    schema: projectMemberSchema.getById,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Create Item
  // -----------------------------------------------------------------------------
  create: {
    handler: createHandler,
    schema: projectMemberSchema.create,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Update Item
  // -----------------------------------------------------------------------------
  update: {
    handler: updateHandler,
    schema: projectMemberSchema.update,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Delete Item
  // -----------------------------------------------------------------------------
  delete: {
    handler: deleteHandler,
    schema: projectMemberSchema.delete,
    allowedRoles: ['admin', 'user'],
  },

  // -----------------------------------------------------------------------------
  // Restore Item
  // -----------------------------------------------------------------------------
  restore: {
    handler: restoreHandler,
    schema: projectMemberSchema.restore,
    allowedRoles: ['admin', 'user'],
  },
};
