import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const project = await projectService.getById({
    id,
    currentUser: request.user,
    include: parseIncludes(request),
  });

  if (!project) {
    return reply.status(404).send({ message: 'Project not found' });
  }

  return reply.status(200).send(project);
}
