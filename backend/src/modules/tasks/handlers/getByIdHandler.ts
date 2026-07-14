import type { FastifyReply, FastifyRequest } from 'fastify';

import { taskService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const task = await taskService.getById({
    id,
    currentUser: request.user,
    include: parseIncludes(request),
  });

  if (!task) {
    return reply.status(404).send({ message: 'Task not found' });
  }

  return reply.status(200).send(task);
}
