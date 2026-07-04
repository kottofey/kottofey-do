import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { ProjectModel } from '@/sequelize/models';
import { parseIncludes, parseScopes } from '@/fastify/helpers';
import { PROJECT_SCOPE_HANDLERS } from '@/sequelize/models/Project';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10, scopes },
  } = request;

  const offset = (page - 1) * limit;

  const { rows, count } = await ProjectModel.scope(
    parseScopes(scopes, PROJECT_SCOPE_HANDLERS),
  ).findAndCountAll({
    include: parseIncludes(request),
    limit,
    offset,
    distinct: true,
  });

  return reply.status(200).send({
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  });
}
