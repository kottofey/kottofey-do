import type { FastifyReply, FastifyRequest } from 'fastify';

import { userService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const user = await userService.getById({
    id,
    currentUser: request.user,
    include: parseIncludes(request),
  });

  if (!user) {
    return reply
      .status(404)
      .send({ message: `User id ${id.toString()} not found` });
  }

  return reply.status(200).send(user);
}
