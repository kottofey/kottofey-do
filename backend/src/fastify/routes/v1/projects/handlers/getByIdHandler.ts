import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';
import { ProjectModel } from '@/sequelize/models';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const project = await ProjectModel.findOne({
    include: parseIncludes(request),
    where: { id },
  });

  if (!project) {
    return reply.status(404).send({ message: 'Project not found' });
  }

  return reply.status(200).send(project);
}
