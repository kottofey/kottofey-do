import { FastifyReply, FastifyRequest } from 'fastify';

import { fastify } from '@/fastify';
import { RoleModel, PermissionModel } from '@/sequelize/models';

export async function checkPersimmionDecorator(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { requiredPermissions } = request.routeOptions.config as {
    requiredPermissions?: string[];
  };

  fastify.log.info('Checking permissions');

  await request.jwtVerify({ ignoreExpiration: true });

  const userRoles = request.user.roles;

  if (userRoles.length > 0) {
    const rolesWithPermissions = await RoleModel.findAll({
      where: { name: userRoles },
      include: [
        {
          model: PermissionModel,
          where: { name: requiredPermissions },
          required: true,
        },
      ],
    });

    if (rolesWithPermissions.length > 0) {
      fastify.log.info('Permissions granted');
      return;
    }
  }

  fastify.log.warn('Insufficient permissions');
  return reply
    .status(403)
    .send({ message: 'Forbidden: Insufficient permissions' });
}
