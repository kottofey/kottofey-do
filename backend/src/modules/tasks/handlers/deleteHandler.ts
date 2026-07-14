import { FastifyReply, FastifyRequest } from 'fastify';

import { taskService } from '..';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const deleted = await taskService.delete({
    id,
    currentUser: request.user,
    force: Boolean(request.query.force),
  });

  if (!deleted) {
    return reply.status(404).send({
      message: `Task id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `${request.query.force ? 'Killed' : 'Deleted'} task id ${id.toString()}`,
  });
}
