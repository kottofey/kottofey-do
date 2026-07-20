import { FastifyReply, FastifyRequest } from 'fastify';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { roleService } from '@/modules/roles';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const deleted = await roleService.delete({ id, currentUser: request.user });

  if (!deleted) {
    return reply.status(404).send({
      message: `Role id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Deleted role id ${id.toString()}`,
  });
}
