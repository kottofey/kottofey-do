import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { ProjectMembersModel } from '@/sequelize/models';
import { PROJECT_MEMBER_SCOPE_HANDLERS } from '@/sequelize/models/ProjectMembers';
import { parseIncludes, parseScopes } from '@/fastify/helpers';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10, scopes },
  } = request;

  const offset = (page - 1) * limit;

  const { rows, count } = await ProjectMembersModel.scope(
    parseScopes(scopes, PROJECT_MEMBER_SCOPE_HANDLERS),
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
