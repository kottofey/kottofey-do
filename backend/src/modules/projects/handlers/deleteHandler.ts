import { FastifyReply, FastifyRequest } from 'fastify';

import { projectService } from '..';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const deleted = await projectService.delete({
    id,
    currentUser: request.user,
  });

  if (!deleted) {
    return reply.status(404).send({
      message: `Project id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Deleted Project id ${id.toString()}`,
  });
}
