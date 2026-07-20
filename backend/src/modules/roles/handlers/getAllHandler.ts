import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { parseIncludes } from '@/fastify/helpers';
import { roleService } from '@/modules/roles';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10 },
    user,
  } = request;

  const result = await roleService.getAll({
    page,
    limit,
    currentUser: user,
    include: parseIncludes(request),
  });

  return reply.status(200).send(result);
}
