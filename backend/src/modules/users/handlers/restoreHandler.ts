import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { userService } from '@/modules/users';

export async function restoreHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const restored = await userService.restore({ id });

  if (!restored) {
    return reply.status(404).send({
      message: `User id ${id.toString()} was not restored`,
    });
  }

  return reply.status(200).send({
    message: `Restored user id ${id.toString()}`,
  });
}
