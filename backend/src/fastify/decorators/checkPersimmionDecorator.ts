import { FastifyReply, FastifyRequest } from 'fastify';

import { fastify } from '@/fastify';

export async function checkPersimmionDecorator(request: FastifyRequest, reply: FastifyReply) {
  const allowedRoles = request.routeOptions.config.allowedRoles;

  fastify.log.info('Checking permissions');

  if (!allowedRoles || allowedRoles.includes('any')) {
    return;
  }

  await request.jwtVerify({ ignoreExpiration: true });

  const userRoles = request.user.roles;

  if (userRoles.includes('admin')) {
    return;
  }

  const hasRole = allowedRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    fastify.log.warn({ allowedRoles, userRoles }, 'Permission denied');
    return reply.status(403).send({ message: 'Forbidden: Insufficient permissions' });
  }
}
