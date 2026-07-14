import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function restoreHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const restoredProject = await projectService.restore({
    id,
    currentUser: request.user,
  });

  if (!restoredProject) {
    return reply.status(404).send({
      message: `Project id ${id.toString()} not restored`,
    });
  }

  return reply.status(200).send({
    message: `Restored Project id ${id.toString()}`,
  });
}
