import type { FastifyReply, FastifyRequest } from 'fastify';

import { roleService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const role = await roleService.getById({
    id,
    currentUser: request.user,
  });

  if (!role) {
    return reply
      .status(404)
      .send({ message: `Role id ${id.toString()} not found` });
  }

  return reply.status(200).send(role);
}
