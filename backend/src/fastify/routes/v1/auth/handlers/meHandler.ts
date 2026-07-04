import type { FastifyReply, FastifyRequest } from 'fastify';
import { Op } from 'sequelize';

import { UserModel } from '@/sequelize/models';

export async function meHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const user = await UserModel.findOne({
    where: {
      id: request.user.id,
      deleted_at: { [Op.is]: null },
    },
    attributes: {
      exclude: ['password_hash'],
    },
    include: ['roles'],
  });

  if (!user) {
    return reply.code(401).send();
  }

  return reply.send(user);
}
