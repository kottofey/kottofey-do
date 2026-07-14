import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { parseIncludes } from '@/fastify/helpers';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10, scopes },
  } = request;

  const result = await projectService.getAll({
    page,
    limit,
    scopes,
    currentUser: request.user,
    include: parseIncludes(request),
  });

  return reply.status(200).send(result);
}
