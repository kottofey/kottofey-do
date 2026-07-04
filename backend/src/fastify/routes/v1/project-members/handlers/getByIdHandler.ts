import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';
import { ProjectMembersModel } from '@/sequelize/models';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const projectMember = await ProjectMembersModel.findOne({
    include: parseIncludes(request),
    where: { id },
  });

  if (!projectMember) {
    return reply.status(404).send({ message: 'Project member not found' });
  }

  return reply.status(200).send(projectMember);
}
