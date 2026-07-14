import type { FastifyReply, FastifyRequest } from 'fastify';

import { taskService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { parseIncludes } from '@/fastify/helpers';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10, scopes },
    user: currentUser,
  } = request;

  const result = await taskService.getAll({
    page,
    limit,
    scopes,
    currentUser,
    include: parseIncludes(request),
  });

  return reply.status(200).send(result);
}
