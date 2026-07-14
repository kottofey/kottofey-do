import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { taskService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { taskUpdateSchema } from '@/modules/tasks/schemas/partials';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const updatedTask = await taskService.update({
    id,
    currentUser: request.user,
    data: request.body as z.infer<typeof taskUpdateSchema>,
  });

  if (!updatedTask) {
    return reply.status(404).send({
      message: `Task id ${id.toString()} not updated`,
    });
  }

  return reply.status(200).send({
    message: `Updated task id ${id.toString()}`,
  });
}
