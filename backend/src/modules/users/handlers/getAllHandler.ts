import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { parseIncludes } from '@/fastify/helpers';
import { userService } from '@/modules/users';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10, scopes },
    user,
  } = request;

  const result = await userService.getAll({
    page,
    limit,
    scopes,
    currentUser: user,
    include: parseIncludes(request),
  });

  return reply.status(200).send(result);
}
