import { FastifyReply, FastifyRequest } from 'fastify';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { userService } from '@/modules/users';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const {
    user: { roles, id: userId },
  } = request;

  const isAdmin = roles.some(r => r === 'admin');

  const deleted = await userService.delete(id, userId, isAdmin);

  if (!deleted) {
    return reply.status(404).send({
      message: `User id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Deleted User id ${id.toString()}`,
  });
}
