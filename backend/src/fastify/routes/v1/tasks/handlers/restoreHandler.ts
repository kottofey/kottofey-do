import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { TaskModel } from '@/sequelize/models';

export async function restoreHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  await TaskModel.restore({ where: { id, owner_id: request.user.id } });

  return reply.status(200).send({
    message: `Restored task id ${id.toString()}`,
  });
}
