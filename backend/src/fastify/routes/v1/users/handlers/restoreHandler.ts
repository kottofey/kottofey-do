import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { UserModel } from '@/sequelize/models';

export async function restoreHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const user = await UserModel.findOne({ where: { id }, paranoid: false });

  if (!user) {
    return reply.status(404).send({
      message: `User id ${id.toString()} not found`,
    });
  }

  if (!user.deleted_at) {
    return reply.status(404).send({
      message: `User id ${id.toString()} was not deleted`,
    });
  }

  await UserModel.restore({ where: { id } });

  return reply.status(200).send({
    message: `Restored user id ${id.toString()}`,
  });
}
