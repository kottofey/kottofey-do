import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';
import { TaskModel } from '@/sequelize/models';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const task = await TaskModel.findOne({
    include: parseIncludes(request),
    where: { id },
  });

  if (!task) {
    return reply.status(404).send({ message: 'Task not found' });
  }

  return reply.status(200).send(task);
}
