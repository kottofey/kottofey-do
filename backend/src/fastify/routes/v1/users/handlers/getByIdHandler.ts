import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';
import { UserModel } from '@/sequelize/models';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const user = await UserModel.findOne({
    include: parseIncludes(request),
    where: { id },
  });

  if (!user) {
    return reply.status(404).send({ message: `User id ${id.toString()} not found` });
  }

  return reply.status(200).send(user);
}
