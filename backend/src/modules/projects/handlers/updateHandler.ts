import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const { roles, id: userId } = request.user;
  const isAdmin = roles.some(r => r === 'admin');

  const updatedProject = await projectService.update(
    id,
    request.body as Record<string, unknown>,
    userId,
    isAdmin,
  );

  if (!updatedProject) {
    return reply.status(404).send({
      message: `Project id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Updated project id ${id.toString()}`,
  });
}
