import { FastifyReply, FastifyRequest } from 'fastify';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { UserModel } from '@/sequelize/models';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const count = await UserModel.destroy({ where: { id } });

  if (count === 0) {
    return reply.status(404).send({
      message: `User id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Deleted User id ${id.toString()}`,
  });
}
