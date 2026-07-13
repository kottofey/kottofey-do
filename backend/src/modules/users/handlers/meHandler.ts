import type { FastifyReply, FastifyRequest } from 'fastify';

import { userService } from '..';

export async function meHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const user = await userService.findUserExcludingPassword(request.user.id);

  if (!user) {
    return reply.code(401).send();
  }

  return reply.send(user);
}
