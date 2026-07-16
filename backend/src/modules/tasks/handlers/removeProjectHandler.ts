import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { taskService } from '@/modules/tasks';
import { getIdFromParams } from '@/fastify/helpers';

export async function removeProjectHandler(
  request: FastifyRequest<{
    Querystring: CommonQuery;
  }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const taskId = getIdFromParams(request);
  await taskService.removeProject({
    taskId,
    currentUser: request.user,
  });

  return reply.send({ message: 'oooook' });
}
