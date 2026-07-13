import type { FastifyReply, FastifyRequest } from 'fastify';

import { taskService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const {
    user: { roles, id: userId },
  } = request;

  const isAdmin = roles.some(r => r === 'admin');

  const updatedTask = await taskService.update(
    id,
    request.body as Record<string, unknown>,
    userId,
    isAdmin,
  );

  if (!updatedTask) {
    return reply.status(404).send({
      message: `Task id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Updated task id ${id.toString()}`,
  });
}
