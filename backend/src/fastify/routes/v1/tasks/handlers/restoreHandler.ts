import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { TaskModel } from '@/sequelize/models';

export async function restoreHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const {
    user: { roles },
  } = request;

  const isAdmin = roles.some(r => r === 'admin');

  await TaskModel.restore({
    where: isAdmin ? { id } : { id, owner_id: request.user.id },
  });

  return reply.status(200).send({
    message: `Restored task id ${id.toString()}`,
  });
}
