import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { projectService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { projectUpdateSchema } from '@/modules/projects/schemas/partials';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const updatedProject = await projectService.update({
    id,
    currentUser: request.user,
    data: request.body as z.infer<typeof projectUpdateSchema>,
  });

  if (!updatedProject) {
    return reply.status(404).send({
      message: `Project id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Updated project id ${id.toString()}`,
  });
}
