import { FastifyReply, FastifyRequest } from 'fastify';

import { fastify } from '@/fastify';
import { RoleModel, PermissionModel } from '@/sequelize/models';

export async function checkPersimmionDecorator(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { allowedRoles, requiredPermissions } = request.routeOptions.config as {
    allowedRoles?: string[];
    requiredPermissions?: string[];
  };

  fastify.log.info(
    { allowedRoles, userRoles: request.user.roles, requiredPermissions },
    'Checking permissions',
  );

  if (!allowedRoles || allowedRoles.includes('any')) {
    fastify.log.info('Permissions granted (15)');
    return;
  }

  await request.jwtVerify({ ignoreExpiration: true });

  const userRoles = request.user.roles;

  // Admin has all permissions
  if (userRoles.includes('admin')) {
    fastify.log.info('Permissions granted (25)');
    return;
  }

  // 1. Если указаны требуемые права, проверяем их в первую очередь
  if (requiredPermissions && requiredPermissions.length > 0) {
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

    // Если найдены роли пользователя, обладающие требуемыми правами
    if (rolesWithPermissions.length > 0) {
      fastify.log.info('Permissions granted (44)');
      return;
    }

    // Если права были указаны, но не найдены у пользователя — доступ запрещен,
    // даже если роль совпадает с allowedRoles (строгая проверка прав)
    fastify.log.warn(
      { requiredPermissions, userRoles },
      'Permission denied: missing required permissions',
    );
    return reply
      .status(403)
      .send({ message: 'Forbidden: Insufficient permissions' });
  }

  // 2. Если прав не требуется, проверяем только роли
  const hasRole = allowedRoles.some(role => userRoles.includes(role));
  if (hasRole) {
    fastify.log.info('Permissions granted (60)');
    return;
  }

  fastify.log.warn(
    { allowedRoles, requiredPermissions, userRoles },
    'Permission denied',
  );
  return reply
    .status(403)
    .send({ message: 'Forbidden: Insufficient permissions' });
}
