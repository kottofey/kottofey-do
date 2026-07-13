import { FastifyReply, FastifyRequest } from 'fastify';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { userService } from '@/modules/users';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const deleted = await userService.delete({ id, currentUser: request.user });

  if (!deleted) {
    return reply.status(404).send({
      message: `User id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Deleted User id ${id.toString()}`,
  });
}
