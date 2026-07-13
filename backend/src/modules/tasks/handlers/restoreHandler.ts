import type { FastifyReply, FastifyRequest } from 'fastify';

import { taskService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function restoreHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const {
    user: { roles, id: userId },
  } = request;

  const isAdmin = roles.some(r => r === 'admin');

  const restoredTask = await taskService.restore(id, userId, isAdmin);

  if (!restoredTask) {
    return reply.status(404).send({
      message: `Task id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Restored task id ${id.toString()}`,
  });
}
