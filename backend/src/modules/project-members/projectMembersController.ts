// import {
//   getAllHandler,
//   getByIdHandler,
//   createHandler,
//   updateHandler,
//   deleteHandler,
//   restoreHandler,
// } from './handlers';
// import { projectMemberSchema } from './schemas/projectMemberSchema';
//
// import type { RouteController } from '@/fastify/types';
//
// export const projectMembersController: RouteController = {
//   // -----------------------------------------------------------------------------
//   // Get All Items
//   // -----------------------------------------------------------------------------
//   getAll: {
//     handler: getAllHandler,
//     schema: projectMemberSchema.getAll,
//     allowedRoles: ['admin'],
//     requiredPermissions: ['project-member:read'],
//   },
//
//   // -----------------------------------------------------------------------------
//   // Get Item By ID
//   // -----------------------------------------------------------------------------
//   getById: {
//     handler: getByIdHandler,
//     schema: projectMemberSchema.getById,
//     allowedRoles: ['admin'],
//     requiredPermissions: ['project-member:read'],
//   },
//
//   // -----------------------------------------------------------------------------
//   // Create Item
//   // -----------------------------------------------------------------------------
//   create: {
//     handler: createHandler,
//     schema: projectMemberSchema.create,
//     allowedRoles: ['admin'],
//     requiredPermissions: ['project-member:create'],
//   },
//
//   // -----------------------------------------------------------------------------
//   // Update Item
//   // -----------------------------------------------------------------------------
//   update: {
//     handler: updateHandler,
//     schema: projectMemberSchema.update,
//     allowedRoles: ['admin'],
//     requiredPermissions: ['project-member:update'],
//   },
//
//   // -----------------------------------------------------------------------------
//   // Delete Item
//   // -----------------------------------------------------------------------------
//   delete: {
//     handler: deleteHandler,
//     schema: projectMemberSchema.delete,
//     allowedRoles: ['admin'],
//     requiredPermissions: ['project-member:delete'],
//   },
//
//   // -----------------------------------------------------------------------------
//   // Restore Item
//   // -----------------------------------------------------------------------------
//   restore: {
//     handler: restoreHandler,
//     schema: projectMemberSchema.restore,
//     allowedRoles: ['admin'],
//     requiredPermissions: ['project-member:restore'],
//   },
// };
