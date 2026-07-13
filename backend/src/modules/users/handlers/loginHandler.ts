import type { FastifyReply, FastifyRequest } from 'fastify';

import { userService } from '..';

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const user = await userService.login({ reply, request });

  if (!user) {
    return reply.status(401).send({ message: 'Неверные данные для входа' });
  }

  return reply.send({
    message: 'Logged in successfully',
    user,
  });
}
