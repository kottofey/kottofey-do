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

  const userId = request.user.id;
  const isAdmin = request.user.roles.some(r => r === 'admin');

  const result = await projectService.getAll({
    page,
    limit,
    scopes,
    userId,
    isAdmin,
    include: parseIncludes(request),
  });

  return reply.status(200).send(result);
}
