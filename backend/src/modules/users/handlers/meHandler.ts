import type { FastifyReply, FastifyRequest } from 'fastify';

import { userService } from '..';

export async function meHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const me = await userService.getMe({
    reply,
    request,
  });

  if (!me) {
    return reply.code(401).send();
  }

  return reply.send(me);
}
